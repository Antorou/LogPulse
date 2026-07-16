FROM python:3.11-slim

# Install system dependencies required for psycopg and other packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Default command (will be overridden for celery containers)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
