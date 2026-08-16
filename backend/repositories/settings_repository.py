from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.site_setting import SiteSetting

async def get_setting_by_key(db: AsyncSession, key_name: str) -> SiteSetting:
    result = await db.execute(select(SiteSetting).where(SiteSetting.key_name == key_name))
    return result.scalars().first()

async def get_all_settings(db: AsyncSession) -> list[SiteSetting]:
    result = await db.execute(select(SiteSetting).order_by(SiteSetting.key_name))
    return result.scalars().all()

async def update_setting(db: AsyncSession, key_name: str, value_content: str, description: str = None) -> SiteSetting:
    setting = await get_setting_by_key(db, key_name)
    if not setting:
        setting = SiteSetting(key_name=key_name, value_content=value_content, description=description)
        db.add(setting)
    else:
        setting.value_content = value_content
        if description is not None:
            setting.description = description
    await db.commit()
    await db.refresh(setting)
    return setting
