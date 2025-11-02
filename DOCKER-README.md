# Docker Setup for Internship Portal

This document provides instructions for setting up the Internship Portal application using Docker.

## Prerequisites

- Docker (version 20.10.0 or higher)
- Docker Compose (version 1.29.0 or higher)
- Git (for cloning the repository)

## Getting Started

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd Internship-Portal
   ```

2. **Set up environment variables**:
   - Copy the example environment file and update the values as needed:
     ```bash
     cp .env.example .env
     ```
   - Edit the `.env` file with your configuration.

3. **Start the application**:
   ```bash
   docker-compose up --build
   ```
   This will build and start all services (frontend, backend, and database).

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Available Commands

- **Start services in detached mode**:
  ```bash
  docker-compose up -d
  ```

- **View logs**:
  ```bash
  # All services
  docker-compose logs -f
  
  # Specific service
  docker-compose logs -f frontend
  docker-compose logs -f backend
  docker-compose logs -f db
  ```

- **Stop services**:
  ```bash
  docker-compose down
  ```

- **Rebuild services**:
  ```bash
  docker-compose up --build
  ```

- **Run database migrations**:
  ```bash
  docker-compose exec backend alembic upgrade head
  ```

## Services

### Frontend
- **Port**: 3000
- **Framework**: React + Vite
- **Nginx**: Serves the built frontend

### Backend
- **Port**: 8000
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **API Documentation**: Available at `/docs` and `/redoc`

### Database
- **Port**: 5432
- **Database**: PostgreSQL 16
- **Persistent Volume**: `pgdata`
- **Default Credentials**:
  - User: `postgres`
  - Password: `your_secure_password` (change in .env)
  - Database: `internship_portal`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=internship_portal
DB_PORT=5432

# Backend Configuration
BACKEND_PORT=8000
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development

# Frontend Configuration
FRONTEND_PORT=3000
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Troubleshooting

### Port Conflicts
If you encounter port conflicts, make sure no other services are using ports 3000, 8000, or 5432.

### Database Issues
If the database doesn't initialize correctly:
1. Stop all containers:
   ```bash
   docker-compose down -v
   ```
2. Remove the volume:
   ```bash
   docker volume rm internship-portal_pgdata
   ```
3. Restart the services:
   ```bash
   docker-compose up --build
   ```

### Rebuilding Services
To force a complete rebuild of all services:
```bash
docker-compose build --no-cache
```

## Development Workflow

### Running Tests
To run tests for the backend:
```bash
docker-compose exec backend pytest
```

### Database Migrations
To create a new migration:
```bash
docker-compose exec backend alembic revision --autogenerate -m "description of changes"
```

To apply migrations:
```bash
docker-compose exec backend alembic upgrade head
```

## Production Deployment

For production deployment, make sure to:
1. Set `ENVIRONMENT=production` in the `.env` file
2. Update all passwords and secret keys
3. Configure proper SSL/TLS certificates
4. Set appropriate resource limits in `docker-compose.prod.yml` (create this file for production-specific settings)
