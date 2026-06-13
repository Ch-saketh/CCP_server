const router = require("express").Router();
const { authenticate } = require("../../auth/middleware/auth.middleware");

// Individual Controller imports (Option B)
const { getMyProducts } = require("../controllers/getMyProducts.controller");
const { getPublicProducts } = require("../controllers/getPublicProducts.controller");
const { deleteProduct } = require("../controllers/deleteProduct.controller");

// GET /api/creator-products/my (Private)
router.get("/my", authenticate, getMyProducts);

// GET /api/creator-products/user/:username (Public)
router.get("/user/:username", getPublicProducts);

// DELETE /api/creator-products/:creatorProductId (Private)
router.delete("/:creatorProductId", authenticate, deleteProduct);

module.exports = router;
