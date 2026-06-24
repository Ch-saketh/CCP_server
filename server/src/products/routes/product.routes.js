const router = require("express").Router();

const { getProducts } = require("../controllers/getProducts.controller");
const { getProductDetails } = require("../controllers/getProductDetails.controller");

// GET /api/products (Public Search / List Catalog)
router.get("/", getProducts);

// GET /api/products/:slug (Public Product Details)
router.get("/:slug", getProductDetails);

module.exports = router;
