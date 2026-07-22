import boto3
from botocore.exceptions import ClientError
import json
from .config import settings

s3_client = boto3.client(
    "s3",
    endpoint_url=settings.S3_ENDPOINT,
    aws_access_key_id=settings.S3_ACCESS_KEY,
    aws_secret_access_key=settings.S3_SECRET_KEY,
)

def init_s3_bucket():
    try:
        s3_client.head_bucket(Bucket=settings.S3_BUCKET)
    except ClientError:
        s3_client.create_bucket(Bucket=settings.S3_BUCKET)
        
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": f"arn:aws:s3:::{settings.S3_BUCKET}/*"
                }
            ]
        }
        s3_client.put_bucket_policy(Bucket=settings.S3_BUCKET, Policy=json.dumps(policy))

def upload_image(file_obj, filename: str, content_type: str):
    s3_client.upload_fileobj(
        file_obj,
        settings.S3_BUCKET,
        filename,
        ExtraArgs={"ContentType": content_type}
    )
    # Return relative URL to route media through the cluster ingress
    return f"/{settings.S3_BUCKET}/{filename}"
