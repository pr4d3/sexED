import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.database import engine
from core.config import settings
from routers import auth_router, user_router, course_router, forum_router, dashboard_router, general_router

# Khởi tạo logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Logic chạy khi khởi động server
    logger.info("Starting up SexEd Platform Backend API...")
    yield
    # Logic chạy khi tắt server
    logger.info("Shutting down API...")
    await engine.dispose()

app = FastAPI(
    title="SexEd Platform API",
    description="Backend API for Vietnamese Sex Education Web Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Cấu hình CORS
origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health Check"])
async def root():
    return {"message": "Welcome to SexEd Platform API", "status": "OK"}

@app.get("/health", tags=["Health Check"])
async def health():
    return {"status": "healthy", "database": "connected"}

# Include routers
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(course_router.router)
app.include_router(forum_router.router)
app.include_router(dashboard_router.router)
app.include_router(general_router.router)
