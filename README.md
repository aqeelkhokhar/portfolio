# Portfolio & Meeting Manager

A modern, full-stack web application for managing client meetings and showcasing professional projects, built with React, TypeScript, Express, and integrates with Google Sheets for data storage. The application is designed to work in both local development (Express server) and production deployment (Vercel serverless functions).

## 🏗️ Architecture

This application has a dual architecture approach:

1. **Local Development**: Uses Express.js server to serve both the API endpoints and the client-side application
2. **Production (Vercel)**: Uses Vercel's serverless functions (in `/api-routes`) for API endpoints and static hosting for the client

This approach allows for a smooth development experience locally while leveraging Vercel's serverless architecture in production.

## 🚀 Features

- **Professional Portfolio Display**:

  - Showcase your professional projects with detailed information and images
  - Display work experience, skills, and education
  - Modern, responsive UI with dark mode support

- **Contact Management**:

  - Contact form for clients to reach out
  - Email notification system
  - Storage of contacts in Google Sheets

- **Data Management through Google Sheets**:
  - Portfolio data stored in and retrieved from Google Sheets
  - Easy to update content without code changes
  - Secure authentication with Google API

## 💻 Tech Stack

### Frontend

- React 18
- TypeScript
- TailwindCSS
- Shadcn UI Components
- React Hook Form for form management
- Tanstack React Query for data fetching
- Responsive design with mobile support

### Backend

- Node.js with Express
- Google Sheets API integration
- Nodemailer for email notifications
- JWT authentication for Google API

### Development & Deployment

- Vite for frontend development and building
- ESBuild for backend transpilation
- Environment variable management with dotenv

## 📋 Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ClientMeetingManager.git
   cd ClientMeetingManager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root with:

   ```
   GOOGLE_SHEET_ID=your_google_sheet_id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
   GOOGLE_PRIVATE_KEY=your_private_key
   EMAIL_USER=your_email
   EMAIL_PASSWORD=your_email_app_password
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=your_google_redirect_url
   MEETING_DURATION=your_meeting_duration
   GOOGLE_TOKEN_JSON=your_google_token_json
   ```

4. **Set up Google Sheets**:

   - Create a new Google Sheet with the following tabs:
     - PersonalInfo
     - Experience
     - Skills
     - Projects
     - Education
     - SocialLinks
   - Set up appropriate column headers in each sheet (refer to server/routes.ts for required columns)
   - Share the sheet with your service account email

5. **Run in development mode**

   ```bash
   npm run dev
   ```

6. **Build for production**

   ```bash
   npm run build
   ```

7. **Start production server**
   ```bash
   npm start
   ```

## 🔑 Google Services Setup

### Google Sheets API Setup

1. **Create a Google Cloud Project**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Note your Project ID

2. **Enable Google Sheets API**:

   - In your Google Cloud Project, navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it

3. **Create Service Account**:

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Enter a name and description for your service account
   - Grant the role "Editor" for the Google Sheets API
   - Click "Continue" and then "Done"

4. **Generate Service Account Key**:

   - Find your service account in the list and click on it
   - Go to the "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose JSON format and click "Create"
   - Your key will be downloaded automatically - keep it secure!

5. **Get Service Account Details**:

   - From the downloaded JSON file, note the `client_email` and `private_key`
   - These values will be used in your `.env` file

6. **Create and Share Google Sheet**:
   - Create a new Google Sheet with the tabs listed in the setup instructions
   - Get the Sheet ID from the URL (the long string between /d/ and /edit in the URL)
   - Share the sheet with the service account email (client_email) with Editor permissions

### Gmail Setup for Nodemailer

1. **Generate App Password**:

   - Go to your [Google Account](https://myaccount.google.com/)
   - Select "Security" from the sidebar
   - Under "Signing in to Google," select "2-Step Verification" (enable if not already)
   - At the bottom, select "App passwords"
   - Select "Mail" as the app and "Other" as the device (name it "ClientMeetingManager")
   - Click "Generate"
   - Copy the 16-character password that appears

2. **Configure Environment Variables**:
   - Add your Gmail address as `EMAIL_USER`
   - Add the generated app password as `EMAIL_PASSWORD`

## 📱 Usage

- Update your portfolio information in the connected Google Sheets
- Customize styling through TailwindCSS and theme.json
- The app automatically fetches and displays data from your Google Sheets
- Clients can view your portfolio and submit contact requests
- You'll receive email notifications for new contact submissions

## 📝 Google Sheet Structure

The app expects your Google Sheets to have the following structure:

### PersonalInfo

- name, title, email, countryCode, phone, location
- experience, tagline, summary
- linkedin, github, medium
- profileImage, resumeLink

### Experience

- title, company, location, type, period
- responsibilities (newline-separated)
- companyLogo, image, icon

### Skills

- category, skills (comma-separated), icon

### Projects

- title, period, description
- highlights (comma-separated)
- technologies (comma-separated)
- role, images (comma-separated URLs), image
- liveUrl, githubUrl

### Education

- degree, institution, description, period
- logo, type

### SocialLinks

- name, link, icon
