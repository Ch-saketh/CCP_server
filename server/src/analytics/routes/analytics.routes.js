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
  "/creator-dashboard",
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


router.post(
  "/products/:productId/click",
  authenticate,
  analyticsController
    .trackProductClick
);

router.post(
  "/collections/:collectionId/view",
  authenticate,
  analyticsController
    .trackCollectionView
);

router.post(
  "/collections/:collectionId/click",
  authenticate,
  analyticsController
    .trackCollectionClick
);

router.get(
  "/top-products",
  authenticate,
  analyticsController
    .getTopProducts
);

router.get(
  "/top-creators",
  authenticate,
  analyticsController
    .getTopCreators
);
module.exports = router;