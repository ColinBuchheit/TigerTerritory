# Tiger Territory - Mizzou Sports Website

## Project Overview
Tiger Territory is a full-stack MEAN (MongoDB, Express, Angular, Node.js) application that provides a comprehensive platform for University of Missouri sports fans to follow their favorite teams. The application features news articles, schedules, and interactive commenting functionality for major sports including football, basketball, baseball, and wrestling.

![Mizzou Tiger Logo](client/src/assets/tiger-logo.png)

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation and Setup](#installation-and-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Team Members and Roles](#team-members-and-roles)
- [Deployment](#deployment)
- [Video Presentation](#video-presentation)

## Features
- **User Authentication:** Register, login, and user profile management
- **Sports Sections:** Dedicated pages for football, basketball, baseball, and wrestling
- **News Articles:** Read the latest news about Mizzou sports teams
- **Comments System:** Authenticated users can leave comments on articles, edit their own comments, and delete them
- **Responsive Design:** Mobile-friendly interface that works on all device sizes
- **Admin Dashboard:** Special privileges for administrative users

## Technology Stack

### Frontend
- **Angular 19:** Modern, component-based frontend framework
- **Angular Router:** For navigation and routing
- **Angular Services:** For data management and API communication
- **Observables (RxJS):** For handling asynchronous operations
- **TypeScript Interfaces:** For type safety and data modeling
- **Responsive CSS:** Custom styling with mobile-first approach

### Backend
- **Node.js:** JavaScript runtime for server-side execution
- **Express:** Web framework for building the REST API
- **MongoDB:** NoSQL database for data storage
- **Mongoose:** ODM for MongoDB schema definition and validation
- **JWT (JSON Web Tokens):** For secure authentication
- **Bcrypt:** For password hashing and security

### DevOps
- **Git/GitHub:** Version control and collaboration
- **Render:** Cloud platform for deployment
- **MongoDB Atlas:** Cloud database hosting

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ColinBuchheit/TigerTerritory
   cd tiger-territory
   ```

2. **Configure Environment Variables**
   - Create a `.env` file in the server directory with the following variables:
     ```
     PORT=5000
     NODE_ENV=development
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRES_IN=1d
     ```

3. **Install Dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

4. **Seed the Database**
   ```bash
   cd ../server
   node seeders/seed.js
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1: Start backend server
   cd server
   npm run dev

   # Terminal 2: Start Angular development server
   cd client
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000/api
   - API Documentation: http://localhost:5000/api-docs

## Project Structure

```
tiger-territory/
│
├── client/                 # Angular frontend
│   ├── src/
│   │   ├── app/            # Application components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── navigation/ # Navigation components
│   │   │   ├── pages/      # Page components (sports pages)
│   │   │   └── services/   # Angular services
│   │   ├── assets/         # Static assets (images, etc.)
│   │   └── environments/   # Environment configurations
│   ├── angular.json        # Angular CLI configuration
│   └── package.json        # Frontend dependencies
│
├── server/                 # Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── docs/               # API documentation
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── seeders/            # Database seed scripts
│   ├── utils/              # Utility functions
│   ├── app.js              # Express application setup
│   └── server.js           # HTTP server setup
│
├── .gitignore              # Git ignore file
├── .env                    # Environment variables (not in repo)
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## API Documentation

The API documentation is available through Swagger UI at `/api-docs` when running the server. It provides detailed information about all available endpoints, request/response formats, and authentication requirements.

### Main API Endpoints

- **Authentication**
  - POST `/api/auth/register` - Register a new user
  - POST `/api/auth/login` - Login and get authentication token
  - GET `/api/auth/me` - Get current user profile

- **Comments**
  - GET `/api/comments/:postId` - Get all comments for a specific post
  - POST `/api/comments/:postId` - Add a new comment to a post
  - PUT `/api/comments/:id` - Update a comment
  - DELETE `/api/comments/:id` - Delete a comment

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Here's how it works:

1. **Registration/Login:** When a user registers or logs in, the server generates a JWT and returns it to the client.
2. **Token Storage:** The token is stored in the browser's localStorage.
3. **Authorization:** For subsequent requests that require authentication, the token is sent in the `x-auth-token` header.
4. **Token Validation:** The server validates the token before processing the request.
5. **Permissions:** Different user roles (user, admin) have different permissions.

### User Roles

- **Regular User:** Can create, edit, and delete their own comments
- **Admin:** Can manage all comments and has access to additional administrative features

## Team Members and Roles

Our team worked collaboratively across the full stack, with each member contributing to both frontend and backend development:

### Colin Buchheit
- **Role:** Backend server dev
- **Contributions:**
  - Project setup and architecture
  - Express.js server configuration
  - DB Modeling prep
  - Authentication system implementation
  - API documentation

### Jakob Donald
- **Role:** Frontend Developer & UX Designer
- **Contributions:**
  - Angular component development
  - Responsive UI design
  - CSS styling and animations
  - Cross-browser testing

### 
- **Role:** 
- **Contributions:**
 

### 
- **Role:** 
- **Contributions:**


## Deployment

The application is deployed and accessible at the following URL:

- **Live Site:** [https://tiger-territory.onrender.com](https://tiger-territory.onrender.com)

### Deployment Architecture

The application is deployed on Render with the following configuration:

1. **Frontend:** Static site hosting for the Angular application
2. **Backend:** Web service for the Express API
3. **Database:** MongoDB Atlas for database hosting

### Deployment Process

1. The Angular application is built with `ng build` to generate static files
2. The Express server serves both the API and the static files
3. Environment variables are configured in the Render dashboard
4. Database connection is secured with MongoDB Atlas

## Video Presentation

Our team presentation is available on YouTube:

- **Presentation Link:** [Tiger Territory Project Presentation](url_link_here)

The presentation covers:
- Project overview and features demonstration
- Technical architecture explanation

