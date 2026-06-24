const router = require("express").Router();

const {
  authenticate,
} = require("../../auth/middleware/auth.middleware");

const {
  requireAdmin,
} = require("../middleware/requireAdmin");

const {
  getUsers,
  getUserById,
} = require("../controller/user.controller");

router.get(
  "/",
  authenticate,
  requireAdmin,
  getUsers
);

router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getUserById
);

module.exports = router;