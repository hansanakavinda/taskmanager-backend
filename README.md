# Task Manager Backend

A RESTful API for a task management application built with Node.js, Express, and Prisma ORM with PostgreSQL.

## Features

- ✅ User management (CRUD operations)
- ✅ Task management (CRUD operations)
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ Database integration with Prisma ORM
- ✅ PostgreSQL database support
- ✅ Security headers with Helmet
- ✅ CORS support

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials and configuration.

4. Set up the database:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database (optional)
   npm run db:seed
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/task_manager?schema=public"
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed the database with sample data

## API Endpoints

### Health Check
- `GET /health` - Check API status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Tasks
- `GET /api/tasks` - Get all tasks (with optional filters)
- `GET /api/tasks/:id` - Get task by ID
- `GET /api/tasks/user/:userId` - Get tasks by user ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Request/Response Examples

### Create User
```json
POST /api/users
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Create Task
```json
POST /api/tasks
{
  "title": "Complete project",
  "description": "Finish the task manager project",
  "status": "PENDING",
  "priority": "HIGH",
  "dueDate": "2024-12-31T23:59:59Z",
  "userId": "user_id_here"
}
```

## Database Schema

### User Model
- `id` - Unique identifier (CUID)
- `email` - User email (unique)
- `username` - Username (unique)
- `password` - Hashed password
- `firstName` - First name (optional)
- `lastName` - Last name (optional)
- `avatar` - Avatar URL (optional)
- `isActive` - Account status
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

### Task Model
- `id` - Unique identifier (CUID)
- `title` - Task title
- `description` - Task description (optional)
- `status` - Task status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- `priority` - Task priority (LOW, MEDIUM, HIGH, URGENT)
- `dueDate` - Due date (optional)
- `completedAt` - Completion timestamp (optional)
- `userId` - Reference to user
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

## Error Handling

The API includes comprehensive error handling with:
- Input validation errors (400)
- Not found errors (404)
- Conflict errors (409)
- Server errors (500)
- Prisma database errors
- JWT authentication errors

## Security Features

- Helmet for security headers
- CORS support for cross-origin requests
- Input validation and sanitization
- Password hashing with bcrypt
- Environment variable configuration

## Development

For development, use:
```bash
npm run dev
```

This starts the server with nodemon for automatic restarts on file changes.

## Testing

Run tests with:
```bash
npm test
```

## License

MIT License"# taskmanager-backend" 
