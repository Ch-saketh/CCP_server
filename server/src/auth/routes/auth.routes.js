const router =
  require("express").Router();

const {

  register,

  login,

  googleAuth,

  completeGoogleSignup,

} = require(
  "../controllers/auth.controller"
);

const {

  authenticate,

} = require(
  "../middleware/auth.middleware"
);

// PUBLIC ROUTES

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

// GOOGLE LOGIN
router.post(
  "/google",
  googleAuth
);

// COMPLETE GOOGLE SIGNUP
router.post(
  "/google/complete-profile",
  completeGoogleSignup
);

// PROTECTED ROUTE
router.get(

  "/profile",

  authenticate,

  async (req, res) => {

    try {

      const prisma =
        require("../config/db");

      const user =
        await prisma.user.findUnique({

          where: {
            id: req.user.id,
          },

          select: {

            id: true,

            firstName: true,

            lastName: true,

            email: true,

            username: true,

            phoneNumber: true,

            role: true,

            authProvider: true,

            profileImage: true,

            createdAt: true,
          },
        });

      return res.json({

        success: true,

        user,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        message:
          "Server Error",
      });
    }
  }
);

module.exports = router;