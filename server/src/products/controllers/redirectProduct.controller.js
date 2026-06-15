const prisma =
  require("../../auth/config/db");

const redirectService =
  require(
    "../services/redirectProduct.service"
  );

const trackingService =
  require(
    "../../analytics/services/tracking.service"
  );

exports.redirectProduct =
  async (req, res) => {

    try {

      const { productId } =
        req.params;

      const visitorId =
        req.headers["x-visitor-id"] ||
        req.ip;

      const {
        product,
        redirectUrl,
      } =
        await redirectService
          .getRedirectData(
            productId
          );

      const creatorProduct =
        await prisma.creatorProduct
          .findFirst({
            where: {
              productId,
            },
          });

      if (creatorProduct) {

        await trackingService.trackProductClick({
            creatorId:
              creatorProduct.creatorId,
            productId,
            visitorId,
          });

      }

      return res.redirect(
        redirectUrl
      );

    } catch (error) {

      return res.status(404)
        .json({
          success: false,
          message:
            "Product not found",
        });

    }

  };