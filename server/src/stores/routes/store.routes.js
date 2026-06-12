const router = require("express").Router();
const {
  createStoreOnboarding,
  getMyStore,
  updateStore,
  getStoreBySlug,
} = require("../controllers/store.controller");

const { authenticate } = require("../../auth/middleware/auth.middleware");

router.post("/onboarding", authenticate, createStoreOnboarding);
router.get("/me", authenticate, getMyStore);
router.put("/", authenticate, updateStore);
router.get("/:slug", getStoreBySlug);

module.exports = router;