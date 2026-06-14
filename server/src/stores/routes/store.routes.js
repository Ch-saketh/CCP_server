const router = require("express").Router();
const {
  createStoreOnboarding,
  getMyStore,
  updateStore,
  getStoreBySlug,
} = require("../controllers/store.controller");
const { getPublicProducts } = require("../controllers/getPublicProducts.controller");

const { authenticate } = require("../../auth/middleware/auth.middleware");

router.post("/onboarding", authenticate, createStoreOnboarding);
router.get("/me", authenticate, getMyStore);
router.put("/", authenticate, updateStore);
router.get("/user/:username", getPublicProducts);
router.get("/:slug", getStoreBySlug);

module.exports = router;