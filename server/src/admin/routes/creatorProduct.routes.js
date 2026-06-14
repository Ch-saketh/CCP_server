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
  getCreatorProducts,
  getCreatorProductById,
} = require(
  "../controller/creatorProduct.controller"
);

router.get(
  "/",
  authenticate,
  requireAdmin,
  getCreatorProducts
);

router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getCreatorProductById
);

module.exports = router;