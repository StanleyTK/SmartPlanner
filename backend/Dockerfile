# Use official Python image with explicit platform for AWS compatibility
FROM --platform=linux/amd64 python:3.9

# Set working directory
WORKDIR /app

# Copy project files
COPY . /app/

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt
ENV PYTHONUNBUFFERED=1

# Set executable permissions for Gunicorn if necessary
RUN chmod +x /usr/local/bin/gunicorn

# Expose port 8000 for application
EXPOSE 8000

# Run Gunicorn server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "mybackend.wsgi:application"]
