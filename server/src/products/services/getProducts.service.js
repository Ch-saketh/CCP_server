const productRepository = require("../repositories/product.repository");

exports.listProducts = async (filters) => {
  return await productRepository.findProducts(filters);
};
