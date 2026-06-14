const router =
  require("express").Router();

router.use(
  "/submissions",
  require("./submission.routes")
);

router.use(
  "/users",
  require("./user.routes")
);

router.use(
  "/stores",
  require("./store.routes")
);

router.use(
  "/creator-products",
  require("./creatorProduct.routes")
);

router.use(
  "/collections",
  require("./collection.routes")
);


router.use(
  "/products",
  require("./product.routes")
);
module.exports = router;