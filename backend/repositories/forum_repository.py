from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from sqlalchemy.orm import selectinload, joinedload
from models.forum import ForumCategory, ForumPost, ForumComment
from models.user import User
from uuid import UUID

async def get_categories(db: AsyncSession) -> list[ForumCategory]:
    result = await db.execute(select(ForumCategory).order_by(ForumCategory.name))
    return result.scalars().all()

async def get_category_by_id(db: AsyncSession, category_id: int) -> ForumCategory:
    result = await db.execute(select(ForumCategory).where(ForumCategory.id == category_id))
    return result.scalars().first()

async def get_posts(db: AsyncSession, category_id: int = None, search: str = None, include_hidden_deleted: bool = False) -> list[ForumPost]:
    query = (
        select(ForumPost)
        .options(
            joinedload(ForumPost.category),
            joinedload(ForumPost.author).joinedload(User.role),
            joinedload(ForumPost.author).joinedload(User.profile)
        )
        .order_by(ForumPost.created_at.desc())
    )
    
    if not include_hidden_deleted:
        query = query.where(ForumPost.status == "PUBLISHED")
        
    if category_id:
        query = query.where(ForumPost.category_id == category_id)
        
    if search:
        query = query.where(
            or_(
                ForumPost.title.ilike(f"%{search}%"),
                ForumPost.content.ilike(f"%{search}%")
            )
        )
        
    result = await db.execute(query)
    return result.scalars().all()

async def get_post_comment_count(db: AsyncSession, post_id: UUID, include_hidden_deleted: bool = False) -> int:
    query = select(func.count(ForumComment.id)).where(ForumComment.post_id == post_id)
    if not include_hidden_deleted:
        query = query.where(ForumComment.status == "PUBLISHED")
    result = await db.execute(query)
    return result.scalar() or 0

async def get_post_by_id(db: AsyncSession, post_id: UUID) -> ForumPost:
    result = await db.execute(
        select(ForumPost)
        .options(
            joinedload(ForumPost.category),
            joinedload(ForumPost.author).joinedload(User.role),
            joinedload(ForumPost.author).joinedload(User.profile)
        )
        .where(ForumPost.id == post_id)
    )
    return result.scalars().first()

async def create_post(db: AsyncSession, post: ForumPost) -> ForumPost:
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post

async def update_post(db: AsyncSession, post: ForumPost) -> ForumPost:
    await db.commit()
    await db.refresh(post)
    return post

# Comments
async def get_post_comments(db: AsyncSession, post_id: UUID, include_hidden_deleted: bool = False) -> list[ForumComment]:
    query = (
        select(ForumComment)
        .options(
            joinedload(ForumComment.author).joinedload(User.role),
            joinedload(ForumComment.author).joinedload(User.profile)
        )
        .where(ForumComment.post_id == post_id)
        .order_by(ForumComment.created_at.asc())
    )
    if not include_hidden_deleted:
        query = query.where(ForumComment.status == "PUBLISHED")
        
    result = await db.execute(query)
    return result.scalars().all()

async def get_comment_by_id(db: AsyncSession, comment_id: UUID) -> ForumComment:
    result = await db.execute(select(ForumComment).where(ForumComment.id == comment_id))
    return result.scalars().first()

async def create_comment(db: AsyncSession, comment: ForumComment) -> ForumComment:
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment

async def update_comment(db: AsyncSession, comment: ForumComment) -> ForumComment:
    await db.commit()
    await db.refresh(comment)
    return comment
