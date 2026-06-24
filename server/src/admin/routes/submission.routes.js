const router =
  require("express").Router();

const {
  authenticate,
} = require(
  "../../auth/middleware/auth.middleware"
);

const {
  requireAdmin,
} = require(
  "../middleware/requireAdmin"
);

const {
  getSubmissions,
  getSubmissionById,
  retrySubmission,
} = require(
  "../controller/submission.controller"
);

router.get(
  "/",
  authenticate,
  requireAdmin,
  getSubmissions
);

router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getSubmissionById
);

router.post(
  "/:id/retry",
  authenticate,
  requireAdmin,
  retrySubmission
);

module.exports = router;