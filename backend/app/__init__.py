from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .routers import auth, resumes, internships, applications, hr
from .db.session import engine, Base

app = FastAPI(title="Internship Portal API", version="1.0.0")

# CORS
origins = [settings.FRONTEND_URL] if settings.FRONTEND_URL else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(resumes.router)
app.include_router(internships.router)
app.include_router(applications.router)
app.include_router(hr.router)

# DB creation (for dev, rely on alembic for prod)
Base.metadata.create_all(bind=engine)
