from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime

class HomeHeroBanner(BaseModel):
    title: str
    subtitle: str

class HomeCourseItem(BaseModel):
    id: str
    title: str
    thumbnail_url: Optional[str] = None
    instructor_name: str
    total_lessons: int

class HomeRecentPost(BaseModel):
    id: str
    title: str
    short_content: Optional[str] = None
    category_name: str
    author_name: str
    author_avatar: Optional[str] = None
    is_anonymous: bool = False
    likes_count: int = 0
    comment_count: int
    created_at: datetime

class HomePageData(BaseModel):
    hero_banner: HomeHeroBanner
    parent_courses: list[HomeCourseItem]
    child_courses: list[HomeCourseItem]
    recent_forum_posts: list[HomeRecentPost]

class HomePageResponse(BaseModel):
    success: bool
    data: HomePageData

class AboutAuthor(BaseModel):
    name: str
    role: str
    contact: str

class AboutUsData(BaseModel):
    research_title: str
    research_purpose: str
    methodology: str
    authors: list[AboutAuthor]

class AboutUsResponse(BaseModel):
    success: bool
    data: AboutUsData

class SiteSettingUpdate(BaseModel):
    value_content: str

class SiteSettingUpdateResponseData(BaseModel):
    key_name: str
    updated_at: datetime

class SiteSettingUpdateResponse(BaseModel):
    success: bool
    message: str
    data: SiteSettingUpdateResponseData

class SiteSettingData(BaseModel):
    id: int
    key_name: str
    value_content: str
    description: Optional[str] = None
    updated_at: datetime

class SiteSettingsListResponse(BaseModel):
    success: bool
    data: list[SiteSettingData]
