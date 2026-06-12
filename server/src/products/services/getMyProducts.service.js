const productRepository = require("../repositories/product.repository");

exports.getCreatorProducts = async (creatorId) => {
  return await productRepository.findCreatorProductsByUserId(creatorId);
};
