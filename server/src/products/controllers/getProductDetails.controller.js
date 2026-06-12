const getProductDetailsService = require("../services/getProductDetails.service");

exports.getProductDetails = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Product slug parameter is missing",
      });
    }

    const product = await getProductDetailsService.retrieveProductDetails(slug);

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Product not found in global catalog",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
