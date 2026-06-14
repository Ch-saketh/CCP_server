const productRepository = require("../../products/repositories/product.repository");

exports.updateCustomDetails = async (creatorId, creatorProductId, data) => {
  // 1. Find the product recommendation
  const creatorProduct = await productRepository.findCreatorProductById(creatorProductId);

  // 2. Security Check: Does this exist, and does it belong to the logged-in user?
  if (!creatorProduct) {
    throw new Error("NOT_FOUND");
  }
  if (creatorProduct.creatorId !== creatorId) {
    throw new Error("UNAUTHORIZED");
  }

  // 3. Update with the new custom details
  return await productRepository.updateCreatorProduct(creatorProductId, {
    customUrl: data.customUrl,
    promoCode: data.promoCode,
    customTitle: data.customTitle,
    customDescription: data.customDescription
  });
};
