const prisma = require("../../auth/config/db");

class TrackingService {

  async trackStoreView({
    creatorId,
    storeId,
    visitorId,
  }) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtySecondsAgo =
      new Date(Date.now() - 30 * 1000);

    const existingView =
      await prisma.analyticsEvent.findFirst({
        where: {
          eventType: "STORE_VIEW",
          creatorId,
          visitorId,
          createdAt: {
            gte: thirtySecondsAgo,
          },
        },
      });

    if (existingView) {
      return;
    }

    const existingVisitor =
      await prisma.analyticsEvent.findFirst({
        where: {
          eventType: "STORE_VIEW",
          creatorId,
          visitorId,
          createdAt: {
            gte: today,
          },
        },
      });

    const isUniqueVisitor =
      !existingVisitor;

    await prisma.$transaction([

      prisma.analyticsEvent.create({
        data: {
          eventType: "STORE_VIEW",
          creatorId,
          storeId,
          visitorId,
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

          ...(isUniqueVisitor && {
            uniqueVisitors: {
              increment: 1,
            },
          }),
        },

        create: {
          creatorId,
          date: today,
          views: 1,
          uniqueVisitors:
            isUniqueVisitor ? 1 : 0,
        },
      }),

    ]);

  }

  async trackProductView({
    creatorId,
    productId,
    visitorId,
  }) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtySecondsAgo =
      new Date(Date.now() - 30 * 1000);

    const existingView =
      await prisma.analyticsEvent.findFirst({
        where: {
          eventType: "PRODUCT_VIEW",
          visitorId,
          productId,
          createdAt: {
            gte: thirtySecondsAgo,
          },
        },
      });

    if (existingView) {
      return;
    }

    await prisma.$transaction([

      prisma.analyticsEvent.create({
        data: {
          eventType: "PRODUCT_VIEW",
          creatorId,
          productId,
          visitorId,
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
    visitorId,
  }) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtySecondsAgo =
      new Date(Date.now() - 30 * 1000);

    const existingClick =
      await prisma.analyticsEvent.findFirst({
        where: {
          eventType: "PRODUCT_CLICK",
          visitorId,
          productId,
          createdAt: {
            gte: thirtySecondsAgo,
          },
        },
      });

    if (existingClick) {
      return;
    }

    await prisma.$transaction([

      prisma.analyticsEvent.create({
        data: {
          eventType: "PRODUCT_CLICK",
          creatorId,
          productId,
          visitorId,
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

  async trackCollectionView({
    creatorId,
    collectionId,
    visitorId,
  }) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtySecondsAgo =
      new Date(Date.now() - 30 * 1000);

    const existingView =
      await prisma.analyticsEvent.findFirst({
        where: {
          eventType: "COLLECTION_VIEW",
          visitorId,
          collectionId,
          createdAt: {
            gte: thirtySecondsAgo,
          },
        },
      });

    if (existingView) {
      return;
    }

    await prisma.$transaction([

      prisma.analyticsEvent.create({
        data: {
          eventType: "COLLECTION_VIEW",
          creatorId,
          collectionId,
          visitorId,
        },
      }),

      prisma.collectionAnalytics.upsert({
        where: {
          collectionId_date: {
            collectionId,
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
          collectionId,
          date: today,
          views: 1,
          clicks: 0,
        },
      }),

    ]);

  }

  async trackCollectionClick({
    creatorId,
    collectionId,
    visitorId,
  }) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtySecondsAgo =
      new Date(Date.now() - 30 * 1000);

    const existingClick =
      await prisma.analyticsEvent.findFirst({
        where: {
          eventType: "COLLECTION_CLICK",
          visitorId,
          collectionId,
          createdAt: {
            gte: thirtySecondsAgo,
          },
        },
      });

    if (existingClick) {
      return;
    }

    await prisma.$transaction([

      prisma.analyticsEvent.create({
        data: {
          eventType: "COLLECTION_CLICK",
          creatorId,
          collectionId,
          visitorId,
        },
      }),

      prisma.collectionAnalytics.upsert({
        where: {
          collectionId_date: {
            collectionId,
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
          collectionId,
          date: today,
          views: 0,
          clicks: 1,
        },
      }),

    ]);

  }

}

module.exports = new TrackingService();