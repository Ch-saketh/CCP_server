const prisma = require("../../auth/config/db");

exports.findProductBySlugOrSource = async (slug, sourcePlatform, sourceProductId) => {
  return await prisma.product.findFirst({
    where: {
      OR: [
        { slug },
        (sourceProductId && sourcePlatform) ? { sourcePlatform, sourceProductId } : null
      ].filter(Boolean)
    }
  });
};

exports.countProductsBySlug = async (slug) => {
  return await prisma.product.count({
    where: { slug: { startsWith: slug } }
  });
};

exports.createProductWithLink = async (productData) => {
  return await prisma.$transaction(async (tx) => {
    return await tx.product.create({
      data: {
        title: productData.title,
        slug: productData.slug,
        brand: productData.brand,
        category: productData.category,
        subcategory: productData.subcategory,
        primaryImageUrl: productData.primaryImageUrl,
        price: productData.price,
        currency: productData.currency || "INR",
        sourcePlatform: productData.sourcePlatform,
        sourceProductId: productData.sourceProductId,
        productLinks: {
          create: {
            platform: productData.platform || "Unknown",
            originalUrl: productData.originalUrl || "",
            isPrimary: true,
          }
        }
      }
    });
  });
};

exports.findCreatorProduct = async (creatorId, productId) => {
  return await prisma.creatorProduct.findFirst({
    where: { creatorId, productId }
  });
};

exports.createCreatorProduct = async (data) => {
  return await prisma.creatorProduct.create({
    data,
    include: {
      product: {
        include: {
          productLinks: true,
        }
      }
    }
  });
};

exports.updateCreatorProduct = async (id, data) => {
  return await prisma.creatorProduct.update({
    where: { id },
    data,
    include: {
      product: {
        include: {
          productLinks: true,
        }
      }
    }
  });
};


exports.findCreatorProductsByUserId = async (creatorId) => {
  return await prisma.creatorProduct.findMany({
    where: { creatorId },
    include: {
      product: {
        include: {
          productLinks: true,
        }
      }
    }
  });
};

exports.findUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
    }
  });
};

exports.findCreatorProductById = async (id) => {
  return await prisma.creatorProduct.findUnique({
    where: { id }
  });
};

exports.deleteCreatorProduct = async (id) => {
  return await prisma.creatorProduct.delete({
    where: { id }
  });
};

exports.findProducts = async ({ search, category, subcategory, brand, page = 1, limit = 10 }) => {
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const take = parseInt(limit, 10);
  const where = {
    isActive: true,
  };

  if (category) {
    where.category = { equals: category, mode: "insensitive" };
  }
  if (subcategory) {
    where.subcategory = { equals: subcategory, mode: "insensitive" };
  }
  if (brand) {
    where.brand = { equals: brand, mode: "insensitive" };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
      { subcategory: { contains: search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      include: {
        productLinks: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
};

exports.findProductBySlugDetails = async (slug) => {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      productLinks: true,
      productImages: {
        orderBy: { displayOrder: "asc" }
      },
      productSpecifications: true,
    }
  });
};

