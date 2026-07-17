import boto3
from botocore.exceptions import ClientError
import json

S3_BUCKET = "logpulse"
S3_ENDPOINT = "http://minio:9000"
S3_ACCESS_KEY = "minioadmin"
S3_SECRET_KEY = "minioadmin"

s3_client = boto3.client(
    "s3",
    endpoint_url=S3_ENDPOINT,
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY,
)

def init_s3_bucket():
    try:
        s3_client.head_bucket(Bucket=S3_BUCKET)
    except ClientError:
        s3_client.create_bucket(Bucket=S3_BUCKET)
        
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": f"arn:aws:s3:::{S3_BUCKET}/*"
                }
            ]
        }
        s3_client.put_bucket_policy(Bucket=S3_BUCKET, Policy=json.dumps(policy))

def upload_image(file_obj, filename: str, content_type: str):
    s3_client.upload_fileobj(
        file_obj,
        S3_BUCKET,
        filename,
        ExtraArgs={"ContentType": content_type}
    )
    return f"http://localhost:9000/{S3_BUCKET}/{filename}"
