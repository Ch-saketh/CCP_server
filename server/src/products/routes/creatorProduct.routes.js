const router = require("express").Router();
const { authenticate } = require("../../auth/middleware/auth.middleware");

// Individual Controller imports (Option B)
const { createAndLinkProduct } = require("../controllers/createAndLinkProduct.controller");
const { getMyProducts } = require("../controllers/getMyProducts.controller");
const { getPublicProducts } = require("../controllers/getPublicProducts.controller");
const { deleteProduct } = require("../controllers/deleteProduct.controller");

// POST /api/creator-products/create-and-link (Private)
router.post("/create-and-link", authenticate, createAndLinkProduct);

// GET /api/creator-products/my (Private)
router.get("/my", authenticate, getMyProducts);

// GET /api/creator-products/user/:username (Public)
router.get("/user/:username", getPublicProducts);

// DELETE /api/creator-products/:creatorProductId (Private)
router.delete("/:creatorProductId", authenticate, deleteProduct);

module.exports = router;
