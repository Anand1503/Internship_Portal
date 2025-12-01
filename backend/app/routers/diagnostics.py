"""
Diagnostic endpoint for testing file upload functionality
"""
from fastapi import APIRouter, File, UploadFile, Form
from typing import Optional

router = APIRouter()

@router.get("/ping")
async def ping():
    """Simple ping endpoint to test if router is accessible"""
    return {"status": "ok", "message": "Resume diagnostic router is working"}

@router.post("/test-upload")
async def test_upload(
    test_field: str = Form(...),
    file: Optional[UploadFile] = File(None)
):
    """
    Test endpoint for file uploads without authentication
    Returns file metadata without saving
    """
    result = {
        "test_field": test_field,
        "file_received": file is not None
    }
    
    if file:
        # Read file size without saving
        content = await file.read()
        result["file_name"] = file.filename
        result["file_size"] = len(content)
        result["content_type"] = file.content_type
    
    return result
