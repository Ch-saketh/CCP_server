const router = require("express").Router();
const { authenticate } = require("../../auth/middleware/auth.middleware");

// Individual Controller imports
const { getMyProducts } = require("../controllers/getMyProducts.controller");
const { deleteProduct } = require("../controllers/deleteProduct.controller");
const { customizeProduct } = require("../controllers/updateProduct.controller");

// GET /api/creator-products/my (Private)
router.get("/my", authenticate, getMyProducts);

// DELETE /api/creator-products/:creatorProductId (Private)
router.delete("/:creatorProductId", authenticate, deleteProduct);

// PUT /api/creator-products/:creatorProductId (Private)
router.put("/:creatorProductId", authenticate, customizeProduct);

module.exports = router;
