const prisma = require("../../auth/config/db");

class TrackingService {

  async trackStoreView({
    creatorId,
    storeId
  }) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.$transaction([

      prisma.analyticsEvent.create({
        data: {
          eventType: "STORE_VIEW",
          creatorId,
          storeId,
        },
      }),

      prisma.storefrontAnalytics.upsert({
        where: {
          creatorId_date: {
            creatorId,
            date: today,
          },
        },
        update: {
          views: {
            increment: 1,
          },
        },
        create: {
          creatorId,
          date: today,
          views: 1,
          uniqueVisitors: 1,
        },
      }),

    ]);

  }

  async trackProductView({
    creatorId,
    productId,
  }) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.$transaction([

      prisma.analyticsEvent.create({
        data: {
          eventType: "PRODUCT_VIEW",
          creatorId,
          productId,
        },
      }),

      prisma.productAnalytics.upsert({
        where: {
          productId_date: {
            productId,
            date: today,
          },
        },
        update: {
          views: {
            increment: 1,
          },
        },
        create: {
          creatorId,
          productId,
          date: today,
          views: 1,
          clicks: 0,
        },
      }),

    ]);

  }

  async trackProductClick({
    creatorId,
    productId,
  }) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.$transaction([

      prisma.analyticsEvent.create({
        data: {
          eventType: "PRODUCT_CLICK",
          creatorId,
          productId,
        },
      }),

      prisma.productAnalytics.upsert({
        where: {
          productId_date: {
            productId,
            date: today,
          },
        },
        update: {
          clicks: {
            increment: 1,
          },
        },
        create: {
          creatorId,
          productId,
          date: today,
          views: 0,
          clicks: 1,
        },
      }),

    ]);

  }

}

module.exports = new TrackingService();