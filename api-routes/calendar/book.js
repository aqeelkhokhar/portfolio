// Vercel Serverless Function for booking calendar appointments
import dotenv from "dotenv";
import { JWT, OAuth2Client } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { google } from "googleapis";
import nodemailer from "nodemailer";

// Configure dotenv
dotenv.config();

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Create OAuth client
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Load token from environment variable
const loadToken = () => {
  try {
    // For Vercel, use environment variable directly
    if (process.env.GOOGLE_TOKEN_JSON) {
      // Ensure the token is properly formatted
      let tokenData = process.env.GOOGLE_TOKEN_JSON;

      // Check if it's already an object (some environments automatically parse JSON)
      if (typeof tokenData === "object" && tokenData !== null) {
        oAuth2Client.setCredentials(tokenData);
        return true;
      }

      // Otherwise parse it as JSON string
      try {
        // Handle case where token might have been double-stringified
        let parsedToken;
        try {
          parsedToken = JSON.parse(tokenData);

          // If the parsed result is still a string, try parsing again (double-stringified)
          if (typeof parsedToken === "string") {
            parsedToken = JSON.parse(parsedToken);
          }
        } catch (e) {
          // If token is not valid JSON, try to extract it assuming it's a different format
          const tokenMatch = tokenData.match(/({"access_token".*})/);
          if (tokenMatch && tokenMatch[1]) {
            parsedToken = JSON.parse(tokenMatch[1]);
          } else {
            throw e;
          }
        }

        // Ensure we have an access_token before proceeding
        if (!parsedToken.access_token) {
          return false;
        }

        oAuth2Client.setCredentials(parsedToken);

        // Ensure we have an access_token before proceeding
        if (!parsedToken.access_token) {
          return false;
        }

        oAuth2Client.setCredentials(parsedToken);

        // Verify credentials are set
        const credentials = oAuth2Client.credentials;
        if (!credentials || !credentials.access_token) {
          return false;
        }

        return true;
      } catch {
        return false;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
};

// Setup Google Calendar API
const setupGoogleCalendar = async () => {
  try {
    // Only use OAuth authentication
    if (!loadToken()) {
      return null;
    }

    const calendar = google.calendar({
      version: "v3",
      auth: oAuth2Client,
    });

    return {
      calendar,
      calendarId: "primary",
    };
  } catch {
    return null;
  }
};

// Create an appointment
const createAppointment = async (appointmentDetails) => {
  try {
    const { name, email, subject, description, startTime, endTime } =
      appointmentDetails;

    const calendarSetup = await setupGoogleCalendar();
    if (!calendarSetup) {
      return null;
    }

    const { calendar, calendarId } = calendarSetup;

    // Create event
    const event = {
      summary: subject,
      description: description || `Appointment with ${name}`,
      start: {
        dateTime: startTime,
        timeZone: "UTC",
      },
      end: {
        dateTime: endTime,
        timeZone: "UTC",
      },
      attendees: [{ email }],
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    return response.data;
  } catch {
    return null;
  }
};

// Google Sheets setup for getting owner info
const setupGoogleSheets = async () => {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!sheetId || !clientEmail || !privateKey) {
      return null;
    }

    const auth = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await auth.authorize();
    doc.auth = auth;
    await doc.loadInfo();

    return doc;
  } catch {
    return null;
  }
};

// Get owner information
async function getOwnerInfo() {
  try {
    const googleSheet = await setupGoogleSheets();

    if (!googleSheet) {
      return null;
    }

    const infoSheet = googleSheet.sheetsByTitle["PersonalInfo"];
    if (!infoSheet) {
      return null;
    }

    const rows = await infoSheet.getRows();
    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      name: row.get("name"),
      email: row.get("email"),
    };
  } catch {
    return null;
  }
}

// Handler function for Vercel serverless function
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, description, startTime, endTime } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !startTime || !endTime) {
      return res.status(400).json({
        message:
          "Missing required fields. Please provide name, email, subject, startTime, and endTime.",
      });
    }

    // Create appointment in Google Calendar
    const appointment = await createAppointment({
      name,
      email,
      subject,
      description,
      startTime,
      endTime,
    });

    if (!appointment) {
      return res.status(500).json({ message: "Failed to create appointment" });
    }

    // If we have a transporter set up, send confirmation email
    try {
      if (transporter) {
        const ownerInfo = await getOwnerInfo();
        // Email to the person who booked
        const clientMailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Appointment Confirmation: ${subject}`,
          html: `
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <h2 style="color: #2c3e50; font-size: 22px; margin-bottom: 20px; border-bottom: 2px solid #f1f1f1; padding-bottom: 10px;">
                Your Appointment is Confirmed ✅
              </h2>
              
              <p style="margin: 15px 0; font-size: 16px; color: #333;">
                Hello ${name},
              </p>
              
              <p style="margin: 15px 0; font-size: 16px; color: #333;">
                Your appointment has been scheduled successfully. Here are the details:
              </p>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0; font-size: 15px;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 5px 0; font-size: 15px;"><strong>Date:</strong> ${new Date(
                  startTime
                ).toLocaleDateString()}</p>
                <p style="margin: 5px 0; font-size: 15px;"><strong>Time:</strong> ${new Date(
                  startTime
                ).toLocaleTimeString()} - ${new Date(
            endTime
          ).toLocaleTimeString()}</p>
                ${
                  appointment.hangoutLink
                    ? `<p style="margin: 5px 0; font-size: 15px;"><strong>Meeting Link:</strong> <a href="${appointment.hangoutLink}">${appointment.hangoutLink}</a></p>`
                    : ""
                }
              </div>
              
              <p style="margin: 15px 0; font-size: 16px; color: #333;">
                I'm looking forward to our meeting!
              </p>
              
              <p style="margin: 15px 0; font-size: 16px; color: #333;">
                Best regards,<br>
                ${ownerInfo?.name || "Portfolio Owner"}
              </p>
            </div>
          `,
        };

        await transporter.sendMail(clientMailOptions);

        // Also notify the portfolio owner
        if (ownerInfo?.email) {
          const ownerMailOptions = {
            from: process.env.EMAIL_USER,
            to: ownerInfo?.email,
            subject: `New Appointment: ${subject}`,
            html: `
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <h2 style="color: #2c3e50; font-size: 22px; margin-bottom: 20px; border-bottom: 2px solid #f1f1f1; padding-bottom: 10px;">
                  New Appointment Booked 📅
                </h2>
                
                <p style="margin: 15px 0; font-size: 16px; color: #333;">
                  Hello ${ownerInfo.name},
                </p>
                
                <p style="margin: 15px 0; font-size: 16px; color: #333;">
                  A new appointment has been scheduled with you. Here are the details:
                </p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; border-radius: 5px; margin: 20px 0;">
                  <p style="margin: 5px 0; font-size: 15px;"><strong>Contact:</strong> ${name} (${email})</p>
                  <p style="margin: 5px 0; font-size: 15px;"><strong>Subject:</strong> ${subject}</p>
                  <p style="margin: 5px 0; font-size: 15px;"><strong>Date:</strong> ${new Date(
                    startTime
                  ).toLocaleDateString()}</p>
                  <p style="margin: 5px 0; font-size: 15px;"><strong>Time:</strong> ${new Date(
                    startTime
                  ).toLocaleTimeString()} - ${new Date(
              endTime
            ).toLocaleTimeString()}</p>
                  ${
                    appointment.hangoutLink
                      ? `<p style="margin: 5px 0; font-size: 15px;"><strong>Meeting Link:</strong> <a href="${appointment.hangoutLink}">${appointment.hangoutLink}</a></p>`
                      : ""
                  }
                  ${
                    description
                      ? `<p style="margin: 15px 0; font-size: 15px;"><strong>Description:</strong><br>${description}</p>`
                      : ""
                  }
                </div>
              </div>
            `,
          };

          await transporter.sendMail(ownerMailOptions);
        }
      }
    } catch {}

    return res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to book appointment",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
