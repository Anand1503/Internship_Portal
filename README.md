# Internship Portal

A fullstack web application for managing internships, built with modern technologies.

## Tech Stack

- **Frontend**: Vite + React + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL

## Features

- User authentication and authorization
- Internship listings and applications
- Admin dashboard for managing internships
- Responsive design with Tailwind CSS

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL

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
   - Create a PostgreSQL database
   - Update the database URL in `app/config.py`

6. Run database migrations:
   ```bash
   alembic upgrade head
   ```

7. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
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

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be running at `http://localhost:5173`.

### Running the Full Application

1. Start the backend server (as above).
2. Start the frontend server (as above).
3. Open your browser and navigate to `http://localhost:5173`.

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
