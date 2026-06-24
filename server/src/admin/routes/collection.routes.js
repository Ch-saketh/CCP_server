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
  getCollections,
  updateCollectionVisibility,
  getCollectionById,
} = require("../controller/collection.controller");



router.get(
  "/",
  authenticate,
  requireAdmin,
  getCollections
);



router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getCollectionById
);

module.exports = router;