const express = require("express");

const cors = require("cors");

const authRoutes =
  require("./src/auth/routes/auth.routes");

const app = express();

app.use(cors());

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check route
app.get("/health", (req, res) => {
  console.log("Health check hit");
  res.json({ status: "ok" });
});

app.use(
  "/api/auth",
  authRoutes
);

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    message: "Server Error",
    error: error.message,
  });
});

module.exports = app;