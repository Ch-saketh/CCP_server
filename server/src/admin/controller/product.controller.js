const prisma = require("../../auth/config/db");

// GET /admin/products
exports.getProducts = async (req, res) => {
  try {
    const {
      isActive,
      category,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const where = {};

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const skip =
      (Number(page) - 1) * Number(limit);

    const [products, total] =
      await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: Number(limit),

          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            price: true,
            isActive: true,
            createdAt: true,
          },
        }),

        prisma.product.count({
          where,
        }),
      ]);

    return res.status(200).json({
      success: true,
      data: products,
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
      message: "Failed to fetch products",
    });
  }
};

// GET /admin/products/:id
exports.getProductById = async (
  req,
  res
) => {
  try {

    const product =
      await prisma.product.findUnique({
        where: {
          id: req.params.id,
        },

        include: {
          productImages: true,

          productLinks: true,

          productSpecifications: true,

          creatorProducts: {
            select: {
              id: true,
              creatorId: true,
              status: true,
            },
          },
        },
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};