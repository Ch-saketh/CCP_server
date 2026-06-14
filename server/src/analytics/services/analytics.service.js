const analyticsRepository =
  require("../repositories/analytics.repository");

const {
  calculateCTR,
} = require("../utils/analytics.utils");

class AnalyticsService {

  async getDashboard(
    creatorId
  ) {

    const data =
      await analyticsRepository
        .getDashboardMetrics(
          creatorId
        );

    return {
      totalViews:
        data.storeViews._sum.views || 0,

      uniqueVisitors:
        data.storeViews._sum.uniqueVisitors || 0,

      productsCount:
        data.productsCount,

      collectionsCount:
        data.collectionsCount,
    };
  }

  async getProductReport(
    productId
  ) {

    const analytics =
      await analyticsRepository
        .getProductAnalytics(
          productId
        );

    const totalViews =
      analytics.reduce(
        (sum, item) =>
          sum + item.views,
        0
      );

    const totalClicks =
      analytics.reduce(
        (sum, item) =>
          sum + item.clicks,
        0
      );

    return {
      totalViews,
      totalClicks,
      ctr:
        calculateCTR(
          totalViews,
          totalClicks
        ),
      analytics,
    };
  }

  async getCollectionReport(
    collectionId
  ) {

    const analytics =
      await analyticsRepository
        .getCollectionAnalytics(
          collectionId
        );

    const totalViews =
      analytics.reduce(
        (sum, item) =>
          sum + item.views,
        0
      );

    const totalClicks =
      analytics.reduce(
        (sum, item) =>
          sum + item.clicks,
        0
      );

    return {
      totalViews,
      totalClicks,
      ctr:
        calculateCTR(
          totalViews,
          totalClicks
        ),
      analytics,
    };
  }

}

module.exports =
  new AnalyticsService();