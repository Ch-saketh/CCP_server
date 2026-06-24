const getProductsService = require("../services/getProducts.service");

exports.getProducts = async (req, res) => {
  try {
    const { search, category, subcategory, brand, page, limit } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;

    const { products, total } = await getProductsService.listProducts({
      search,
      category,
      subcategory,
      brand,
      page: parsedPage,
      limit: parsedLimit,
    });

    const totalPages = Math.ceil(total / parsedLimit);

    return res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
