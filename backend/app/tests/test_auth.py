import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from .. import app
from ..db.session import get_db, Base
from ..models import User

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
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

class TestAuth:
    def test_register_user(self):
        """Test user registration endpoint"""
        response = client.post(
            "/auth/register",
            json={
                "email": "test@example.com",
                "password": "testpassword",
                "name": "Test User",
                "role": "student"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["name"] == "Test User"
        assert data["role"] == "student"
        assert "id" in data

    def test_register_duplicate_email(self):
        """Test registration with duplicate email fails"""
        # First registration
        client.post(
            "/auth/register",
            json={
                "email": "test@example.com",
                "password": "testpassword",
                "name": "Test User",
                "role": "student"
            }
        )
        
        # Second registration with same email
        response = client.post(
            "/auth/register",
            json={
                "email": "test@example.com",
                "password": "anotherpassword",
                "name": "Another User",
                "role": "student"
            }
        )
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()

    def test_login_valid_credentials(self):
        """Test login with valid credentials"""
        # Register user first
        client.post(
            "/auth/register",
            json={
                "email": "test@example.com",
                "password": "testpassword",
                "name": "Test User",
                "role": "student"
            }
        )
        
        # Login
        response = client.post(
            "/auth/login",
            data={
                "username": "test@example.com",
                "password": "testpassword"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "test@example.com"

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials fails"""
        response = client.post(
            "/auth/login",
            data={
                "username": "nonexistent@example.com",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()

    def test_get_current_user(self):
        """Test getting current user with valid token"""
        # Register and login
        client.post(
            "/auth/register",
            json={
                "email": "test@example.com",
                "password": "testpassword",
                "name": "Test User",
                "role": "student"
            }
        )
        
        login_response = client.post(
            "/auth/login",
            data={
                "username": "test@example.com",
                "password": "testpassword"
            }
        )
        token = login_response.json()["access_token"]
        
        # Get current user
        response = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["name"] == "Test User"

    def test_get_current_user_invalid_token(self):
        """Test getting current user with invalid token fails"""
        response = client.get(
            "/auth/me",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == 401
