const productRepository = require("../repositories/product.repository");
const { slugify } = require("../../utils/slug");

exports.addAndLinkProduct = async (creatorId, productData, creatorData) => {
  const { title, sourcePlatform, sourceProductId } = productData;
  const { creatorNote, customTitle, customDescription } = creatorData || {};

  let slug = slugify(title);

  let product = await productRepository.findProductBySlugOrSource(slug, sourcePlatform, sourceProductId);

  if (!product) {
    const slugCount = await productRepository.countProductsBySlug(slug);
    if (slugCount > 0) {
      slug = `${slug}-${Date.now()}`;
    }
    product = await productRepository.createProductWithLink({
      ...productData,
      slug
    });
  }

  const alreadyLinked = await productRepository.findCreatorProduct(creatorId, product.id);
  if (alreadyLinked) {
    throw new Error("ALREADY_LINKED");
  }

  return await productRepository.createCreatorProduct({
    creatorId,
    productId: product.id,
    creatorNote,
    customTitle,
    customDescription,
    status: "COMPLETED"
  });
};
