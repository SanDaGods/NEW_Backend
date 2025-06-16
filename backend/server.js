require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");

// Route imports
const routes = require("./routes");
const applicants = require("./routes/applicantRoutes");
const admins = require("./routes/adminRoutes");
const assessors = require("./routes/assessorRoutes");

const app = express();

// ---------- Middleware ----------

// Enable CORS for local dev and Railway frontend
app.use(
  cors({
    origin: [
      "http://localhost:3000",                     // Dev frontend
      "https://your-frontend.up.railway.app"       // Replace with actual frontend domain
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// Serve static files from public (if any)
app.use(express.static(path.join(__dirname, "public")));

// ---------- Connect to MongoDB ----------
connectDB();

// ---------- Test Route ----------
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is running 🚀" });
});

// ---------- Routes ----------
app.use("/", routes, applicants, assessors, admins);

// ---------- Error Handler ----------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
