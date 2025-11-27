# 🎓 Internship Portal

<div align="center">

![Status](https://img.shields.io/badge/status-active-success.svg)
![Platform](https://img.shields.io/badge/platform-Azure%20Container%20Apps-blue)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**A modern, full-stack web application connecting students with internship opportunities**

Built with React, FastAPI, and deployed on Azure with Infrastructure as Code

[Live Demo](https://internship-portal-frontend.orangeglacier-54f3babc.centralindia.azurecontainerapps.io) · [Report Bug](https://github.com/Anand1503/Internship_Portal/issues) · [Request Feature](https://github.com/Anand1503/Internship_Portal/issues)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

Internship Portal is a comprehensive platform that bridges the gap between talented students seeking internships and companies looking for skilled talent. The application features a beautiful, responsive UI with role-based dashboards, real-time application tracking, and seamless resume management.

## 🚀 Features

### 🌟 Modern UI/UX
- **Professional Landing Page** - Engaging hero section with smooth animations
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop
- **Modern Color Scheme** - Sky blue, emerald green, and purple accents
- **Smooth Animations** - Professional transitions and hover effects
- **Mobile Navigation** - Industry-standard top hamburger menu
- **Interactive Charts** - Real-time data visualization with Recharts

### 👨‍🎓 Student Features
- ✅ Browse and search internships with advanced filters
- ✅ Upload and manage multiple resumes (PDF)
- ✅ One-click application with resume selection
- ✅ AI-Powered Resume Analysis (Score, Strengths, Suggestions)
- ✅ Track application status (Pending, Accepted, Rejected)
- ✅ Interactive dashboard with application analytics
- ✅ Profile management
- ✅ Real-time status updates

### 👔 HR/Recruiter Features
- ✅ Post internship opportunities with detailed requirements
- ✅ Review and manage applications
- ✅ Download candidate resumes
- ✅ Update application statuses
- ✅ Export candidate data to Excel
- ✅ Analytics dashboard with job posting metrics
- ✅ Candidate sorting and filtering

### 🔐 Security & Performance
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Password hashing with Bcrypt
- ✅ Secure file upload validation
- ✅ API rate limiting
- ✅ HTTPS encryption (production)

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|----------|
| **React 18** | Modern UI framework with TypeScript |
| **Vite** | Lightning-fast build tool |
| **Tailwind CSS** | Utility-first CSS framework |
| **Lucide React** | Beautiful icon library |
| **Recharts** | Interactive data visualization |
| **Axios** | HTTP client for API calls |
| **React Router** | Client-side routing |

### Backend
| Technology | Purpose |
|------------|----------|
| **FastAPI** | High-performance Python API framework |
| **SQLAlchemy** | SQL toolkit and ORM |
| **PostgreSQL** | Relational database |
| **JWT** | Secure authentication tokens |
| **Pydantic** | Data validation and serialization |
| **Alembic** | Database migration tool |
| **Uvicorn** | ASGI server |

### DevOps & Infrastructure
| Technology | Purpose |
|------------|----------|
| **Docker** | Containerization |
| **Azure Container Apps** | Cloud hosting platform |
| **Azure Container Registry** | Docker image storage |
| **Terraform** | Infrastructure as Code (IaC) |
| **GitHub Actions** | CI/CD pipelines |
| **Nginx** | Reverse proxy and static file serving |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     GitHub Actions                      │
│              (CI/CD Pipeline)                           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Azure Container Registry                    │
│          (Docker Images Storage)                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│           Azure Container Apps                           │
│                                                          │
│  ┌──────────────────┐      ┌───────────────────┐       │
│  │                  │      │                    │       │
│  │  Frontend        │◄────►│  Backend API       │       │
│  │  (React + Nginx) │      │  (FastAPI)         │       │
│  │                  │      │                    │       │
│  └──────────────────┘      └─────────┬──────────┘       │
│                                       │                  │
│                                       ▼                  │
│                            ┌──────────────────┐         │
│                            │   PostgreSQL     │         │
│                            │   Database       │         │
│                            └──────────────────┘         │
└─────────────────────────────────────────────────────────┘
```


## ⚡ Quick Start

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

## 🚀 Deployment

The application is deployed on **Azure Container Apps** with full CI/CD automation.

### Live Application

- **Frontend**: [https://internship-portal-frontend.orangeglacier-54f3babc.centralindia.azurecontainerapps.io](https://internship-portal-frontend.orangeglacier-54f3babc.centralindia.azurecontainerapps.io)
- **Backend API**: [https://internship-portal-backend.orangeglacier-54f3babc.centralindia.azurecontainerapps.io](https://internship-portal-backend.orangeglacier-54f3babc.centralindia.azurecontainerapps.io)
- **API Docs**: [https://internship-portal-backend.orangeglacier-54f3babc.centralindia.azurecontainerapps.io/docs](https://internship-portal-backend.orangeglacier-54f3babc.centralindia.azurecontainerapps.io/docs)

### Deployment Architecture

The application uses a fully automated CI/CD pipeline:

1. **Push to `main` branch** triggers GitHub Actions workflow
2. **Build Docker images** for frontend and backend
3. **Push images** to Azure Container Registry
4. **Deploy containers** to Azure Container Apps
5. **Auto-scaling** based on traffic

### Infrastructure as Code (Terraform)

All Azure resources are defined in Terraform for reproducibility:

```bash
cd terraform/

# Initialize Terraform
terraform init

# Review planned changes
terraform plan

# Apply infrastructure (requires Azure credentials)
terraform apply
```

**Note**: You'll need to configure the following secrets in your `terraform.tfvars` file:
- Azure subscription details
- Database credentials
- JWT secret keys

See `terraform/terraform.tfvars.example` for the template.

### GitHub Actions Secrets

For CI/CD to work, configure these secrets in your GitHub repository:

| Secret Name | Description |
|------------|-------------|
| `AZURE_CREDENTIALS` | Azure service principal JSON |
| `AZURE_REGISTRY_LOGIN_SERVER` | ACR login server URL |
| `AZURE_REGISTRY_USERNAME` | ACR username |
| `AZURE_REGISTRY_PASSWORD` | ACR password |
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT secret key (generate strong random key) |

**Generate a secure SECRET_KEY**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Manual Deployment to Azure

If you prefer manual deployment:

```bash
# Login to Azure
az login

# Create resource group
az group create --name internship-portal-rg --location centralindia

# Create container registry
az acr create --resource-group internship-portal-rg \
  --name internshipportal --sku Basic

# Build and push images
az acr build --registry internshipportal \
  --image backend:latest ./backend

az acr build --registry internshipportal \
  --image frontend:latest ./frontend

# Create container apps environment
az containerapp env create \
  --name internship-portal-env \
  --resource-group internship-portal-rg \
  --location centralindia

# Deploy backend
az containerapp create \
  --name internship-portal-backend \
  --resource-group internship-portal-rg \
  --environment internship-portal-env \
  --image internshipportal.azurecr.io/backend:latest \
  --target-port 8000 \
  --ingress external \
  --env-vars DATABASE_URL=<your-db-url> SECRET_KEY=<your-secret>

# Deploy frontend
az containerapp create \
  --name internship-portal-frontend \
  --resource-group internship-portal-rg \
  --environment internship-portal-env \
  --image internshipportal.azurecr.io/frontend:latest \
  --target-port 80 \
  --ingress external \
  --env-vars VITE_API_BASE_URL=<backend-url>
```

## 📂 Project Structure

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

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI (Local)**: `http://localhost:8000/docs`
- **ReDoc (Local)**: `http://localhost:8000/redoc`
- **Swagger UI (Production)**: [https://internship-portal-backend.orangeglacier-54f3babc.centralindia.azurecontainerapps.io/docs](https://internship-portal-backend.orangeglacier-54f3babc.centralindia.azurecontainerapps.io/docs)

## 🔌 API Endpoints

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
- `POST /api/v1/resumes/{id}/analyze` - Analyze resume with AI
- `GET /api/v1/resumes/{id}/analysis` - Get analysis results

### HR Endpoints
- `GET /api/v1/hr/my_jobs` - Get HR's posted jobs
- `GET /api/v1/hr/applications/{job_id}` - Get job applications
- `PUT /api/v1/hr/applications/{id}/status` - Update application status
- `GET /api/v1/hr/export/{job_id}` - Export candidates to Excel

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost/internship_portal
SECRET_KEY=your-super-secret-jwt-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
# AI Resume Analyzer
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

⚠️ **Security Note**: Never commit actual `.env` files. Use `.env.example` for templates.

## 🐛 Known Issues

- None currently reported

Please report any bugs via [GitHub Issues](https://github.com/Anand1503/Internship_Portal/issues).

## 📈 Future Enhancements

- [ ] Email notifications for application status updates
- [ ] Advanced search filters (salary range, duration, skills)
- [ ] Company profiles with reviews
- [ ] Video resume uploads
- [ ] In-app messaging between students and HR
- [ ] Application deadline reminders
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Anand**
- GitHub: [@Anand1503](https://github.com/Anand1503)
- Project Link: [https://github.com/Anand1503/Internship_Portal](https://github.com/Anand1503/Internship_Portal)

## 🙏 Acknowledgments

- React team for the amazing framework
- FastAPI for the high-performance backend framework
- Tailwind CSS for the utility-first styling
- Azure for reliable cloud infrastructure
- The open-source community

---

<div align="center">

**Built with ❤️ by [Anand](https://github.com/Anand1503)**

⭐ Star this repository if you find it helpful!

</div>
