const productRepository = require("../repositories/product.repository");

exports.getCreatorProductsByUsername = async (username) => {
  const user = await productRepository.findUserByUsername(username);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const products = await productRepository.findCreatorProductsByUserId(user.id);
  return { creator: user, products };
};
