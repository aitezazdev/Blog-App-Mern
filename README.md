# MERN Blog App

This repository contains a full-stack blog application built with the MERN stack (MongoDB, Express, React, Node.js). It includes post creation, viewing, comments, favourites, and saved posts. User authentication is implemented manually using MongoDB for user storage.

---

## Key features

* User authentication (manual, with MongoDB + JWT)

  * Sign up, log in, log out
  * Password hashing with bcrypt
* Create, edit, and delete blog posts
* View single post details
* Add and view comments on posts
* Mark posts as favourites / remove from favourites
* Save posts for later reading
* Contact form / contact page
* Responsive layout (mobile-friendly)

---

## Tech stack

**Frontend:**

* React (Vite or Create React App)
* React Router for navigation
* Context API or Redux for global state
* Tailwind CSS or CSS modules for styling

**Backend:**

* Node.js
* Express.js
* MongoDB + Mongoose ODM
* JSON Web Tokens (JWT) for authentication
* bcrypt for password hashing

---

## How to run locally

### 1. Clone the repo

```bash
git clone https://github.com/vilezaz/MERN-Blog-App.git
```

### 2. Install dependencies for both backend and frontend

```bash
cd MERN-Blog-App
cd backend && npm install
cd ../frontend && npm install
```

### 3. Set up environment variables

In the `backend/` folder, create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the development servers

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) for the frontend (or port from your setup) and [http://localhost:3000](http://localhost:3000) for the backend API.

---

## Screenshots

### Login Page

![App Screenshot](/frontend/public/githubPictures/Screenshot%20from%202025-08-12%2016-23-24.png)

### Home Page

![App Screenshot](/frontend/public/githubPictures/Screenshot%20from%202025-08-12%2016-23-53.png)

### Home Page Blogs

![App Screenshot](/frontend/public/githubPictures/Screenshot%20from%202025-08-12%2016-24-00.png)

### Blogs Details

![App Screenshot](/frontend/public/githubPictures/Screenshot%20from%202025-08-12%2016-24-11.png)

### Blogs Details Comments

![App Screenshot](/frontend/public/githubPictures//Screenshot%20from%202025-08-12%2016-24-34.png)

### Bookmark Page

![App Screenshot](/frontend/public/githubPictures/Screenshot%20from%202025-08-12%2016-24-51.png)

### Profile Details
![App Screenshot](/frontend/public/githubPictures/Screenshot%20from%202025-08-12%2016-24-57.png)

### About Page
![App Screenshot](/frontend/public/githubPictures/Screenshot%20from%202025-08-12%2016-25-09.png)

---
