const analyticsService =
require(
"../services/analytics.service"
);

class AnalyticsController {

  async getDashboard(
    req,
    res
  ) {

    try {

      const data =
        await analyticsService
        .getDashboard(
          req.user.id
        );

      return res.json({
        success: true,
        data,
      });

    } catch (error) {

      console.log(error);

      return res.status(500)
      .json({
        message:
        "Server Error",
      });
    }
  }

  async getProductAnalytics(
    req,
    res
  ) {

    try {

      const data =
        await analyticsService
        .getProductReport(
          req.params.productId
        );

      return res.json({
        success: true,
        data,
      });

    } catch (error) {

      console.log(error);

      return res.status(500)
      .json({
        message:
        "Server Error",
      });
    }
  }

  async getCollectionAnalytics(
    req,
    res
  ) {

    try {

      const data =
        await analyticsService
        .getCollectionReport(
          req.params.collectionId
        );

      return res.json({
        success: true,
        data,
      });

    } catch (error) {

      console.log(error);

      return res.status(500)
      .json({
        message:
        "Server Error",
      });
    }
  }
}

module.exports =
new AnalyticsController();