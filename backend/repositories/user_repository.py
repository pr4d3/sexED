from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from models.user import User
from models.role import Role
from models.profile import UserProfile
from schemas.user_schema import UserProfileUpdate

async def get_role_by_code(db: AsyncSession, role_code: str) -> Role:
    result = await db.execute(select(Role).where(Role.role_code == role_code))
    return result.scalars().first()

async def get_user_by_email_or_username(db: AsyncSession, identifier: str) -> User:
    if not identifier:
        return None
    clean_id = identifier.strip().lower()
    result = await db.execute(
        select(User).where(
            or_(
                func.lower(User.email) == clean_id,
                func.lower(User.username) == clean_id
            )
        )
    )
    return result.scalars().first()

async def get_user_by_id(db: AsyncSession, user_id: str) -> User:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: User) -> User:
    db.add(user)
    await db.flush() # flush to get user.id
    
    # Create empty profile automatically
    profile = UserProfile(user_id=user.id)
    db.add(profile)
    
    await db.commit()
    await db.refresh(user)
    return user

async def get_user_with_profile(db: AsyncSession, user_id: str) -> User:
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(User)
        .options(selectinload(User.profile), selectinload(User.role))
        .where(User.id == user_id)
    )
    return result.scalars().first()

async def update_profile_data(db: AsyncSession, user_id: str, profile_data: UserProfileUpdate) -> User:
    user = await get_user_with_profile(db, user_id)
    if not user:
        return None
    
    if profile_data.full_name is not None:
        user.full_name = profile_data.full_name
        
    profile = user.profile
    if not profile:
        profile = UserProfile(user_id=user.id)
        db.add(profile)
        
    if profile_data.avatar_url is not None:
        profile.avatar_url = profile_data.avatar_url
    if profile_data.gender is not None:
        profile.gender = profile_data.gender
    if profile_data.date_of_birth is not None:
        profile.date_of_birth = profile_data.date_of_birth
    if profile_data.phone_number is not None:
        profile.phone_number = profile_data.phone_number
    if profile_data.bio is not None:
        profile.bio = profile_data.bio
        
    await db.commit()
    await db.refresh(user)
    return user
