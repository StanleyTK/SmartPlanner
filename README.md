# SmartPlanner

SmartPlanner is a personal task management application designed to help users efficiently organize their daily tasks. The project was developed with a modern tech stack, including Python, Django, PostgreSQL, React, Next.js, TailwindCSS, and Docker.

## Project Status

Due to the high costs associated with AWS services and the complexity of managing HTTPS access between the frontend and backend, I have **decided not to host** the project. The project was initially planned to be deployed using AWS RDS, ECS, and ECR for scalability and reliability, but challenges in cost management and secure communication led to the decision to keep it a local application.

## Tech Stack

### Backend
- **Python** – Core backend language
- **Django** – Web framework for handling business logic and API development
- **PostgreSQL** – Relational database for efficient data management
- **Docker** – Containerization for simplified deployment and development
- **AWS RDS** – AWS managed PostgreSQL database service
- **AWS ECS** – AWS Elastic Container Service for running backend services
- **AWS ECR** – AWS Elastic Container Registry for storing Docker images

### Frontend
- **React** – Frontend framework for building user interfaces
- **Next.js** – React framework for server-side rendering and static site generation
- **TailwindCSS** – CSS framework for rapid UI development
- **Vercel** – Considered for frontend hosting but not implemented

## Features
- Task management with fields such as `title`, `description`, `status`
- Simple authorization with token-based authentication
- Calendar-based task tracking through descriptions
- Optional task tagging with a string limit of 10 characters

## Running the Project Locally

To run SmartPlanner locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/smartplanner.git
    cd smartplanner
    ```

2. Build and run the Docker containers:
    ```bash
    docker compose up --build -d
    ```

3. Apply database migrations:
    ```bash
    docker exec -it smartplanner-backend python manage.py migrate
    ```

4. Access the application:
    - Frontend: `http://localhost:3000`
    - Backend API: `http://localhost:8000`
