from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from core.config import settings

# Khởi tạo Async Engine cho SQLAlchemy
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True, # Đặt thành False ở môi trường production
    future=True,
    connect_args={"statement_cache_size": 0}
)

# Khởi tạo Async Session Maker
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base class cho tất cả các model ORM
Base = declarative_base()

# Dependency để lấy database session
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
