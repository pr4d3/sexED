from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from repositories import user_repository
from schemas.user_schema import UserProfileUpdate
from uuid import UUID

async def get_profile(db: AsyncSession, user_id: UUID):
    user = await user_repository.get_user_with_profile(db, str(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
        
    profile = user.profile
    return {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role.role_code if user.role else "UNKNOWN",
        "avatar_url": profile.avatar_url if profile else None,
        "gender": profile.gender if profile else None,
        "date_of_birth": profile.date_of_birth if profile else None,
        "phone_number": profile.phone_number if profile else None,
        "bio": profile.bio if profile else None
    }

async def update_profile(db: AsyncSession, user_id: UUID, profile_data: UserProfileUpdate):
    user = await user_repository.update_profile_data(db, str(user_id), profile_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
        
    return {
        "user_id": user.id,
        "full_name": user.full_name,
        "avatar_url": user.profile.avatar_url if user.profile else None
    }
