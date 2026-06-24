const productRepository = require("../repositories/product.repository");

exports.updateCustomDetails = async (creatorId, creatorProductId, data) => {
  // 1. Find the product
  const creatorProduct = await productRepository.findCreatorProductById(creatorProductId);

  // 2. Verify it exists and belongs to this user
  if (!creatorProduct) {
    throw new Error("NOT_FOUND");
  }
  if (creatorProduct.creatorId !== creatorId) {
    throw new Error("UNAUTHORIZED");
  }

  // 3. Update the fields
  return await productRepository.updateCreatorProduct(creatorProductId, {
    customUrl: data.customUrl,
    promoCode: data.promoCode,
    customTitle: data.customTitle,
    customDescription: data.customDescription
  });
};