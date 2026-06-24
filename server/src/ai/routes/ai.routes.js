const router = require("express").Router();
const { authenticate } = require("../../auth/middleware/auth.middleware");

const { publishUrl } = require("../controllers/publishUrl.controller");
const { checkSubmissionStatus } = require("../controllers/checkSubmissionStatus.controller");

// POST /api/ai/publish-url (Private)
router.post("/publish-url", authenticate, publishUrl);

// GET /api/ai/submissions/:submissionId (Private)
router.get("/submissions/:submissionId", authenticate, checkSubmissionStatus);

module.exports = router;
