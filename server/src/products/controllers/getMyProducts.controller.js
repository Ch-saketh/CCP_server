const getMyProductsService = require("../services/getMyProducts.service");

exports.getMyProducts = async (req, res) => {
  try {
    const creatorId = req.user.id;
    const products = await getMyProductsService.getCreatorProducts(creatorId);
    const mappedProducts = products.map(item => {
      const { id, ...rest } = item;
      return {
        creatorProductId: id,
        ...rest
      };
    });
    return res.status(200).json({
      success: true,
      products: mappedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
