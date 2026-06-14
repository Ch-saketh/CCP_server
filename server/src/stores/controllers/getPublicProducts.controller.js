const getPublicProductsService = require("../services/getPublicProducts.service");

exports.getPublicProducts = async (req, res) => {
  try {
    const { username } = req.params;
    const result = await getPublicProductsService.getCreatorProductsByUsername(username);
    const mappedProducts = result.products.map(item => {
      const { id, ...rest } = item;
      return {
        creatorProductId: id,
        ...rest
      };
    });
    return res.status(200).json({
      success: true,
      creator: result.creator,
      products: mappedProducts,
    });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
