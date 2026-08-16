from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.dependencies import get_current_user, RoleGuard
from models.user import User
from schemas.settings_schema import (
    HomePageResponse, AboutUsResponse, SiteSettingUpdate, SiteSettingUpdateResponse, SiteSettingsListResponse
)
from services import settings_service

router = APIRouter(tags=["General Pages & Settings"])

@router.get("/api/v1/general/home", response_model=HomePageResponse, status_code=status.HTTP_200_OK)
async def get_home(db: AsyncSession = Depends(get_db)):
    data = await settings_service.get_home_page_data(db)
    return HomePageResponse(success=True, data=data)

@router.get("/api/v1/general/about-us", response_model=AboutUsResponse, status_code=status.HTTP_200_OK)
async def get_about_us(db: AsyncSession = Depends(get_db)):
    data = await settings_service.get_about_us_data(db)
    return AboutUsResponse(success=True, data=data)

@router.get("/api/v1/admin/settings", response_model=SiteSettingsListResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(RoleGuard(["ADMIN"]))])
async def list_settings(db: AsyncSession = Depends(get_db)):
    settings = await settings_service.get_all_settings_list(db)
    return SiteSettingsListResponse(success=True, data=settings)

@router.put("/api/v1/admin/settings/{key_name}", response_model=SiteSettingUpdateResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(RoleGuard(["ADMIN"]))])
async def update_setting(key_name: str, setting_data: SiteSettingUpdate, db: AsyncSession = Depends(get_db)):
    result = await settings_service.update_site_setting(db, key_name, setting_data.value_content)
    return SiteSettingUpdateResponse(
        success=True,
        message="Cập nhật cấu hình thành công",
        data=result
    )
