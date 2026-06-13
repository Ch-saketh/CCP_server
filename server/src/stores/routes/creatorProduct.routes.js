const router = require("express").Router();
const { authenticate } = require("../../auth/middleware/auth.middleware");

const { getMyProducts } = require("../controllers/getMyProducts.controller");
const { getPublicProducts } = require("../controllers/getPublicProducts.controller");
const { deleteProduct } = require("../controllers/deleteProduct.controller");
const { customizeProduct } = require("../controllers/updateProduct.controller"); // 👉 IMPORT ADDED

// GET /api/creator-products/my (Private)
router.get("/my", authenticate, getMyProducts);

// GET /api/creator-products/user/:username (Public)
router.get("/user/:username", getPublicProducts);

// DELETE /api/creator-products/:creatorProductId (Private)
router.delete("/:creatorProductId", authenticate, deleteProduct);

// PUT /api/creator-products/:creatorProductId (Private)  // 👉 NEW ROUTE ADDED
router.put("/:creatorProductId", authenticate, customizeProduct);

module.exports = router;