const prisma = require("../../auth/config/db");
const { generateUniqueSlug } = require("../services/store.service");
const trackingService = require(
  "../../analytics/services/tracking.service"
);

// POST /api/stores/onboarding
exports.createStoreOnboarding = async (req, res) => {
  try {
    const { storeName } = req.body;
    const userId = req.user.id; 

    if (!storeName) {
      return res.status(400).json({
        success: false,
        message: "Store name is required.",
      });
    }

    // 1. Check if user already has a store
    const existingStore = await prisma.store.findUnique({
      where: { userId },
    });

    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: "You have already created a store.",
      });
    }

    // 2. Generate unique URL slug
    const storeSlug = await generateUniqueSlug(storeName);

    // 3. Create store & mark onboarding as complete in one transaction
    const result = await prisma.$transaction(async (tx) => {
      const newStore = await tx.store.create({
        data: {
          userId,
          storeName,
          storeSlug,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { onboardingCompleted: true },
      });

      return newStore;
    });

    return res.status(201).json({
      success: true,
      message: "Store created successfully.",
      store: result,
    });

  } catch (error) {
    console.error("Onboarding Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create store.",
    });
  }
};

// GET /api/stores/me
exports.getMyStore = async (req, res) => {
  try {
    const userId = req.user.id;

    const store = await prisma.store.findUnique({
      where: { userId },
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found. Please complete onboarding.",
      });
    }

    return res.json({
      success: true,
      store,
    });
  } catch (error) {
    console.error("Get My Store Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT /api/stores
exports.updateStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeName, bio, profileImage, bannerImage } = req.body;

    const existingStore = await prisma.store.findUnique({
      where: { userId },
    });

    if (!existingStore) {
      return res.status(404).json({ success: false, message: "Store not found." });
    }

    const updatedStore = await prisma.store.update({
      where: { userId },
      data: {
        ...(storeName && { storeName }),
        ...(bio !== undefined && { bio }),
        ...(profileImage && { profileImage }),
        ...(bannerImage && { bannerImage }),
      },
    });

    return res.json({
      success: true,
      message: "Store updated successfully",
      store: updatedStore,
    });
  } catch (error) {
    console.error("Update Store Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET /api/stores/:slug (PUBLIC - FOR VISITORS)
// However, there is one final update needed to make the public store fully complete.
//When we originally wrote the public Store API (GET /api/stores/:slug), the Products database didn't exist yet! Right now, if a visitor goes to platform.com/saketh-tech, they will only see your name and bio, but zero products.
// To finish the Store module completely, we just need to update that one controller function so it fetches the products you just added.
exports.getStoreBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const store = await prisma.store.findUnique({
      where: {
        storeSlug: slug,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            creatorProducts: {
              where: {
                status: "COMPLETED",
              },
              orderBy: {
                createdAt: "desc",
              },
              include: {
                product: {
                  include: {
                    productLinks: true,
                    productImages: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!store || !store.isActive) {
      return res.status(404).json({
        success: false,
        message: "Storefront not found.",
      });
    }
    
    const visitorId =
        req.headers["x-visitor-id"] ||
        req.ip;

      await trackingService.trackStoreView({
        creatorId: store.user.id,
        storeId: store.id,
        visitorId,
      });

    return res.json({
      success: true,
      store,
    });
  } catch (error) {
    console.error("Get Public Store Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
