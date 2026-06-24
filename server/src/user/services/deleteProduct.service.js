const productRepository = require("../../products/repositories/product.repository");

exports.removeProductFromProfile = async (creatorId, creatorProductId) => {
  const creatorProduct = await productRepository.findCreatorProductById(creatorProductId);

  // 1. Verify existence
  if (!creatorProduct) {
    throw new Error("NOT_FOUND");
  }

  // 2. Verify ownership (prevent creator A from deleting creator B's items)
  if (creatorProduct.creatorId !== creatorId) {
    throw new Error("UNAUTHORIZED");
  }

  // 3. Delete from database (soft-delete deactivation)
  return await productRepository.deleteCreatorProduct(creatorProductId);
};
