# Gaming Services Platform

A full-stack portfolio project built with **React**, **Vite**, **Express**, **Prisma**, and **PostgreSQL**.

This project is designed as a **game services marketplace demo platform** where users can register, log in, browse service types, and later place customized service orders. It is being developed as a **software engineering portfolio project** to demonstrate frontend development, backend API development, relational database design, Prisma ORM usage, authentication, authorization, and full-stack project setup.

---

## Project Purpose

This project was created as a **portfolio/demo application** to showcase practical software engineering skills.

The goal is to demonstrate experience in:

- building a modern frontend with React
- setting up a backend server with Express
- designing a relational database
- connecting to a remote PostgreSQL database
- using Prisma for schema management and migrations
- implementing secure authentication with bcrypt and JWT
- structuring a full-stack app with separate client and server folders
- preparing a project that can later be deployed online

This project is intended to be shown on **GitHub** and potentially referenced on **LinkedIn**.

---

## Project Concept

The system is designed around a platform-style structure where users can register, authenticate, browse predefined service types, and later place custom orders.

Planned roles include:
- **Customer**
- **Provider**
- **Admin**

Core entities include:
- **User**
- **Profile**
- **Service**
- **Order**

### Current service types
- **Rank Boost**
- **Placement Boost**
- **Win Boost**
- **Hire a Teammate**

### Important design decision
A **Service** is treated as a **platform-wide service category**, not a user-owned listing.

That means:
- Service does **not** have a fixed price
- Service does **not** have `ownerId`
- Price and request details will belong to the **Order** side later

---

## Tech Stack

### Frontend
- React
- Vite

### Backend
- Node.js
- Express

### Database
- PostgreSQL

### ORM
- Prisma

### Additional packages
- cors
- dotenv
- bcrypt
- jsonwebtoken
- nodemon
- @prisma/adapter-pg
- pg

---

## Project Structure

```text
gaming-services-platform/
  client/
  server/
  README.md
```

Inside `server/`:

```text
server/
  prisma/
    migrations/
    schema.prisma
  src/
    controllers/
      authController.js
      serviceController.js
    middleware/
      authMiddleware.js
    routes/
      authRoutes.js
      userRoutes.js
      serviceRoutes.js
    generated/
      prisma/
    app.js
    index.js
    prisma.js
  .env
  prisma.config.ts
  package.json
```

---

## What We Completed

### Backend and database foundation
- Express backend created
- Prisma initialized and configured for Prisma 7
- Remote PostgreSQL database connected
- Prisma client generated
- backend health route working

### Frontend-backend connection
- frontend page connected to backend health route
- visible browser confirmation that backend is healthy

### Authentication
- registration API built
- password hashing added with bcrypt
- login API built
- JWT token generation added
- auth middleware added
- protected route tested successfully

### Service system
- service routes created
- service schema cleaned up
- `price` removed from `Service`
- `ownerId` removed from `Service`
- old `services` relation removed from `User`
- admin-only service creation added
- service creation tested successfully

---

## Current Status

### Working
- React frontend bootstrapped with Vite
- Express backend running
- Prisma configured successfully
- Remote PostgreSQL database connected
- Backend health endpoint working
- Frontend/backend visible connection working
- User registration working
- Password hashing with bcrypt working
- Login working
- JWT token generation working
- Auth middleware working
- Protected route working
- Admin-only service creation working
- Public service listing routes available

### Next logical development steps
- redesign the `Order` model for custom request data
- build order creation API
- build order listing and detail routes
- later add pricing/quote logic
- build frontend register/login pages
- build frontend service list
- build frontend order form
- build dashboards for customer, provider, and admin roles

---

## How to Run the Project

### 1. Open the frontend
```bash
cd .../gaming-services-platform/client
npm install
npm run dev
```

The frontend usually runs at a Vite local URL such as:
```text
http://localhost:5173/
```

### 2. Open the backend
```bash
cd .../gaming-services-platform/server
npm install
npm run dev
```

The backend runs at:

```text
http://localhost:5000/
```

Health check route:
```text
http://localhost:5000/api/health
```

### 3. Open the webpage
Use the Vite local frontend URL in the browser.

Important:
- `localhost:5000` = backend API
- `localhost:5173` (or similar) = frontend webpage

### 4. Keep both terminals open
Development usually needs two terminals:
- backend terminal
- frontend terminal

---

## How to View the Database

Use Prisma Studio:

```bash
cd .../gaming-services-platform/server
npx prisma studio
```

This will open Prisma Studio in your browser.

In Prisma Studio, you can:
- view tables
- view rows
- add records manually
- edit records
- delete records

Right now, you should see these tables:

- `User`
- `Profile`
- `Service`
- `Order`

If there is no data yet, the tables may appear empty, but they should still be visible.

---

## Environment Variables

Create:

`server/.env`

Example:
```env
DATABASE_URL="your_database_connection_string"
JWT_SECRET="your_secret_here"
```

Important:
- do not commit real credentials to GitHub
- if a DB credential or JWT secret gets exposed, rotate it

---

## Prisma Commands

### Validate schema
```bash
npx prisma validate
```

### Run migration
```bash
npx prisma migrate dev --name your_migration_name
```

### Generate Prisma client
```bash
npx prisma generate
```

### View database
```bash
npx prisma studio
```

---

## API Routes Available Right Now

### Public routes

#### Root route
```http
GET /
```

#### Health route
```http
GET /api/health
```

#### Get all services
```http
GET /api/services
```

#### Get one service by ID
```http
GET /api/services/:id
```

### Auth routes

#### Register
```http
POST /api/auth/register
```

#### Login
```http
POST /api/auth/login
```

Login success response includes:
- user info
- JWT token

### Protected routes

#### Current user
```http
GET /api/user/me
```

Requires:
- Bearer token

#### Create service
```http
POST /api/services
```

Requires:
- Bearer token
- `ADMIN` role

---

## Database Schema Summary

### User
Represents an account in the platform.

Fields include:
- id
- email
- passwordHash
- role
- createdAt
- updatedAt

### Profile
Stores optional profile information for a user.

Fields include:
- id
- userId
- displayName
- bio
- createdAt
- updatedAt

### Service
Represents a platform-defined service category.

Fields include:
- id
- title
- description
- createdAt
- updatedAt

### Order
Represents a customer order for a service.

Current fields include:
- id
- customerId
- serviceId
- notes
- status
- createdAt
- updatedAt

Important:
`Order` will be expanded later to handle custom request details and pricing inputs.

---

## Security Notes

### Passwords
Passwords are hashed with **bcrypt** and should never be stored in plain text.

### JWT auth
Protected routes use JWT Bearer tokens.

### Role-based access
Service creation is restricted to **ADMIN** accounts.

### Secrets
Database credentials and JWT secrets should remain in `.env` and should not be pushed to GitHub.

### API security note
Security should come from:
- authentication
- authorization
- role checks

not from hiding the API URL.

---

## Future Improvements

Planned next features include:
- redesigning the `Order` model
- order creation
- order listing
- pricing/quote logic
- frontend register page
- frontend login page
- frontend service list
- frontend order form
- admin management tools
- deployment

---

## Learning Outcomes From This Setup

This setup provided practical experience with:

- Git project initialization
- creating a React app with Vite
- troubleshooting Node/Vite version issues
- setting up an Express backend
- installing and organizing backend dependencies
- initializing Prisma
- dealing with Prisma 7 configuration changes
- creating a hosted remote database
- designing a relational schema
- running migrations
- generating Prisma Client
- testing backend routes
- running frontend and backend together locally
- viewing the database using Prisma Studio

This gives the project a strong full-stack starting point and a solid foundation for future development.

---

## Author

**An Nguyen Nguyen**

Portfolio full-stack project built for learning, practice, and professional presentation on GitHub and LinkedIn.
