# Use official Python image from DockerHub
FROM python:3.9
WORKDIR /app
COPY . /app/

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt
ENV PYTHONUNBUFFERED=1

# Expose port 8000 for Django runserver
EXPOSE 8000

# Run migrations and start the server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "mybackend.wsgi:application"]
