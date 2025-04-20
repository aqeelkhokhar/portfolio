// Vercel Serverless Function for Google OAuth authentication
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

// Configure dotenv
dotenv.config();

// Create OAuth client
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate auth URL for user to visit
const getAuthUrl = () => {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // Force to always display the consent screen to get a refresh token
    scope: ["https://www.googleapis.com/auth/calendar"],
  });
};

// Handler function for Vercel serverless function
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Generate the authentication URL
    const authUrl = getAuthUrl();

    // Redirect the user to the Google OAuth consent screen
    res.redirect(authUrl);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate authentication URL",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
