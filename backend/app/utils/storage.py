import os
import shutil
import uuid
from fastapi import UploadFile, HTTPException
from ..core.config import settings

async def save_resume_file(file: UploadFile) -> str:
    """
    Save resume file to storage (Azure Blob or local filesystem)
    
    Returns:
        str: Blob URL if using Azure Blob Storage, or local file path
    """
    # Validate MIME type
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Use Azure Blob Storage if enabled
    if settings.USE_AZURE_BLOB:
        try:
            from .blob_storage import upload_blob
            blob_url = await upload_blob(file)
            return blob_url
        except Exception as e:
            # Fallback to local storage if blob upload fails
            print(f"Blob upload failed, falling back to local storage: {str(e)}")
    
    # Local storage (fallback or default)
    # Create upload directory if it doesn't exist
    os.makedirs(settings.RESUME_UPLOAD_DIR, exist_ok=True)

    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ".pdf"
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.RESUME_UPLOAD_DIR, unique_filename)

    # Save the file
    try:
        # Reset file pointer to beginning (in case it was read for blob upload attempt)
        file.file.seek(0)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    return file_path

