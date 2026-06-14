const prisma = require("../../auth/config/db");

// GET /admin/collections
exports.getCollections = async (req, res) => {
  try {
    const {
      isPublic,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const where = {};

    if (isPublic !== undefined) {
      where.isPublic =
        isPublic === "true";
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [collections, total] =
      await Promise.all([
        prisma.collection.findMany({
          where,
          skip,
          take: Number(limit),

          orderBy: {
            createdAt: "desc",
          },

          include: {
            creator: {
              select: {
                id: true,
                username: true,
              },
            },

            _count: {
              select: {
                products: true,
              },
            },
          },
        }),

        prisma.collection.count({
          where,
        }),
      ]);

    return res.json({
      success: true,

      data: collections.map(
        (collection) => ({
          id: collection.id,
          title: collection.title,
          slug: collection.slug,
          isPublic:
            collection.isPublic,
          createdAt:
            collection.createdAt,

          creator:
            collection.creator,

          productCount:
            collection._count
              .products,
        })
      ),

      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages:
          Math.ceil(
            total /
              Number(limit)
          ),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch collections",
    });
  }
};




  exports.getCollectionById = async (
  req,
  res
) => {
  try {
    const collection =
      await prisma.collection.findUnique({
        where: {
          id: req.params.id,
        },

        include: {
          creator: {
            select: {
              id: true,
              username: true,
            },
          },

          products: {
            select: {
              id: true,
              title: true,
              slug: true,
              category: true,
              price: true,
              primaryImageUrl: true,
              isActive: true,
            },
          },
        },
      });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message:
          "Collection not found",
      });
    }

    return res.json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch collection",
    });
  }
};