const router = require("express").Router();

const {
  register,
  login,
} = require("../controllers/auth.controller");

const { authenticate } = require("../middleware/auth.middleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/profile", authenticate, async (req, res) => {
  try {
    const prisma = require("../config/db");
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        phoneNumber: true,
        role: true,
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
      message: "Server Error",
    });
  }
});

module.exports = router;