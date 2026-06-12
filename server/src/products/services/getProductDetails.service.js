const productRepository = require("../repositories/product.repository");

exports.retrieveProductDetails = async (slug) => {
  const product = await productRepository.findProductBySlugDetails(slug);
  if (!product) {
    throw new Error("NOT_FOUND");
  }
  return product;
};
