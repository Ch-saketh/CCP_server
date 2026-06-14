const express = require("express");
const cors = require("cors");

// Import Routes
const authRoutes = require("./src/auth/routes/auth.routes");
const storeRoutes = require("./src/stores/routes/store.routes");
const creatorProductRoutes = require("./src/products/routes/creatorProduct.routes");
const productRoutes = require("./src/products/routes/product.routes");
const aiRoutes = require("./src/ai/routes/ai.routes");
const analyticsRoutes = require("./src/analytics/routes/analytics.routes");

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

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes); // ADDED: Mount stores routes

app.use(
  "/api/creator-products",
  creatorProductRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);
app.use(
  "/api/analytics",
  analyticsRoutes
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