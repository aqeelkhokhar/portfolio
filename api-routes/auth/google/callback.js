// Vercel Serverless Function for Google OAuth callback
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

// Configure dotenv
dotenv.config();

// Create OAuth client
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Exchange code for tokens
const getTokenFromCode = async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);

    // Set the credentials for the OAuth client to verify they work
    oAuth2Client.setCredentials(tokens);

    // Verify the token works by making a simple call
    try {
      const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
      await calendar.calendarList.list();
    } catch (verifyError) {}

    return tokens;
  } catch (error) {
    throw error;
  }
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
    const { code } = req.query;

    if (!code) {
      return res
        .status(400)
        .json({ message: "Authorization code is required" });
    }

    // Exchange the code for tokens
    const tokens = await getTokenFromCode(code);

    // Store tokens (we can't write to a file in Vercel serverless functions)
    // Instead, display them to the user for manual configuration
    res.status(200).send(`
      <html>
        <head>
          <title>Google Calendar Authentication Complete</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 20px;
              margin-top: 20px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
              color: #2c3e50;
            }
            .token-container {
              background-color: #f1f1f1;
              padding: 15px;
              border-radius: 5px;
              overflow-wrap: break-word;
              word-wrap: break-word;
              word-break: break-all;
              margin: 20px 0;
            }
            .instructions {
              background-color: #e8f5e9;
              padding: 15px;
              border-radius: 5px;
              margin-top: 20px;
            }
            .warning {
              color: #c62828;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Google Calendar Authentication Successful</h1>
            <p>Your Google Calendar has been successfully authenticated! To use this token on Vercel, please add the following as an environment variable named <code>GOOGLE_TOKEN_JSON</code>:</p>
            
            <div class="token-container">
              <code>${JSON.stringify(tokens)}</code>
            </div>
            
            <div class="instructions">
              <h3>Instructions:</h3>
              <ol>
                <li>Copy the entire token string above (including the curly braces).</li>
                <li>Go to your Vercel project settings.</li>
                <li>Navigate to the "Environment Variables" section.</li>
                <li>Add a new environment variable with the name <code>GOOGLE_TOKEN_JSON</code> and paste the token as the value.</li>
                <li>Save the changes and redeploy your application.</li>
              </ol>
            </div>
            
            <p class="warning">Note: This token gives access to your Google Calendar. Keep it secure and never share it publicly.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({
      message: "Authentication failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
