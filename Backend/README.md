# Backend API Documentation

## Overview

This document describes the available API routes for the backend server. These routes handle authentication, user management, and other core features.

---

## Authentication Routes

### POST `/api/auth/register`

- **Description:** Register a new user.
- **Request Body:**
  - `username` (string, required)
  - `email` (string, required)
  - `password` (string, required)
- **Response:**  
  - `201 Created` on success  
  - JSON object with user info or error message

---

### POST `/api/auth/login`

- **Description:** Log in an existing user.
- **Request Body:**
  - `email` (string, required)
  - `password` (string, required)
- **Response:**  
  - `200 OK` on success  
  - JSON object with authentication token or error message

---

### GET `/api/auth/logout`

- **Description:** Log out the current user.
- **Response:**  
  - `200 OK` on success  
  - JSON object with logout confirmation

---

## User Routes

### GET `/api/user/profile`

- **Description:** Get the authenticated user's profile.
- **Headers:**  
  - `Authorization: Bearer <token>`
- **Response:**  
  - `200 OK`  
  - JSON object with user profile data

---

### PUT `/api/user/profile`

- **Description:** Update the authenticated user's profile.
- **Headers:**  
  - `Authorization: Bearer <token>`
- **Request Body:**  
  - Fields to update (e.g., `username`, `email`)
- **Response:**  
  - `200 OK`  
  - JSON object with updated user profile

---

## Notes

- All protected routes require a valid JWT token in the `Authorization` header.
- Error responses will include a message field describing the issue.

---

_This documentation should be updated as new routes are added or existing