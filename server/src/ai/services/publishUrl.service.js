const axios = require("axios");
const aiRepository = require("../repositories/ai.repository");
const productRepository = require("../../products/repositories/product.repository");
const { slugify } = require("../../utils/slug");

exports.triggerAiExtraction = async (submissionId, url) => {
  try {
    // 1. Fetch submission to get creatorId
    const submission = await aiRepository.getSubmissionById(submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }
    const creatorId = submission.creatorId;

    // 2. Mark as PROCESSING
    await aiRepository.updateSubmissionStatus(submissionId, "PROCESSING");

    // 3. Send to AI Team
    const AI_PARSER_API_URL = process.env.AI_PARSER_URL;
    if (!AI_PARSER_API_URL) {
      throw new Error("AI_PARSER_URL environment variable is not configured");
    }

    const response = await axios.post(AI_PARSER_API_URL, { productUrl: url });
    
    // 4. AI Successfully parsed! Now find/create product and link it to the creator.
    // The response.data should have: title, price, brand, category, subcategory, primaryImageUrl, sourcePlatform, sourceProductId
    const productData = response.data;
    const { title, sourcePlatform, sourceProductId } = productData;

    let slug = slugify(title);

    // Check if product exists in global catalog
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

    // Check if creator already recommended it
    let creatorProduct = await productRepository.findCreatorProduct(creatorId, product.id);

    if (creatorProduct) {
      throw new Error("ALREADY_LINKED");
    }

    // Automaticaly create recommendation link
    creatorProduct = await productRepository.createCreatorProduct({
      creatorId,
      productId: product.id,
      creatorNote: null,
      customTitle: null,
      customDescription: null,
      status: "COMPLETED"
    });

    // Map creatorProduct to include creatorProductId instead of id
    const { id, ...rest } = creatorProduct;
    const mappedRecommendation = {
      creatorProductId: id,
      ...rest
    };

    // 5. Mark as COMPLETED and save the final recommendation data
    await aiRepository.updateSubmissionStatus(submissionId, "COMPLETED", {
      aiExtractedData: mappedRecommendation
    });

    return "SUCCESS";

  } catch (error) {
    console.error(`AI Extraction failed for submission ${submissionId}:`, error.message);
    // Mark as FAILED
    await aiRepository.updateSubmissionStatus(submissionId, "FAILED", {
      errorMessage: error.message
    });
    return "FAILED";
  }
};
