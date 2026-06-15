const productRepository =
  require("../repositories/product.repository");

exports.getRedirectData =
  async (productId) => {

    const product =
      await productRepository
        .findProductForRedirect(
          productId
        );

    if (
      !product ||
      !product.productLinks.length
    ) {
      throw new Error(
        "PRODUCT_NOT_FOUND"
      );
    }

    const redirectUrl =
      product.productLinks[0]
        .affiliateUrl ||
      product.productLinks[0]
        .originalUrl;

    return {
      product,
      redirectUrl,
    };
  };