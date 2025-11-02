import uvicorn
from app import app

# your routes and includes... 

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)