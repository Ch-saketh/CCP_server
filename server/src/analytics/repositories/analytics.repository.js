const prisma =
  require("../../auth/config/db");

class AnalyticsRepository {

  async getDashboardMetrics(
    creatorId
  ) {

    const storeViews =
      await prisma.storefrontAnalytics.aggregate({
        where: {
          creatorId,
        },
        _sum: {
          views: true,
          uniqueVisitors: true,
        },
      });

    const productsCount =
      await prisma.creatorProduct.count({
        where: {
          creatorId,
        },
      });

    const collectionsCount =
      await prisma.collection.count({
        where: {
          creatorId,
        },
      });

    return {
      storeViews,
      productsCount,
      collectionsCount,
    };
  }

  async getProductAnalytics(
    productId
  ) {
    return prisma.productAnalytics.findMany({
      where: {
        productId,
      },
      orderBy: {
        date: "asc",
      },
    });
  }

  async getCollectionAnalytics(
    collectionId
  ) {
    return prisma.collectionAnalytics.findMany({
      where: {
        collectionId,
      },
      orderBy: {
        date: "asc",
      },
    });
  }
}

module.exports =
  new AnalyticsRepository();