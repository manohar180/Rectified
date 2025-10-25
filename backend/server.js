import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ----- dirname setup for ES modules -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----- middleware -----
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// ----- health check -----
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ----- API routes -----
app.use("/api/users", userRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/businesses/:id/comments", commentRoutes);
app.use("/api/businesses/:id/ratings", ratingRoutes);

// ----- serve frontend -----
const clientDistPath = path.join(__dirname, "..", "frontend", "dist"); // vite build folder
app.use(express.static(clientDistPath));

// Express 5 fix: use (req, res, next) with regex safely
app.use((req, res, next) => {
  // ignore API calls; let them 404 naturally
  if (req.originalUrl.startsWith("/api")) return next();

  // fallback: always send index.html for non-API routes
  res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
    if (err) next(err);
  });
});

// ----- start server -----
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
