const prisma =
  require("../../auth/config/db");

exports.getUsers =
  async (req, res) => {

    try {

      const {
        role,
        search,
        page = 1,
        limit = 20,
      } = req.query;

      const skip =
        (Number(page) - 1) *
        Number(limit);

      const where = {};

      if (role) {
        where.role = role;
      }

      if (search) {

        where.OR = [
          {
            username: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ];
      }

      const users =
        await prisma.user.findMany({
          where,

          skip,

          take: Number(limit),

          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            role: true,
            authProvider: true,
            onboardingCompleted: true,
            createdAt: true,
          },
        });

      const total =
        await prisma.user.count({
          where,
        });

      return res.json({
        success: true,
        data: users,
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
          "Failed to fetch users",
      });
    }
  };



  exports.getUserById =
  async (req, res) => {

    try {

      const user =
        await prisma.user.findUnique({

          where: {
            id: req.params.id,
          },

          include: {
            store: {
              select: {
                id: true,
                storeName: true,
                storeSlug: true,
              },
            },

            creatorProducts: true,

            collections: true,

            productSubmissions: true,
          },
        });

      if (!user) {

        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      return res.json({
        success: true,

        data: {
          id: user.id,
          firstName:
            user.firstName,
          lastName:
            user.lastName,
          username:
            user.username,
          email: user.email,
          role: user.role,
          authProvider:
            user.authProvider,
          onboardingCompleted:
            user.onboardingCompleted,
          createdAt:
            user.createdAt,

          store: user.store,

          counts: {
            creatorProducts:
              user.creatorProducts
                .length,

            collections:
              user.collections
                .length,

            submissions:
              user
                .productSubmissions
                .length,
          },
        },
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch user",
      });
    }
  };