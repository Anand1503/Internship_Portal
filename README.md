# Internship Portal

A full-stack web application for managing internship applications, connecting students with HR recruiters. Built with modern technologies for a seamless user experience.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Recharts** for data visualization
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **FastAPI** (Python) for high-performance API
- **SQLAlchemy** ORM for database operations
- **PostgreSQL** database
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Pydantic** for data validation
- **Alembic** for database migrations

## Features

### For Students
- ✅ User registration and authentication
- ✅ Browse and search internship opportunities
- ✅ Filter internships by location and company
- ✅ Upload and manage multiple resumes (PDF)
- ✅ Apply to internships with resume and cover letter
- ✅ Track application status (Pending, Accepted, Rejected)
- ✅ Dashboard with application statistics
- ✅ Profile management

### For HR/Recruiters
- ✅ User registration and authentication
- ✅ Post new internship opportunities
- ✅ View all posted jobs
- ✅ Review applications for each job
- ✅ Download candidate resumes
- ✅ Update application status
- ✅ Export candidate data to Excel
- ✅ Dashboard with job statistics
- ✅ Profile management

### General Features
- ✅ Responsive design for all devices
- ✅ Modern, clean UI with smooth animations
- ✅ Role-based access control (Student/HR)
- ✅ Secure file upload and storage
- ✅ Real-time status updates
- ✅ Toast notifications for user feedback

## Quick Start

### Prerequisites

**Option 1: Docker (Recommended)**
- Docker Desktop
- Docker Compose

**Option 2: Manual Setup**
- Python 3.8+
- Node.js 16+
- PostgreSQL

## 🐳 Docker Setup (Recommended)

The easiest way to run the application is using Docker. Everything is pre-configured and ready to go!

### 1. Start with Docker

```bash
# Clone the repository
git clone https://github.com/Anand1503/Internship_Portal.git
cd Internship_Portal

# Start all services
docker-compose up -d
```

That's it! The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 2. Default Test Users

The Docker setup automatically creates test users:
- **Student**: `student@test.com` / `password123`
- **Company**: `company@test.com` / `password123`
- **Admin**: `admin@test.com` / `password123`

### 3. Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild after code changes
docker-compose up --build -d

# Fresh start (removes all data)
docker-compose down -v
docker-compose up --build
```

### 4. Environment Variables

Create a `.env` file in the project root (optional, defaults are provided):

```env
# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=internship_portal
DB_PORT=5432

# Backend
BACKEND_PORT=8000
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
FRONTEND_PORT=3000
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## 📦 Manual Setup (Alternative)

If you prefer not to use Docker, follow these steps:

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up the database:
   - Create a PostgreSQL database named `internship_portal`
   - Create a `.env` file in the backend directory with:
     ```
     DATABASE_URL=postgresql://username:password@localhost/internship_portal
     SECRET_KEY=your-secret-key-here
     ALGORITHM=HS256
     ACCESS_TOKEN_EXPIRE_MINUTES=30
     ```

6. Run database migrations:
   ```bash
   alembic upgrade head
   ```

7. (Optional) Seed the database with sample data:
   ```bash
   python seed_data.py
   ```
   This creates:
   - Test student: `student@test.com` / `password123`
   - Test HR: `hr@test.com` / `password123`
   - Sample internships and applications

8. Start the backend server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

The backend will be running at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be running at `http://localhost:5173`.

### Running the Full Application

1. Start the backend server (from the backend directory)
2. Start the frontend server (from the frontend directory)
3. Open your browser and navigate to `http://localhost:5173`
4. **Option 1:** Login with test credentials:
   - Student: `student@test.com` / `password123`
   - HR: `hr@test.com` / `password123`
5. **Option 2:** Create a new account:
   - Click on "Register" tab
   - Fill in your details (name, email, password)
   - Select account type (Student or HR Manager)
   - Click "Create Account"
   - Login with your new credentials

## Project Structure

```
Internship Portal/
├── backend/
│   ├── app/
│   │   ├── core/           # Configuration and settings
│   │   ├── models/         # SQLAlchemy database models
│   │   ├── routers/        # API route handlers
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── database.py     # Database connection
│   │   ├── dependencies.py # Dependency injection
│   │   └── main.py         # FastAPI application
│   ├── alembic/            # Database migrations
│   ├── resumes/            # Uploaded resume files
│   ├── Dockerfile          # Backend Docker configuration
│   ├── start.sh            # Backend startup script
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables (create this)
├── frontend/
│   ├── src/
│   │   ├── api/            # API client configuration
│   │   ├── components/     # Reusable React components
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── nginx/              # Nginx configuration for Docker
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend Docker configuration
│   ├── package.json        # Node dependencies
│   └── .env                # Environment variables (create this)
├── docker-compose.yml      # Docker orchestration
├── .env                    # Environment variables (create this)
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/me` - Update user profile

### Internships
- `GET /api/v1/internships/` - List all internships
- `GET /api/v1/internships/{id}` - Get internship details
- `POST /api/v1/internships/` - Create internship (HR only)

### Applications
- `POST /api/v1/applications/` - Apply to internship
- `GET /api/v1/applications/me` - Get user's applications

### Resumes
- `POST /api/v1/resumes/upload` - Upload resume
- `GET /api/v1/resumes/me` - Get user's resumes
- `GET /api/v1/resumes/{id}/download` - Download resume

### HR Endpoints
- `GET /api/v1/hr/my_jobs` - Get HR's posted jobs
- `GET /api/v1/hr/applications/{job_id}` - Get job applications
- `PUT /api/v1/hr/applications/{id}/status` - Update application status
- `GET /api/v1/hr/export/{job_id}` - Export candidates to Excel

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

<!-- Last deployed: 2025-11-03 14:55:50 -->
