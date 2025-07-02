# Deploying the Backend to Render

## Prerequisites
- Push your code to a GitHub repository.
- Ensure your backend has a `start` script in `package.json`:
  ```json
  "scripts": {
    "start": "node server.js"
  }
  ```
- Add a `.env` file (see `.env.example`). **Do not commit your real .env to GitHub.**

## Step-by-Step Deployment on Render

1. **Create a Render Account**
   - Go to https://render.com and sign up (free tier is fine).

2. **Create a New Web Service**
   - Click "New +" → "Web Service".
   - Connect your GitHub account and select your backend repo.

3. **Configure the Service**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** If your backend is in a subfolder (like `ai-novel-assistant/backend`), set the root directory accordingly in advanced settings.
   - **Environment Variables:** Add all variables from your `.env.example` (e.g., `JWT_SECRET`, `PORT`).

4. **SQLite Database Note**
   - Your SQLite file (`ai-novel-assistant/database/ai-novel.sqlite`) will persist between deploys, but is not suitable for heavy production use or scaling.
   - For production, consider using a managed database (like PostgreSQL).

5. **Deploy**
   - Click "Create Web Service".
   - Render will install dependencies and start your server.
   - You'll get a public URL (e.g., `https://your-app.onrender.com`).

6. **Update Your Frontend**
   - Set your frontend's API URL to the new backend URL (in `.env` or config).

7. **Test**
   - Visit your Render URL to check your backend API.
   - Test login, registration, etc. from your frontend.

8. **(Optional) Custom Domain & HTTPS**
   - Render provides a free HTTPS subdomain.
   - You can add your own custom domain if you want.

## Troubleshooting
- Check Render logs for errors.
- Make sure all environment variables are set.
- If you need to upload your SQLite file, use the Render dashboard or deploy from your local machine.

---

**For more advanced setups (Docker, PostgreSQL, etc.), ask for a custom guide!** 