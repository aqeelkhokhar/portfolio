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
   GOOGLE_CLIENT_ID=your_google_client_id
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

   - From the downloaded JSON file, note the `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY`
   - These values will be used in your `.env` file

6. **Create and Share Google Sheet**:
   - Create a new Google Sheet with the tabs listed in the setup instructions
   - Get the Sheet ID from the URL (the long string between /d/ and /edit in the URL)
   - Share the sheet with the service account email (GOOGLE_SERVICE_ACCOUNT_EMAIL) with Editor permissions

### Gmail Setup for Nodemailer

1. **Generate App Password**:

   - Go to your [Google Account](https://myaccount.google.com/)
   - Select "Security" from the sidebar
   - Under "Signing in to Google," select "2-Step Verification" (enable if not already)
   - Search and select "App passwords"
   - Copy the 16-character password that appears

2. **Configure Environment Variables**:
   - Add your Gmail address as `EMAIL_USER`
   - Add the generated app password as `EMAIL_PASSWORD`

## 🌐 Google Cloud Client Creation for Google Calendar

1. **Go to Google Cloud Console**:

   - Visit [Google Cloud Console](https://console.cloud.google.com/).

2. **Select or Create a Project**:

   - Choose an existing project.

3. **Enable Google Calendar API**:

   - Navigate to "APIs & Services" > "Library".
   - Search for "Google Calendar API" and enable it.

4. **Open Google Calendar**:

   - Go to [Google Calendar](https://calendar.google.com/).

5. **Select Your Calendar**:

   - In the left sidebar, find your personal calendar under "My calendars".
   - Hover over the calendar name, click on the three dots (More options), and select "Settings and sharing".

6. **Share with Specific People**:

   - Scroll down to the "Share with" section.
   - Click on "Add people and Groups".
   - Enter the email address of the service you have created in the google console.
   - Choose the permissions you want to grant (e.g., "See all event details", "Make changes to events", or "Make changes and manage sharing").
   - Click "Send".

7. **Save Changes**:

   - Ensure all changes are saved before exiting the settings.

## 🌐 Setting Up OAuth Consent Screen and Creating Client

1. **Go to Google Cloud Console**:

   - Visit [Google Cloud Console](https://console.cloud.google.com/).

2. **Select Your Project**:

   - Choose the project you created for your application.

3. **Navigate to OAuth Consent Screen**:

   - In the left sidebar, click on "APIs & Services" > "OAuth consent screen".

4. **Configure the Consent Screen**:

   - Click on "Get Started" if it's your first configuration.
   - Fill in the required fields such as App name, User support email, and Developer contact information.
   - Choose the User Type "External" and click "Create".
   - Click "Save and Continue" to proceed through the scopes section.

5. **Configure the OAuth Client**:

   - Choose the application type (e.g., Web application).
   - Fill in the required fields:
     - **Name**: Give your client a name.
   - Click "Create".

6. **Add Test Users**:

   - In the left sidebar, under the "Audience" section, scroll down to the "Test users" area.
   - Click on "Add users".
   - Enter the email addresses of the users you want to add as test users (including your own).
   - Click "Save".

7. **Configure site URL**:

   - Click on "Client" from left menu.
   - Find your client and click on it.
   - **Authorized redirect URIs**: Add the URI where your application will handle responses from Google (e.g., `http://localhost:3000/auth/google/callback`).
   - **Authorized JavaScript origins**: Add the origin of your application (e.g., `http://localhost:3000`).

8. **Download the Client Credentials**:

   - After creating the client, you will see a dialog with your client ID and client secret. You can also download the credentials as a JSON file for use in your application.

9. **Use the Client in Your Application**:
   - Use the downloaded client credentials to authenticate requests to the Google Calendar API from the "JSON" into your ".env".

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
