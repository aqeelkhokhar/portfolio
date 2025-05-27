// Vercel Serverless Function for portfolio data
import dotenv from "dotenv";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

// Configure dotenv
dotenv.config();

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
    // Set up Google Sheets
    const googleSheet = await setupGoogleSheets();

    if (!googleSheet) {
      return res.status(500).json({
        error: "Failed to connect to Google Sheets",
        credentials: {
          hasSheetId: !!process.env.GOOGLE_SHEET_ID,
          hasEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          hasKey: !!process.env.GOOGLE_PRIVATE_KEY,
        },
      });
    }

    // Fetch portfolio data
    const portfolioData = await fetchPortfolioData(googleSheet);

    // Return the data
    return res.status(200).json(portfolioData);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch portfolio data",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}

// Setup Google Sheets API
async function setupGoogleSheets() {
  try {
    // Google Sheets credentials
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!sheetId || !clientEmail || !privateKey) {
      return null;
    }

    // Create JWT auth
    const auth = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Create and load the spreadsheet
    const doc = new GoogleSpreadsheet(sheetId, auth);
    await auth.authorize();
    doc.auth = auth;
    await doc.loadInfo();

    return doc;
  } catch {
    return null;
  }
}

// Fetch all portfolio data from Google Sheets
async function fetchPortfolioData(googleSheet) {
  const portfolioData = {};

  try {
    // Load personal info
    const infoSheet = googleSheet.sheetsByTitle["PersonalInfo"];
    if (infoSheet) {
      const rows = await infoSheet.getRows();
      if (rows.length > 0) {
        const row = rows[0];
        portfolioData.personalInfo = {
          name: row.get("name"),
          title: row.get("title"),
          email: row.get("email"),
          countryCode: row.get("countryCode"),
          phone: row.get("phone"),
          location: row.get("location"),
          experience: row.get("experience"),
          tagline: row.get("tagline"),
          summary: row.get("summary"),
          linkedin: row.get("linkedin"),
          github: row.get("github"),
          medium: row.get("medium"),
          profileImage: row.get("profileImage") || "",
          resumeLink: row.get("resumeLink") || "",
        };
      }
    }

    // Load work experience
    const experienceSheet = googleSheet.sheetsByTitle["Experience"];
    if (experienceSheet) {
      const rows = await experienceSheet.getRows();
      portfolioData.experience = rows.map((row) => ({
        title: row.get("title"),
        company: row.get("company"),
        location: row.get("location"),
        type: row.get("type"),
        period: row.get("period"),
        responsibilities: row.get("responsibilities")?.split("\n") || [],
        companyLogo: row.get("companyLogo") || "",
        image: row.get("image") || "",
        icon: row.get("icon") || "",
      }));
    }

    // Load social links
    const socialLinks = googleSheet.sheetsByTitle["SocialLinks"];
    if (socialLinks) {
      const rows = await socialLinks.getRows();
      portfolioData.socialLinks = rows.map((row) => ({
        name: row.get("name"),
        link: row.get("link"),
        icon: row.get("icon") || "",
      }));
    }

    // Load skills
    const skillsSheet = googleSheet.sheetsByTitle["Skills"];
    if (skillsSheet) {
      const rows = await skillsSheet.getRows();
      const skillsByCategory = {};
      const categoryIcons = {};

      rows.forEach((row) => {
        const category = row.get("category");
        const skills = row.get("skills");
        const icon = row.get("icon") || "";

        if (!skillsByCategory[category]) {
          skillsByCategory[category] = [];
          categoryIcons[category] = icon;
        }

        skillsByCategory[category] = skills?.split(",");
      });

      portfolioData.skills = Object.keys(skillsByCategory).map((category) => ({
        category,
        items: skillsByCategory[category],
        icon: categoryIcons[category],
      }));
    }

    // Load projects
    const projectsSheet = googleSheet.sheetsByTitle["Projects"];
    if (projectsSheet) {
      const rows = await projectsSheet.getRows();
      portfolioData.projects = rows.map((row) => {
        // Handle multiple images scenario
        let projectImages = [];
        if (row.get("images")) {
          projectImages = row.get("images")?.split(",") || [];
        } else if (row.get("image")) {
          projectImages = [row.get("image")];
        }

        return {
          title: row.get("title"),
          period: row.get("period"),
          description: row.get("description"),
          highlights: row.get("highlights")?.split("\n") || [],
          impacts: row.get("impacts")?.split("\n") || [],
          technologies: row.get("technologies")?.split(",") || [],
          role: row.get("role") || "",
          company: row.get("company") || "",
          images: projectImages,
          image: row.get("image") || "",
          liveUrl: row.get("liveUrl") || "",
          githubUrl: row.get("githubUrl") || "",
        };
      });
    }

    // Load education
    const educationSheet = googleSheet.sheetsByTitle["Education"];
    if (educationSheet) {
      const rows = await educationSheet.getRows();
      portfolioData.education = rows.map((row) => ({
        institution: row.get("institution"),
        degree: row.get("degree"),
        field: row.get("field"),
        period: row.get("period"),
        location: row.get("location"),
        logo: row.get("logo") || "",
      }));
    }

    // Load certificates
    const certificatesSheet = googleSheet.sheetsByTitle["Certificates"];
    if (certificatesSheet) {
      const rows = await certificatesSheet.getRows();
      portfolioData.certificates = rows.map((row) => ({
        name: row.get("name"),
        issuer: row.get("issuer"),
        date: row.get("date"),
        credentialId: row.get("credentialId") || "",
        credentialUrl: row.get("credentialUrl") || "",
        logo: row.get("logo") || "",
      }));
    }

    // Load achievements
    const achievementsSheet = googleSheet.sheetsByTitle["Achievements"];
    if (achievementsSheet) {
      const rows = await achievementsSheet.getRows();
      portfolioData.achievements = rows.map((row) => ({
        title: row.get("title"),
        description: row.get("description") || "",
        date: row.get("date") || "",
        url: row.get("url") || "",
      }));
    }

    return portfolioData;
  } catch (error) {
    throw error;
  }
}
