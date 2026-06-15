const analyticsService =
require("../services/analytics.service");

const trackingService =
require("../services/tracking.service");

class AnalyticsController {

  async getDashboard(
    req,
    res
  ) {

    try {

      const data =
        await analyticsService
        .getDashboard(
          req.user.id
        );

      return res.json({
        success: true,
        data,
      });

    } catch (error) {

      console.log(error);

      return res.status(500)
      .json({
        message:
        "Server Error",
        error: error.message,
      });
    }
  }

  async getProductAnalytics(
    req,
    res
  ) {

    try {

      const data =
  await analyticsService
    .getProductReport(
      req.user.id,
      req.params.productId
    );

      return res.json({
        success: true,
        data,
      });

    } catch (error) {

  if (
    error.message ===
    "UNAUTHORIZED_PRODUCT"
  ) {

    return res.status(403)
      .json({
        success: false,
        message:
          "Access denied",
      });

  }

  if (
    error.message ===
    "PRODUCT_NOT_FOUND"
  ) {

    return res.status(404)
      .json({
        success: false,
        message:
          "Product not found",
      });

  }

  console.log(error);

  return res.status(500)
    .json({
      message:
        "Server Error",
      error:
        error.message,
    });

  }
}
  async getCollectionAnalytics(
    req,
    res
  ) {

    try {

      const data =
  await analyticsService
    .getCollectionReport(
      req.user.id,
      req.params.collectionId
    );

      return res.json({
        success: true,
        data,
      });

    } catch (error) {

  if (
    error.message ===
    "UNAUTHORIZED_COLLECTION"
  ) {

    return res.status(403)
      .json({
        success: false,
        message:
          "Access denied",
      });

  }

  if (
    error.message ===
    "COLLECTION_NOT_FOUND"
  ) {

    return res.status(404)
      .json({
        success: false,
        message:
          "Collection not found",
      });

  }

  console.log(error);

  return res.status(500)
    .json({
      message:
        "Server Error",
      error:
        error.message,
    });

}
  }
  
  async getTopProducts(
  req,
  res
) {

  try {

    const data =
      await analyticsService
      .getTopProducts();

    return res.json({
      success: true,
      data,
    });

  } catch (error) {

    console.log(error);

    return res.status(500)
      .json({
        message:
          "Server Error",
          error: error.message,
      });

  }
}

async getTopCreators(
  req,
  res
) {

  try {

    const data =
      await analyticsService
      .getTopCreators();

    return res.json({
      success: true,
      data,
    });

  } catch (error) {

    console.log(error);

    return res.status(500)
      .json({
        message:
          "Server Error",
          error: error.message,
      });

  }
}

async trackProductClick(
  req,
  res
) {

  try {

    const { productId } =
      req.params;

    const visitorId =
      req.headers["x-visitor-id"] ||
      req.ip;

    await trackingService
      .trackProductClick({
        creatorId:
          req.user.id,
        productId,
        visitorId,
      });

    return res.json({
      success: true,
      message:
        "Product click tracked",
    });

  } catch (error) {

    return res.status(500)
      .json({
        message:
          "Server Error",
        error:
          error.message,
      });

  }

}

async trackCollectionView(
  req,
  res
) {

  try {

    const { collectionId } =
      req.params;

    const visitorId =
      req.headers["x-visitor-id"] ||
      req.ip;

    await trackingService
      .trackCollectionView({
        creatorId:
          req.user.id,
        collectionId,
        visitorId,
      });

    return res.json({
      success: true,
      message:
        "Collection view tracked",
    });

  } catch (error) {

    return res.status(500)
      .json({
        message:
          "Server Error",
        error:
          error.message,
      });

  }

}
async trackCollectionClick(
  
  req,
  res
) {

  try {

    const { collectionId } =
      req.params;

    const visitorId =
      req.headers["x-visitor-id"] ||
      req.ip;

    await trackingService
      .trackCollectionClick({
        creatorId:
          req.user.id,
        collectionId,
        visitorId,
      });

    return res.json({
      success: true,
      message:
        "Collection click tracked",
    });

  } catch (error) {

    return res.status(500)
      .json({
        message:
          "Server Error",
          error: error.message,
      });

  }
}

}

module.exports =
new AnalyticsController();