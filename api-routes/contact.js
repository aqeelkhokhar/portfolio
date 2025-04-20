// Vercel Serverless Function for contact form
import dotenv from "dotenv";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
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

// Google Sheets credentials
const googleSheetCredentials = {
  sheetId: process.env.GOOGLE_SHEET_ID || "",
  clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
  privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
};

// Setup Google Sheets API
const setupGoogleSheets = async () => {
  try {
    const { sheetId, clientEmail, privateKey } = googleSheetCredentials;

    if (!sheetId || !clientEmail || !privateKey) {
      return null;
    }

    const auth = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);

    // Initialize with service account
    try {
      await auth.authorize();
      doc.auth = auth;
      await doc.loadInfo();
      return doc;
    } catch (authError) {
      return null;
    }
  } catch {
    return null;
  }
};

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
    // Set up Google Sheets
    const googleSheet = await setupGoogleSheets();

    // Store in Google Sheets if available
    if (googleSheet) {
      try {
        let contactSheet =
          Object.values(googleSheet.sheetsByTitle).find(
            (sheet) => sheet.title.toLowerCase() === "contacts"
          ) || null;
        if (!contactSheet) {
          contactSheet = await googleSheet.addSheet({ title: "Contacts" });
          await contactSheet.setHeaderRow([
            "name",
            "email",
            "subject",
            "message",
            "date",
          ]);
        }
        // Add new contact row
        await contactSheet.addRow({
          ...req.body,
          date: new Date().toISOString(),
        });
      } catch {}

      // Send email notification
      try {
        // Load personal info
        let email = null;
        const infoSheet = googleSheet.sheetsByTitle["PersonalInfo"];
        if (infoSheet) {
          const rows = await infoSheet.getRows();
          if (rows.length > 0) {
            const row = rows[0];
            email = row.get("email");
          }
        }
        if (email) {
          // Email content
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: req.body.subject,
            html: `
<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <h2 style="color: #2c3e50; font-size: 22px; margin-bottom: 20px; border-bottom: 2px solid #f1f1f1; padding-bottom: 10px;">
    New Contact Submission ✉️
  </h2>

  <p style="margin: 15px 0; font-size: 16px; color: #333;">
  <strong>Name:</strong><br />
  <span style="color: #555;">${req?.body?.name}</span>
  </p>
  
  <p style="margin: 15px 0; font-size: 16px; color: #333;">
   <strong>Name:</strong><br />
   <span style="color: #555;">${req?.body?.email}</span>
 </p>

  <p style="margin: 15px 0; font-size: 16px; color: #333;">
    <strong>Message:</strong>
  </p>
  <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; border-radius: 5px; font-size: 15px; color: #444; line-height: 1.6;">
    ${req?.body?.message}
  </div>

  <p style="margin-top: 30px; font-size: 13px; color: #888; text-align: center;">
    This email was generated automatically from the contact form on your website.
  </p>
</div>
`,
          };

          // Send the email
          await transporter.sendMail(mailOptions);
        }
      } catch {}
    }

    return res.status(201).json({
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to process contact form",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
