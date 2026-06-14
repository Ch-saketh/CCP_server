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
  getProducts,
  getProductById,
} = require(
  "../controller/product.controller"
);

router.get(
  "/",
  authenticate,
  requireAdmin,
  getProducts
);

router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getProductById
);

module.exports = router;