const router =
require("express").Router();

const {
  authenticate,
} = require(
"../../auth/middleware/auth.middleware"
);

const analyticsController =
require(
"../controllers/analytics.controller"
);

router.get(
  "/dashboard",
  authenticate,
  analyticsController
  .getDashboard
);

router.get(
  "/products/:productId",
  authenticate,
  analyticsController
  .getProductAnalytics
);

router.get(
  "/collections/:collectionId",
  authenticate,
  analyticsController
  .getCollectionAnalytics
);

module.exports = router;