# Internship Portal Backend

FastAPI backend for the Internship Portal application.

## Features

- **Authentication**: JWT-based auth for Students and HR.
- **Resume Management**: Upload, download, and manage resumes.
- **Resume Analysis**: AI-powered resume scoring and feedback using Google Gemini.
- **Internship Management**: Post and search for internships.
- **Application Tracking**: Apply for internships and track status.

## Setup

1.  **Create a virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Environment Variables**:
    Copy `.env.example` to `.env` and fill in the required values.
    ```bash
    cp ../.env.example .env
    ```
    
    **Required for Resume Analysis**:
    - `GEMINI_API_KEY`: Get this from Google AI Studio.
    - `GEMINI_MODEL`: (Optional) Default is `gemini-1.5-flash`.

4.  **Database Migration**:
    ```bash
    alembic upgrade head
    ```

5.  **Run the server**:
    ```bash
    uvicorn app.main:app --reload
    ```

## Testing

Run unit tests with pytest:
```bash
pytest
```

## API Documentation

Once running, access the interactive API docs at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
