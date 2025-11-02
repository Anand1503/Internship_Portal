#!/bin/bash
set -e

echo "Waiting for database to be ready..."
sleep 5

echo "Running database migrations..."
alembic upgrade head || echo "Migrations failed or already applied"

echo "Creating test users..."
python -c "
from app.database import SessionLocal
from app.models.user import User
from app.utils.security import get_password_hash
from sqlalchemy.exc import IntegrityError

db = SessionLocal()

# Test users data
users = [
    {
        'name': 'Test Student',
        'email': 'student@test.com',
        'password': 'password123',
        'role': 'student'
    },
    {
        'name': 'Test Company',
        'email': 'company@test.com',
        'password': 'password123',
        'role': 'company'
    },
    {
        'name': 'Test Admin',
        'email': 'admin@test.com',
        'password': 'password123',
        'role': 'admin'
    }
]

for user_data in users:
    try:
        # Check if user exists
        existing_user = db.query(User).filter(User.email == user_data['email']).first()
        if not existing_user:
            user = User(
                name=user_data['name'],
                email=user_data['email'],
                hashed_password=get_password_hash(user_data['password']),
                role=user_data['role']
            )
            # Add is_active if the model has it
            if hasattr(user, 'is_active'):
                user.is_active = True
            db.add(user)
            db.commit()
            print(f'Created user: {user_data[\"email\"]}')
        else:
            print(f'User already exists: {user_data[\"email\"]}')
    except IntegrityError as e:
        db.rollback()
        print(f'Error creating user {user_data[\"email\"]}: {e}')
    except Exception as e:
        db.rollback()
        print(f'Unexpected error: {e}')

db.close()
print('Test users setup complete!')
" || echo "Failed to create test users"

echo "Starting application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
