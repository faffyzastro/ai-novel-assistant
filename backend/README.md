# AI Novel Assistant Backend

## Overview
This is the backend for the AI Novel Assistant project. It provides RESTful APIs for user management, story generation, feedback, ratings, comments, file upload/download, LLM gateway, quality analysis, learning data, and more.

---

## Features
- User, project, and story management
- Multi-LLM gateway (OpenAI, Claude, Gemini) with fallback and caching
- Feedback, rating, and comment APIs
- File upload/download with tracking
- Quality analysis engine
- Learning/adaptation data storage
- Centralized error handling
- System monitoring/logging
- Health check endpoint

---

## Setup & Installation

1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd ai-novel-assistant/backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your API keys and config.
4. **Run the server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:8000` by default.

---

## Running Tests

- Run backend API tests with:
  ```bash
  npm test
  ```

---

## API Overview

- **Health Check:** `GET /api/health`
- **Users:** `POST /api/users`, `GET /api/users/:id`, ...
- **Stories:** `POST /api/stories`, `GET /api/stories/:id`, ...
- **Projects:** `POST /api/projects`, ...
- **LLM Gateway:** `POST /api/llm/generate`
- **Feedback:** `POST /api/feedback`, `GET /api/feedback/story/:storyId`, ...
- **Ratings:** `POST /api/ratings`, `GET /api/ratings/story/:storyId`, ...
- **Comments:** `POST /api/comments`, `GET /api/comments/story/:storyId`, ...
- **Files:** `POST /api/files/upload`, `GET /api/files/:filename`, ...
- **Quality Analysis:** `POST /api/quality/analyze`
- **Learning Data:** `GET/PUT/DELETE /api/learning/:userId`

---

## Deployment
- For production, set `NODE_ENV=production` and configure your environment variables.
- Use a process manager (e.g., PM2) or Docker for deployment.
- Ensure the `/uploads` directory is writable.
- Monitor logs and health check endpoint for uptime.

---

## Notes
- All errors are returned as JSON with appropriate status codes.
- LLM API keys and sensitive config should be kept in `.env` and never committed.
- For advanced monitoring, integrate with external tools (Datadog, Sentry, etc.). 