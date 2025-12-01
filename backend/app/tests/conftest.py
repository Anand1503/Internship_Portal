import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from ..main import app
from ..database import get_db, Base
# Import all models to ensure they are registered with Base.metadata
from ..models import User, Company, Internship, Resume, Application, ResumeAnalysis

# Create in-memory test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def test_db_engine():
    # Create tables once for the session? No, better per function to ensure isolation
    # But for in-memory, per function is fine.
    return engine

@pytest.fixture(scope="function", autouse=True)
def setup_database(test_db_engine):
    """
    Create tables before each test and drop them after.
    This ensures a clean state for every test.
    """
    Base.metadata.create_all(bind=test_db_engine)
    yield
    Base.metadata.drop_all(bind=test_db_engine)

@pytest.fixture(scope="function")
def db_session(setup_database):
    """
    Get a database session for testing.
    """
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client(db_session):
    """
    Get a TestClient with overridden database dependency.
    """
    def override_get_db():
        try:
            yield db_session
        finally:
            pass # Session is closed in db_session fixture

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
