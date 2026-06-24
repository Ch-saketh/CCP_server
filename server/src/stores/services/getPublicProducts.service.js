const productRepository = require("../../products/repositories/product.repository");

exports.getCreatorProductsByUsername = async (username) => {
  const user = await productRepository.findUserByUsername(username);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // Fetch only COMPLETED products for the public view
  const products = await productRepository.findCreatorProductsByUserId(user.id, "COMPLETED");
  return { creator: user, products };
};
