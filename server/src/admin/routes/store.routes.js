const router =
  require("express").Router();

const {
  authenticate,
} = require(
  "../../auth/middleware/auth.middleware"
);

const {
  requireAdmin,
} = require(
  "../middleware/requireAdmin"
);

const {
  getStores,
  getStoreById,
} = require(
  "../controller/store.controller"
);

router.get(
  "/",
  authenticate,
  requireAdmin,
  getStores
);

router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getStoreById
);

module.exports = router;