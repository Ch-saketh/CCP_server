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

  const productClicks =
    await prisma.productAnalytics.aggregate({
      where: {
        creatorId,
      },
      _sum: {
        clicks: true,
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

  const topProduct =
    await prisma.productAnalytics.findFirst({
      where: {
        creatorId,
      },
      orderBy: {
        views: "desc",
      },
    });

  return {
    storeViews,
    productClicks,
    productsCount,
    collectionsCount,
    topProduct,
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
 async getTopProduct(
  creatorId
) {

  return prisma.productAnalytics.findFirst({
    where: {
      creatorId,
    },
    orderBy: {
      views: "desc",
    },
  });

}

async getTopCreators() {

  return prisma.storefrontAnalytics.findMany({
    orderBy: {
      views: "desc",
    },
    take: 10,
  });

}

async getProductById(productId) {

  const product =
    await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        title: true,
        category: true,
        primaryImageUrl: true,
      },
    });

  if (!product) {
    return null;
  }

  return {
    id: product.id,

    title: product.title,

    category: product.category,

    image:
      product.primaryImageUrl,

    clickUrl:
      `/api/products/${product.id}/redirect`,
  };

}

async getTopProducts() {

  return prisma.productAnalytics.findMany({
    orderBy: {
      views: "desc",
    },
    take: 10,
  });

}


async getUserById(
  userId
) {

  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      username: true,
      profileImage: true,
    },
  });

}

async creatorOwnsProduct(
  creatorId,
  productId
) {

  return prisma.creatorProduct.findFirst({
    where: {
      creatorId,
      productId,
      status: "COMPLETED",
    },
  });

}

async creatorOwnsCollection(
  creatorId,
  collectionId
) {

  return prisma.collection.findFirst({
    where: {
      id: collectionId,
      creatorId,
    },
  });

}
}

module.exports =
  new AnalyticsRepository();