# AI Novel Assistant Backend API

## Authentication System

This backend implements a complete JWT-based authentication system with the following features:

### Features
- ✅ User registration and login
- ✅ JWT token-based authentication
- ✅ Protected routes for user-specific data
- ✅ Password hashing with bcrypt
- ✅ Input validation and error handling
- ✅ Rate limiting and security middleware
- ✅ CORS configuration for frontend integration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
DB_PATH=./database/stories.sqlite

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=8000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Optional: API Keys for LLM Services
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_API_KEY=your-google-key
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected User Endpoints

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new_username",
  "email": "newemail@example.com"
}
```

#### Change Password
```http
PUT /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Story Management (Protected)

#### Get User Stories
```http
GET /api/stories
Authorization: Bearer <token>
```

#### Create Story
```http
POST /api/stories
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Story",
  "synopsis": "A brief description",
  "genre": "Fantasy",
  "content": "Story content here..."
}
```

#### Get Specific Story
```http
GET /api/stories/:id
Authorization: Bearer <token>
```

#### Update Story
```http
PUT /api/stories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### Delete Story
```http
DELETE /api/stories/:id
Authorization: Bearer <token>
```

#### Export Story
```http
GET /api/stories/:id/export?format=pdf
Authorization: Bearer <token>
```

### Project Management (Protected)

#### Get User Projects
```http
GET /api/projects
Authorization: Bearer <token>
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Novel Project",
  "description": "A fantasy novel",
  "genre": "Fantasy",
  "keywords": "magic, adventure, quest",
  "tone": "epic",
  "setting": "medieval world",
  "length_preference": "novel"
}
```

### LLM Services (Protected)

#### Test LLM Connection
```http
GET /api/llm/test
Authorization: Bearer <token>
```

#### Generate with OpenAI
```http
POST /api/llm/openai
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Write a story about..."
}
```

#### Generate with Claude
```http
POST /api/llm/claude
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Write a story about..."
}
```

#### Generate with Gemini
```http
POST /api/llm/gemini
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Write a story about..."
}
```

## Error Responses

All endpoints return consistent error responses:

### Validation Error (400)
```json
{
  "success": false,
  "message": "Username, email, and password are required"
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "message": "Forbidden: You do not own this story"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Story not found"
}
```

### Conflict Error (409)
```json
{
  "success": false,
  "message": "User with this email or username already exists"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Failed to create user"
}
```

## Security Features

### Rate Limiting
- 100 requests per 15 minutes per IP address
- Applied to all `/api/` routes

### CORS Configuration
- Configured for frontend integration
- Credentials enabled for token handling

### Security Headers
- Helmet.js for security headers
- Protection against common vulnerabilities

### Password Security
- bcrypt hashing with salt rounds of 12
- Minimum 6 character password requirement

### JWT Security
- 24-hour token expiration
- Secure token generation and verification

## Installation and Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file with required variables

3. Start the server:
```bash
npm start
```

4. For development with auto-restart:
```bash
npm run dev
```

## Testing

Run tests with:
```bash
npm test
```

## Frontend Integration

The frontend should:

1. Store the JWT token in localStorage or secure storage
2. Include the token in all API requests:
```javascript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

3. Handle authentication errors (401) by redirecting to login
4. Refresh tokens when they expire (implement token refresh logic)

## Database Schema

The authentication system uses the following database tables:

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash` (Hashed password)
- `created_at` (Timestamp)

### Stories Table
- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `title`
- `synopsis`
- `genre`
- `content`
- `created_at`
- `updated_at`

### Projects Table
- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `name`
- `description`
- `genre`
- `keywords`
- `tone`
- `setting`
- `length_preference`
- `created_at`
- `updated_at` 