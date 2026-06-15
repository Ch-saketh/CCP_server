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

  const totalViews =
    data.storeViews._sum.views || 0;

  const uniqueVisitors =
    data.storeViews._sum.uniqueVisitors || 0;

  const totalProductClicks =
    data.productClicks._sum.clicks || 0;

  let topProduct = null;

  if (data.topProduct) {

    const product =
      await analyticsRepository
        .getProductById(
          data.topProduct.productId
        );

    if (product) {

      topProduct = {

        id:
          product.id,

        title:
          product.title,

        image:
          product.image,

        views:
          data.topProduct.views,

        clickUrl:
          product.clickUrl,

      };

    }

  }

  return {

    totalViews,

    uniqueVisitors,

    totalProductClicks,

    ctr:
      calculateCTR(
        totalViews,
        totalProductClicks
      ),

    productsCount:
      data.productsCount,

    collectionsCount:
      data.collectionsCount,

    topProduct,

  };

}
  async getProductReport(
  creatorId,
  productId
) {

  const ownsProduct =
  await analyticsRepository
    .creatorOwnsProduct(
      creatorId,
      productId
    );

if (!ownsProduct) {
  throw new Error(
    "UNAUTHORIZED_PRODUCT"
  );
}

    const product =
  await analyticsRepository
    .getProductById(
      productId
    );

    if (!product) {
  throw new Error(
    "PRODUCT_NOT_FOUND"
  );
}

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
  product: {
  id: product.id,
  title: product.title,
  image: product.image,
  category: product.category,
  clickUrl: product.clickUrl,
},

  metrics: {
    views: totalViews,
    clicks: totalClicks,
    ctr: calculateCTR(
      totalViews,
      totalClicks
    ),
  },
};
  }

  async getCollectionReport(
  creatorId,
  collectionId
) {

  const ownsCollection =
    await analyticsRepository
      .creatorOwnsCollection(
        creatorId,
        collectionId
      );

  if (!ownsCollection) {
    throw new Error(
      "UNAUTHORIZED_COLLECTION"
    );
  }

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

    collection: {
      id:
        collectionId,
    },

    metrics: {

      views:
        totalViews,

      clicks:
        totalClicks,

      ctr:
        calculateCTR(
          totalViews,
          totalClicks
        ),

    },

  };
}
  

  async getTopProducts() {

  const analytics =
    await analyticsRepository
      .getTopProducts();

  const leaderboard =
    await Promise.all(

      analytics.map(
        async (
          item,
          index
        ) => {

          const product =
            await analyticsRepository
              .getProductById(
                item.productId
              );

          

          return {

        rank:
          index + 1,

        id:
          product?.id,

        title:
          product?.title,

        image:
          product?.image,

        category:
          product?.category,

        views:
          item.views,

        clicks:
          item.clicks,

        ctr:
          calculateCTR(
            item.views,
            item.clicks
          ),

        clickUrl:
          product?.clickUrl,

      };
        }
      )
    );

  return leaderboard;

}

async getTopCreators() {

  const creators =
    await analyticsRepository
      .getTopCreators();

  const leaderboard =
    await Promise.all(

      creators.map(
        async (
          creator,
          index
        ) => {

          const user =
            await analyticsRepository
              .getUserById(
                creator.creatorId
              );

              if (!user) {
                return null;
              }

          return {

            rank:
              index + 1,


            name:
              `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),

            username:
              user?.username,

            profileImage:
              user?.profileImage,

            views:
              creator.views,

            uniqueVisitors:
              creator.uniqueVisitors,

          };

        }
      )
    );

return leaderboard.filter(Boolean);

}

}

module.exports =
  new AnalyticsService();