"""
Azure Blob Storage utility for resume file management
"""
import os
import uuid
from datetime import datetime, timedelta
from typing import Optional
from io import BytesIO

from azure.storage.blob import BlobServiceClient, BlobSasPermissions, generate_blob_sas
from fastapi import UploadFile, HTTPException

from ..core.config import settings


def get_blob_service_client() -> BlobServiceClient:
    """Create and return a BlobServiceClient instance"""
    if not settings.AZURE_STORAGE_CONNECTION_STRING:
        raise ValueError("Azure Storage connection string not configured")
    
    return BlobServiceClient.from_connection_string(
        settings.AZURE_STORAGE_CONNECTION_STRING
    )


async def upload_blob(file: UploadFile, filename: Optional[str] = None) -> str:
    """
    Upload a file to Azure Blob Storage
    
    Args:
        file: UploadFile object from FastAPI
        filename: Optional custom filename (auto-generated if not provided)
    
    Returns:
        Blob URL
    """
    try:
        # Generate unique filename if not provided
        if not filename:
            file_extension = os.path.splitext(file.filename)[1] if file.filename else ".pdf"
            filename = f"{uuid.uuid4()}{file_extension}"
        
        # Get blob client
        blob_service_client = get_blob_service_client()
        container_client = blob_service_client.get_container_client(
            settings.AZURE_STORAGE_CONTAINER_NAME
        )
        
        # Create container if it doesn't exist
        try:
            container_client.create_container()
        except Exception:
            # Container already exists
            pass
        
        # Upload file
        blob_client = container_client.get_blob_client(filename)
        
        # Read file content
        content = await file.read()
        
        # Upload with metadata
        blob_client.upload_blob(
            content,
            overwrite=True,
            metadata={
                "original_filename": file.filename or "unknown",
                "content_type": file.content_type or "application/pdf",
                "uploaded_at": datetime.utcnow().isoformat()
            }
        )
        
        # Return blob URL
        return blob_client.url
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload file to blob storage: {str(e)}"
        )


def get_blob_sas_url(blob_url: str, expiry_hours: int = 1) -> str:
    """
    Generate a SAS URL for temporary blob access
    
    Args:
        blob_url: Full blob URL
        expiry_hours: Hours until SAS token expires
    
    Returns:
        SAS URL
    """
    try:
        # Extract blob name from URL
        blob_name = blob_url.split(f"/{settings.AZURE_STORAGE_CONTAINER_NAME}/")[-1]
        
        # Get blob client
        blob_service_client = get_blob_service_client()
        blob_client = blob_service_client.get_blob_client(
            container=settings.AZURE_STORAGE_CONTAINER_NAME,
            blob=blob_name
        )
        
        # Extract account name and key from connection string
        # Filter out empty strings from split (handles trailing semicolons)
        conn_parts = dict(
            item.split('=', 1) 
            for item in settings.AZURE_STORAGE_CONNECTION_STRING.split(';')
            if item.strip() and '=' in item
        )
        account_name = conn_parts.get('AccountName')
        account_key = conn_parts.get('AccountKey')
        
        if not account_name or not account_key:
            raise ValueError("Invalid connection string: missing AccountName or AccountKey")
        
        # Generate SAS token
        sas_token = generate_blob_sas(
            account_name=account_name,
            container_name=settings.AZURE_STORAGE_CONTAINER_NAME,
            blob_name=blob_name,
            account_key=account_key,
            permission=BlobSasPermissions(read=True),
            expiry=datetime.utcnow() + timedelta(hours=expiry_hours)
        )
        
        # Return URL with SAS token
        return f"{blob_client.url}?{sas_token}"
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate SAS URL: {str(e)}"
        )


async def delete_blob(blob_url: str) -> bool:
    """
    Delete a blob from storage
    
    Args:
        blob_url: Full blob URL
    
    Returns:
        True if deleted successfully
    """
    try:
        # Extract blob name from URL
        blob_name = blob_url.split(f"/{settings.AZURE_STORAGE_CONTAINER_NAME}/")[-1]
        
        # Get blob client
        blob_service_client = get_blob_service_client()
        blob_client = blob_service_client.get_blob_client(
            container=settings.AZURE_STORAGE_CONTAINER_NAME,
            blob=blob_name
        )
        
        # Delete blob
        blob_client.delete_blob()
        return True
        
    except Exception as e:
        # Log error but don't fail (blob might not exist)
        print(f"Error deleting blob: {str(e)}")
        return False


def is_blob_url(path: str) -> bool:
    """
    Check if a path is a blob URL
    
    Args:
        path: File path or URL
    
    Returns:
        True if it's a blob URL
    """
    return path.startswith("https://") and ".blob.core.windows.net/" in path
