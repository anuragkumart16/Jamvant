# Jamvant Cron Service

This service runs a cron job to send push notifications to users every 2 hours.

## Deployment on Render

1.  **Create a new Web Service** (or Background Worker) on Render.
2.  Connect your repository and point the **Root Directory** to `cron`.
3.  **Runtime**: Docker (it will use the `Dockerfile`).
4.  **Environment Variables**:
    - `DATABASE_URL`: Your production MongoDB connection string.
    - `GOOGLE_APPLICATION_CREDENTIALS`: (If needed for Firebase, though we are using Expo SDK which handles it via Expo servers, but ensure your Expo project is configured).
    - `EXPO_ACCESS_TOKEN`: (Optional) If you have an Expo Access Token.

## Local Development

1.  `cd cron`
2.  `npm install`
3.  `npm start`
