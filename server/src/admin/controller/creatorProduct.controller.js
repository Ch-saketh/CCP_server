const prisma = require("../../auth/config/db");

// GET /admin/creator-products
exports.getCreatorProducts = async (req, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.creator = {
        username: {
          contains: search,
          mode: "insensitive",
        },
      };
    }

    const [creatorProducts, total] =
      await Promise.all([
        prisma.creatorProduct.findMany({
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
                email: true,
              },
            },

            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                isActive: true,
              },
            },
          },
        }),

        prisma.creatorProduct.count({
          where,
        }),
      ]);

    return res.json({
      success: true,
      data: creatorProducts,

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
      message:
        "Failed to fetch creator products",
    });
  }
};

// GET /admin/creator-products/:id
exports.getCreatorProductById =
  async (req, res) => {
    try {
      const creatorProduct =
        await prisma.creatorProduct.findUnique({
          where: {
            id: req.params.id,
          },

          include: {
            creator: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },

            product: {
              include: {
                productImages: true,
                productLinks: true,
                productSpecifications: true,
              },
            },
          },
        });

      if (!creatorProduct) {
        return res.status(404).json({
          success: false,
          message:
            "Creator product not found",
        });
      }

      return res.json({
        success: true,
        data: creatorProduct,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch creator product",
      });
    }
  };