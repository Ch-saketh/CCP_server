const createAndLinkService = require("../services/createAndLinkProduct.service");

exports.createAndLinkProduct = async (req, res) => {
  try {
    const { productData, creatorData } = req.body;
    const creatorId = req.user.id;

    if (!productData || !productData.title || !productData.price) {
      return res.status(400).json({
        success: false,
        message: "Missing required product details (title and price are mandatory)",
      });
    }

    const result = await createAndLinkService.addAndLinkProduct(creatorId, productData, creatorData);
    const { id, ...rest } = result;
    
    return res.status(201).json({
      success: true,
      message: "Product successfully cataloged and linked to your profile",
      data: {
        creatorProductId: id,
        ...rest
      },
    });
  } catch (error) {
    if (error.message === "ALREADY_LINKED") {
      return res.status(400).json({
        success: false,
        message: "You have already added this product to your profile.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
