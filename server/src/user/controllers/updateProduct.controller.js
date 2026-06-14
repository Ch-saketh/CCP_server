const updateProductService = require("../services/updateProduct.service");

exports.customizeProduct = async (req, res) => {
  try {
    const creatorId = req.user.id; // From your auth middleware
    const { creatorProductId } = req.params;
    const { customUrl, promoCode, customTitle, customDescription } = req.body;

    const updatedProduct = await updateProductService.updateCustomDetails(
      creatorId, 
      creatorProductId, 
      { customUrl, promoCode, customTitle, customDescription }
    );

    return res.status(200).json({
      success: true,
      message: "Store product customized successfully!",
      data: updatedProduct
    });

  } catch (error) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Product not found in your store." });
    }
    if (error.message === "UNAUTHORIZED") {
      return res.status(403).json({ success: false, message: "You don't have permission to edit this." });
    }
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
