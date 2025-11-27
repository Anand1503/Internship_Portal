import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from .. import app
from ..database import get_db, Base
from ..models import User, Company, Internship

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the database dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create test client
client = TestClient(app)

# Setup test database
@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def hr_user_token():
    """Create an HR user and return auth token"""
    # Register HR user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "hr@example.com",
            "password": "hrpassword",
            "name": "HR Manager",
            "role": "hr"
        }
    )
    
    # Login and get token
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "hr@example.com",
            "password": "hrpassword"
        }
    )
    return response.json()["access_token"]

@pytest.fixture
def student_user_token():
    """Create a student user and return auth token"""
    # Register student user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "student@example.com",
            "password": "studentpassword",
            "name": "Student User",
            "role": "student"
        }
    )
    
    # Login and get token
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "student@example.com",
            "password": "studentpassword"
        }
    )
    return response.json()["access_token"]

class TestInternships:
    def test_create_internship_hr_success(self, hr_user_token):
        """Test HR user can create internship"""
        response = client.post(
            "/api/v1/internships/",
            json={
                "title": "Software Engineer Intern",
                "company_name": "Test Company",
                "location": "Remote",
                "stipend": 1000.0,
                "description": "Great internship opportunity",
                "min_qualifications": "Currently enrolled",
                "expected_qualifications": "Programming experience",
                "deadline": "2024-12-31T23:59:59"
            },
            headers={"Authorization": f"Bearer {hr_user_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Software Engineer Intern"
        assert data["company_name"] == "Test Company"
        assert data["location"] == "Remote"

    def test_create_internship_student_forbidden(self, student_user_token):
        """Test student user cannot create internship"""
        response = client.post(
            "/api/v1/internships/",
            json={
                "title": "Software Engineer Intern",
                "company_name": "Test Company",
                "location": "Remote",
                "stipend": 1000.0,
                "description": "Great internship opportunity",
                "min_qualifications": "Currently enrolled",
                "expected_qualifications": "Programming experience",
                "deadline": "2024-12-31T23:59:59"
            },
            headers={"Authorization": f"Bearer {student_user_token}"}
        )
        assert response.status_code == 403

    def test_get_all_internships(self, hr_user_token):
        """Test getting all internships"""
        # Create an internship first
        client.post(
            "/api/v1/internships/",
            json={
                "title": "Software Engineer Intern",
                "company_name": "Test Company",
                "location": "Remote",
                "stipend": 1000.0,
                "description": "Great internship opportunity",
                "min_qualifications": "Currently enrolled",
                "expected_qualifications": "Programming experience",
                "deadline": "2024-12-31T23:59:59"
            },
            headers={"Authorization": f"Bearer {hr_user_token}"}
        )
        
        # Get all internships
        response = client.get("/api/v1/internships/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["title"] == "Software Engineer Intern"

    def test_search_internships_by_role(self, hr_user_token):
        """Test searching internships by role"""
        # Create internships
        client.post(
            "/api/v1/internships/",
            json={
                "title": "Software Engineer Intern",
                "company_name": "Test Company",
                "location": "Remote",
                "description": "Software internship",
                "deadline": "2024-12-31T23:59:59"
            },
            headers={"Authorization": f"Bearer {hr_user_token}"}
        )
        
        client.post(
            "/api/v1/internships/",
            json={
                "title": "Marketing Intern",
                "company_name": "Test Company",
                "location": "Office",
                "description": "Marketing internship",
                "deadline": "2024-12-31T23:59:59"
            },
            headers={"Authorization": f"Bearer {hr_user_token}"}
        )
        
        # Search for software roles
        response = client.get("/api/v1/internships/?q=software")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert "software" in data[0]["title"].lower()
