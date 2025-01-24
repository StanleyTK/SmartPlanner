# SmartPlanner API Documentation

## Overview
SmartPlanner provides endpoints to manage users and tasks efficiently. Authentication is handled using simple token-based authorization.

---

## Authentication
All endpoints (except registration and login) require an `Authorization` header:

```http
Authorization: <token>
```

---

## Endpoints

### User Endpoints

#### Register User
**Endpoint:**
```http
POST /register/
```
**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "name": "John Doe",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "token": "d3c119f74ea54b45ae82a49401400e16417980d7"
}
```

---

#### Login User
**Endpoint:**
```http
POST /login/
```
**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "token": "d3c119f74ea54b45ae82a49401400e16417980d7"
}
```

---

#### Update User
**Endpoint:**
```http
POST /update/
```
**Request Headers:**
```http
Authorization: <token>
```
**Request Body:**
```json
{
  "email": "new_email@example.com",
  "password": "new_secure_password"
}
```
**Response:**
```json
{
  "message": "User information updated successfully"
}
```

---

#### Delete User
**Endpoint:**
```http
DELETE /delete/
```
**Request Headers:**
```http
Authorization: <token>
```
**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

### Task Endpoints

#### Create Task
**Endpoint:**
```http
POST /create/
```
**Request Headers:**
```http
Authorization: <token>
```
**Request Body:**
```json
{
  "title": "Meeting",
  "description": "Project discussion",
  "priority": 2,
  "tags": "work",
  "date_created": "2025-01-20"
}
```
**Response:**
```json
{
  "message": "Task created successfully",
  "task_id": 1
}
```

---

#### Update Task
**Endpoint:**
```http
POST /update/
```
**Request Headers:**
```http
Authorization: <token>
```
**Request Body:**
```json
{
  "task_id": 1,
  "title": "Updated Meeting",
  "is_completed": true
}
```
**Response:**
```json
{
  "message": "Task updated successfully"
}
```

---

#### Delete Task
**Endpoint:**
```http
DELETE /delete/
```
**Request Headers:**
```http
Authorization: <token>
```
**Request Body:**
```json
{
  "task_id": 1
}
```
**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

---

#### Get All Tasks
**Endpoint:**
```http
GET /get/
```
**Request Headers:**
```http
Authorization: <token>
```
**Response:**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Meeting",
      "description": "Project discussion",
      "priority": 2,
      "tags": "work",
      "date_created": "2025-01-20",
      "is_completed": false
    }
  ]
}
```

---

#### Get Tasks by Date
**Endpoint:**
```http
POST /get-by-date/
```
**Request Headers:**
```http
Authorization: <token>
```
**Request Body:**
```json
{
  "start_date": "2025-01-01",
  "end_date": "2025-01-31"
}
```
**Response:**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Meeting",
      "description": "Project discussion",
      "priority": 2,
      "tags": "work",
      "date_created": "2025-01-20",
      "is_completed": false
    }
  ]
}
```

---

## Error Handling
Standard error responses follow the format:
```json
{
  "error": "Error message here"
}
```

---

## Status Codes
- `200 OK` - Request was successful.
- `201 Created` - Resource was successfully created.
- `400 Bad Request` - Invalid request parameters.
- `401 Unauthorized` - Authentication failed.
- `404 Not Found` - Resource not found.
