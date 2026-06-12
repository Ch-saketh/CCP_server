const router = require("express").Router();
const {
  createStoreOnboarding,
  getMyStore,
  updateStore,
  getStoreBySlug,
} = require("../controllers/stores.controller");

// IMPORTANT: Adjust this path to point to where your auth.middleware.js is located
const { authenticate } = require("../../auth/middleware/auth.middleware"); 

// PROTECTED ROUTES (Creator only)
router.post("/onboarding", authenticate, createStoreOnboarding);
router.get("/me", authenticate, getMyStore);
router.put("/", authenticate, updateStore);

// PUBLIC ROUTES (Visitors)
// Note: This goes at the bottom so it doesn't conflict with "me"
router.get("/:slug", getStoreBySlug);

module.exports = router;