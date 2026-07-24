import os
import shutil
from .config import settings

def init_s3_bucket():
    # We rename this internally to just initialize the local storage directory
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)

def upload_image(file_obj, filename: str, content_type: str):
    # file_obj is a file-like object (e.g. from UploadFile.file)
    file_path = os.path.join(settings.STORAGE_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file_obj, buffer)
    
    # Return relative URL to route media through the cluster ingress / local api static files
    return f"/logpulse/{filename}"
