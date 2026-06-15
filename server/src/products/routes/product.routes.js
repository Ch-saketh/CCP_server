const router = require("express").Router();

const {
  redirectProduct,
} = require(
  "../controllers/redirectProduct.controller"
);

const { getProducts } = require("../controllers/getProducts.controller");
const { getProductDetails } = require("../controllers/getProductDetails.controller");

// GET /api/products (Public Search / List Catalog)
router.get("/", getProducts);


router.get(
  "/:productId/redirect",
  redirectProduct
);

// GET /api/products/:slug (Public Product Details)
router.get("/:slug", getProductDetails);

module.exports = router;
