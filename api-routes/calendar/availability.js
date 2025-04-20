// Vercel Serverless Function for calendar availability
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

// Configure dotenv
dotenv.config();

const duration = parseInt(process.env.MEETING_DURATION || "30");

// Create OAuth client
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Load token from environment variable or file
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
    } else {
    }
    return false;
  } catch {
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
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    // Parse the requested date
    const requestedDate = new Date(date);
    if (isNaN(requestedDate.getTime())) {
      throw new Error("Invalid date format");
    }

    // Helper function to round to nearest slot
    const roundToNextSlot = (date, duration) => {
      const minutes = date.getMinutes();
      const remainder = minutes % duration;
      if (remainder === 0) return date; // Already rounded
      date.setMinutes(minutes + duration - remainder);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    };

    // Setup the calendar client
    const calendarSetup = await setupGoogleCalendar();
    if (!calendarSetup) {
      return res.status(500).json({
        message: "Failed to set up Google Calendar",
        tokenAvailable: !!process.env.GOOGLE_TOKEN_JSON,
      });
    }

    const { calendar, calendarId } = calendarSetup;

    // Check if the requested date is today
    const today = new Date();
    const isToday =
      requestedDate.getDate() === today.getDate() &&
      requestedDate.getMonth() === today.getMonth() &&
      requestedDate.getFullYear() === today.getFullYear();

    // Define day boundaries
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Set end of day to include the last slot that starts at 11:30 PM
    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // For checking events, we need to include the first 30 minutes of the next day
    const extendedEndOfDay = new Date(requestedDate);
    extendedEndOfDay.setDate(extendedEndOfDay.getDate() + 1);
    extendedEndOfDay.setHours(0, duration, 0, 0); // Include duration minutes into next day

    const now = new Date();

    // Get all events for this day (and the first 30 minutes of the next day)
    const eventsResponse = await calendar.events.list({
      calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: extendedEndOfDay.toISOString(),
      singleEvents: true,
    });

    const events = eventsResponse.data.items || [];
    const busyEvents = events.filter(
      (event) => event.status !== "cancelled" && !event.transparency
    );

    // Generate all potential time slots for the day
    const slots = [];

    let currentSlotStart = isToday
      ? roundToNextSlot(new Date(now), duration)
      : new Date(startOfDay);

    // Set business hours (9 AM to 12 AM/midnight)
    const businessHoursStart = 9; // 9 AM
    const businessHoursEnd = 24; // 12 AM (midnight)

    // Allow slots that start before midnight but might end slightly after
    while (currentSlotStart <= endOfDay) {
      // Only consider slots during business hours
      const hour = currentSlotStart.getHours();
      if (hour >= businessHoursStart && hour < businessHoursEnd) {
        const currentSlotEnd = new Date(
          currentSlotStart.getTime() + duration * 60 * 1000
        );

        // Check if this slot overlaps with any busy events
        const isSlotBusy = busyEvents.some((event) => {
          const eventStart = new Date(
            event.start?.dateTime || event.start?.date || ""
          );
          const eventEnd = new Date(
            event.end?.dateTime || event.end?.date || ""
          );

          // Check for overlap
          return (
            (currentSlotStart >= eventStart && currentSlotStart < eventEnd) ||
            (currentSlotEnd > eventStart && currentSlotEnd <= eventEnd) ||
            (currentSlotStart <= eventStart && currentSlotEnd >= eventEnd)
          );
        });

        // Only add the slot if it's not busy
        if (!isSlotBusy) {
          slots.push({
            start: currentSlotStart.toISOString(),
            end: currentSlotEnd.toISOString(),
          });
        }
      }

      // Move to the next slot
      currentSlotStart = new Date(
        currentSlotStart.getTime() + duration * 60 * 1000
      );
      currentSlotStart = roundToNextSlot(currentSlotStart, duration);
    }

    res.status(200).json({ availableSlots: slots });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch available time slots",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
