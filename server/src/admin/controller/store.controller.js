const prisma = require("../../auth/config/db");

// GET /admin/stores
exports.getStores = async (req, res) => {
  try {
    const {
      isActive,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const where = {};

    if (isActive !== undefined) {
      where.isActive =
        isActive === "true";
    }

    if (search) {
      where.OR = [
        {
          storeName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          storeSlug: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          user: {
            username: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    const [stores, total] =
      await Promise.all([
        prisma.store.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        }),

        prisma.store.count({
          where,
        }),
      ]);

    return res.json({
      success: true,
      data: stores,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(
          total / Number(limit)
        ),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stores",
    });
  }
};

// GET /admin/stores/:id
exports.getStoreById = async (
  req,
  res
) => {
  try {
    const store =
      await prisma.store.findUnique({
        where: {
          id: req.params.id,
        },

        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const [
      activeProducts,
      hiddenProducts,
      collections,
    ] = await Promise.all([
      prisma.creatorProduct.count({
        where: {
          creatorId: store.userId,
          status: "ACTIVE",
        },
      }),

      prisma.creatorProduct.count({
        where: {
          creatorId: store.userId,
          status: "HIDDEN",
        },
      }),

      prisma.collection.count({
        where: {
          creatorId: store.userId,
        },
      }),
    ]);

    return res.json({
      success: true,

      data: {
        id: store.id,
        storeName: store.storeName,
        storeSlug: store.storeSlug,
        bio: store.bio,
        isActive: store.isActive,

        user: store.user,

        counts: {
          activeProducts,
          hiddenProducts,
          collections,
        },
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch store",
    });
  }
};