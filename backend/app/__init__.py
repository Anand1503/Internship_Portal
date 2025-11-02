from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware 
from .core.config import settings 
from .database import engine, Base 
from .routers import auth, resumes, internships, applications, hr, jobs 
app = FastAPI( 
    title=settings.PROJECT_NAME, 
    version=settings.VERSION, 
    description=settings.DESCRIPTION, 
    openapi_url=f"{settings.API_V1_STR}/openapi.json" ) 
    # CORS - Must be added before routes 
app.add_middleware( 
    CORSMiddleware, allow_origins=["*"], # Allow all origins for development 
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"], expose_headers=["*"] ) 
# Create database tables automatically 
Base.metadata.create_all(bind=engine) 
@app.get("/") 
def read_root(): return {"message": "FastAPI connected to PostgreSQL successfully!", "version": settings.VERSION} 
@app.get(f"{settings.API_V1_STR}/health") 
def health_check(): return {"status": "healthy", "version": settings.VERSION} # Include routers with API v1 prefix 
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["authentication"]) 
app.include_router(resumes.router, prefix=f"{settings.API_V1_STR}/resumes", tags=["resumes"]) 
app.include_router(internships.router, prefix=f"{settings.API_V1_STR}/internships", tags=["internships"]) 
app.include_router(applications.router, prefix=f"{settings.API_V1_STR}/applications", tags=["applications"]) 
app.include_router(hr.router, prefix=f"{settings.API_V1_STR}/hr", tags=["hr"]) 
app.include_router(jobs.router, prefix=f"{settings.API_V1_STR}/jobs", tags=["jobs"])