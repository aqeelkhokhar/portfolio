// Simple development server to run API endpoints locally
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Loop through all files in api-routes and register them
const API_DIR = path.join(__dirname, "api-routes");

// Helper function to register API routes
const registerRoutes = (directory, basePath = "") => {
  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(directory, file.name);

    if (file.isDirectory()) {
      // Recursively register routes in subdirectories
      registerRoutes(fullPath, `${basePath}/${file.name}`);
    } else if (file.name.endsWith(".js")) {
      try {
        // Compute the route path
        const routeName = file.name.replace(".js", "");
        let routePath = basePath ? `${basePath}/${routeName}` : `/${routeName}`;

        // Special case for /api prefix
        if (routePath.startsWith("/api-routes")) {
          routePath = routePath.replace("/api-routes", "");
        }

        // Create API version of the route for proper proxying
        let apiRoutePath = `/api${routePath}`;

        // Special handling for auth routes to make them available at both /api/auth and /auth
        if (routePath.startsWith("/auth")) {
          // Register the auth route without /api prefix
          app.all(routePath, async (req, res) => {
            try {
              const moduleUrl = `file://${fullPath}`;
              const module = await import(moduleUrl);
              await module.default(req, res);
            } catch (error) {
              res.status(500).json({
                error: "Internal Server Error",
                message: error.message,
              });
            }
          });
        }

        // Register the route with API prefix
        // For each endpoint, we'll create a handler that dynamically imports and calls the module
        app.all(apiRoutePath, async (req, res) => {
          try {
            // Import the handler module
            const moduleUrl = `file://${fullPath}`;
            const module = await import(moduleUrl);

            // Call the handler
            await module.default(req, res);
          } catch (error) {
            res
              .status(500)
              .json({ error: "Internal Server Error", message: error.message });
          }
        });
      } catch {}
    }
  }
};

// Start registering routes
registerRoutes(API_DIR);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {});
