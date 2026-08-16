from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from models.user import User
from models.role import Role
from models.session import UserSession
from schemas.auth_schema import UserRegister, UserLogin
from repositories import user_repository, auth_repository
from core import security
from core.config import settings
from datetime import datetime, timezone, timedelta

async def register_user(db: AsyncSession, user_data: UserRegister):
    role = await user_repository.get_role_by_code(db, user_data.role_code)
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role code.")

    existing_user = await user_repository.get_user_by_email_or_username(db, user_data.email)
    if not existing_user:
        existing_user = await user_repository.get_user_by_email_or_username(db, user_data.username)

    if existing_user:
        raise HTTPException(status_code=400, detail="Email or Username already exists.")

    hashed_password = security.get_password_hash(user_data.password)
    
    new_user = User(
        role_id=role.id,
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name
    )
    
    created_user = await user_repository.create_user(db, new_user)
    
    return {
        "user_id": created_user.id,
        "username": created_user.username,
        "email": created_user.email,
        "role": role.role_code
    }

async def authenticate_user(db: AsyncSession, login_data: UserLogin, user_agent: str = None, ip_address: str = None):
    user = await user_repository.get_user_by_email_or_username(db, login_data.username_or_email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    
    if not security.verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
        
    if user.status == "BANNED":
        raise HTTPException(status_code=403, detail="Account is banned.")

    # Load role
    role_result = await db.execute(select(Role).where(Role.id == user.role_id))
    user_role = role_result.scalars().first()
    
    access_token = security.create_access_token(subject=user.id, role_code=user_role.role_code)
    refresh_token_str = security.create_refresh_token()
    
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    session = UserSession(
        user_id=user.id,
        refresh_token=refresh_token_str,
        user_agent=user_agent,
        ip_address=ip_address,
        expires_at=expires_at
    )
    
    await auth_repository.create_session(db, session)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token_str,
        "token_type": "Bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "role": user_role.role_code
        }
    }

async def logout_user(db: AsyncSession, refresh_token: str):
    success = await auth_repository.delete_session(db, refresh_token)
    if not success:
        raise HTTPException(status_code=401, detail="Invalid refresh token.")
