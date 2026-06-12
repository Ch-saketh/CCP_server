const deleteProductService = require("../services/deleteProduct.service");

exports.deleteProduct = async (req, res) => {
  try {
    const creatorProductId = req.params.creatorProductId;
    const creatorId = req.user.id; // Injected by authenticate middleware

    await deleteProductService.removeProductFromProfile(creatorId, creatorProductId);

    return res.status(200).json({
      success: true,
      message: "Product removed from your profile successfully",
    });
  } catch (error) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Product recommendation not found",
      });
    }
    if (error.message === "UNAUTHORIZED") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to remove this product",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
