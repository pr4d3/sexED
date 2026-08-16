from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from repositories import forum_repository
from models.forum import ForumPost, ForumComment
from schemas.forum_schema import PostCreate, CommentCreate
from uuid import UUID
from datetime import datetime, timezone

async def get_forum_categories(db: AsyncSession):
    return await forum_repository.get_categories(db)

async def get_forum_feed(db: AsyncSession, category_id: int = None, search: str = None, include_hidden_deleted: bool = False):
    posts = await forum_repository.get_posts(db, category_id, search, include_hidden_deleted)
    
    results = []
    for p in posts:
        comment_count = await forum_repository.get_post_comment_count(db, p.id, include_hidden_deleted)
        
        results.append({
            "id": p.id,
            "category_id": p.category_id,
            "category_name": p.category.name if p.category else "Unknown",
            "title": p.title,
            "short_content": p.content[:150] + "..." if len(p.content) > 150 else p.content,
            "author": {
                "id": p.author_id,
                "full_name": p.author.full_name if p.author else "Unknown",
                "role": p.author.role.role_code if p.author and p.author.role else "UNKNOWN",
                "avatar_url": p.author.profile.avatar_url if p.author and p.author.profile else None
            },
            "comment_count": comment_count,
            "status": p.status,
            "created_at": p.created_at
        })
    return results

def build_comment_tree(comments: list[ForumComment], parent_id: UUID = None) -> list[dict]:
    nodes = []
    for c in comments:
        if c.parent_comment_id == parent_id:
            node = {
                "id": c.id,
                "parent_comment_id": c.parent_comment_id,
                "content": c.content,
                "status": c.status,
                "created_at": c.created_at,
                "author": {
                    "id": c.author_id,
                    "full_name": c.author.full_name if c.author else "Unknown",
                    "role": c.author.role.role_code if c.author and c.author.role else "UNKNOWN",
                    "avatar_url": c.author.profile.avatar_url if c.author and c.author.profile else None
                },
                "replies": build_comment_tree(comments, c.id)
            }
            nodes.append(node)
    return nodes

async def get_post_detail_with_comments(db: AsyncSession, post_id: UUID, include_hidden_deleted: bool = False):
    post = await forum_repository.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài viết.")
        
    if not include_hidden_deleted and post.status != "PUBLISHED":
        raise HTTPException(status_code=404, detail="Bài viết không tồn tại hoặc đã bị ẩn.")
        
    comments = await forum_repository.get_post_comments(db, post_id, include_hidden_deleted)
    comments_tree = build_comment_tree(comments, None)
    
    return {
        "id": post.id,
        "category_id": post.category_id,
        "category_name": post.category.name if post.category else "Unknown",
        "title": post.title,
        "content": post.content,
        "status": post.status,
        "created_at": post.created_at,
        "author": {
            "id": post.author_id,
            "full_name": post.author.full_name if post.author else "Unknown",
            "role": post.author.role.role_code if post.author and post.author.role else "UNKNOWN",
            "avatar_url": post.author.profile.avatar_url if post.author and post.author.profile else None
        },
        "comments": comments_tree
    }

async def create_new_post(db: AsyncSession, author_id: UUID, post_data: PostCreate):
    category = await forum_repository.get_category_by_id(db, post_data.category_id)
    if not category:
        raise HTTPException(status_code=400, detail="Category not found.")
        
    post = ForumPost(
        category_id=post_data.category_id,
        author_id=author_id,
        title=post_data.title,
        content=post_data.content,
        status="PUBLISHED"
    )
    created = await forum_repository.create_post(db, post)
    return {
        "post_id": created.id,
        "title": created.title,
        "status": created.status,
        "created_at": created.created_at
    }

async def create_new_comment(db: AsyncSession, author_id: UUID, post_id: UUID, comment_data: CommentCreate):
    post = await forum_repository.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài viết.")
        
    if comment_data.parent_comment_id:
        parent = await forum_repository.get_comment_by_id(db, comment_data.parent_comment_id)
        if not parent or parent.post_id != post_id:
            raise HTTPException(status_code=400, detail="Bình luận cha không hợp lệ.")
            
    comment = ForumComment(
        post_id=post_id,
        author_id=author_id,
        parent_comment_id=comment_data.parent_comment_id,
        content=comment_data.content,
        status="PUBLISHED"
    )
    
    created = await forum_repository.create_comment(db, comment)
    
    # Eagerly reload author information
    from sqlalchemy.orm import joinedload
    from sqlalchemy import select
    from models.user import User
    
    comment_details = await db.execute(
        select(ForumComment)
        .options(joinedload(ForumComment.author).joinedload(User.profile))
        .where(ForumComment.id == created.id)
    )
    created = comment_details.scalars().first()
    
    return {
        "comment_id": created.id,
        "post_id": created.post_id,
        "content": created.content,
        "created_at": created.created_at,
        "author": {
            "id": created.author_id,
            "full_name": created.author.full_name if created.author else "Unknown",
            "role": created.author.role.role_code if created.author and created.author.role else "UNKNOWN",
            "avatar_url": created.author.profile.avatar_url if created.author and created.author.profile else None
        }
    }

async def moderate_post_status(db: AsyncSession, admin_id: UUID, post_id: UUID, target_status: str):
    post = await forum_repository.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài viết.")
        
    post.status = target_status
    post.moderated_by = admin_id
    await forum_repository.update_post(db, post)
    return {
        "post_id": post.id,
        "status": post.status,
        "moderated_by": post.moderated_by
    }

async def moderate_comment_status(db: AsyncSession, admin_id: UUID, comment_id: UUID, target_status: str):
    comment = await forum_repository.get_comment_by_id(db, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Không tìm thấy bình luận.")
        
    comment.status = target_status
    comment.moderated_by = admin_id
    await forum_repository.update_comment(db, comment)
    return {
        "comment_id": comment.id,
        "status": comment.status,
        "moderated_by": comment.moderated_by
    }
