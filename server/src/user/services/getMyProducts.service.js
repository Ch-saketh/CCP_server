const productRepository = require("../../products/repositories/product.repository");

exports.getCreatorProducts = async (creatorId) => {
  return await productRepository.findCreatorProductsByUserId(creatorId);
};
