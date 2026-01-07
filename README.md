# Khadamati Backend API

RESTful API backend for Khadamati service platform built with Node.js, Express, and Sequelize ORM.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (XAMPP or standalone)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
- Copy `.env.example` to `.env`
- Update database credentials if needed

3. Ensure MySQL is running and the `khadamati` database exists with the schema from `database/KHD35.sql`

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will start on http://localhost:5000

## API Base URL

```
http://localhost:5000/api/v1
```

## Features

- JWT authentication with refresh tokens
- Role-based access control (Admin, Customer, Provider)
- File upload support
- Input validation
- Error handling
- CORS enabled
- Security headers (Helmet)
- Request logging (Morgan)

## Project Structure

```
Server/
├── database/         # SQL schema
├── uploads/          # User uploaded files
├── src/
│   ├── server.js     # Entry point
│   ├── app.js        # Express app
│   ├── config/       # Configuration
│   ├── models/       # Sequelize models
│   ├── controllers/  # Business logic
│   ├── routes/       # API routes
│   ├── middlewares/  # Custom middlewares
│   └── utils/        # Utility functions
├── .env              # Environment variables
└── package.json      # Dependencies
```

## API Documentation

See individual route files in `src/routes/` for detailed endpoint documentation.

## Database

Uses MySQL with Sequelize ORM. All 18 tables are mapped to Sequelize models with proper associations.
