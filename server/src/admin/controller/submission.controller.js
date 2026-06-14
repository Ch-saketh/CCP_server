const prisma =
  require("../../auth/config/db");

// GET /admin/submissions
exports.getSubmissions =
  async (req, res) => {

    

    try {

        console.log("Query Params:", req.query);

      const {
        status,
        page = 1,
        limit = 20,
      } = req.query;

      const skip =
        (Number(page) - 1) *
        Number(limit);

      const where = {};

      if (status) {
        where.status = status;
      }

      const submissions =
        await prisma.productSubmission.findMany({

          where,

          skip,

          take: Number(limit),

          orderBy: {
            createdAt: "desc",
          },

          include: {
            creator: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        });

      const total =
        await prisma.productSubmission.count({
          where,
        });

      return res.json({
        success: true,

        data: submissions,

        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages:
            Math.ceil(
              total /
                Number(limit)
            ),
        },
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch submissions",
      });
    }
  };

// GET /admin/submissions/:id
exports.getSubmissionById =
  async (req, res) => {

    try {

      const submission =
        await prisma.productSubmission.findUnique(
          {
            where: {
              id: req.params.id,
            },
          }
        );

      if (!submission) {

        return res.status(404).json({
          success: false,
          message:
            "Submission not found",
        });
      }

      return res.json({
        success: true,
        data: submission,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };

// POST /admin/submissions/:id/retry
// exports.retrySubmission =
//   async (req, res) => {

//     try {

//       const submission =
//         await prisma.productSubmission.update(
//           {
//             where: {
//               id: req.params.id,
//             },

//             data: {
//               status: "PENDING",
//               errorMessage: null,
//             },
//           }
//         );

//       return res.json({
//         success: true,

//         message:
//           "Submission requeued for processing",

//         data: {
//           id: submission.id,
//           status:
//             submission.status,
//         },
//       });

//     } catch (error) {

//       return res.status(500).json({
//         success: false,
//         message:
//           "Failed to retry submission",
//       });
//     }
//   };


exports.retrySubmission = async (req, res) => {
  try {
    const submission = await prisma.productSubmission.findUnique({
      where: { id: req.params.id },
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    if (submission.status !== "FAILED") {
      return res.status(400).json({
        success: false,
        message: `Only FAILED submissions can be retried. Current status: ${submission.status}`,
      });
    }

    const updated = await prisma.productSubmission.update({
      where: { id: req.params.id },
      data: { status: "PENDING", errorMessage: null },
    });

    return res.json({
      success: true,
      message: "Submission requeued for processing",
      data: { id: updated.id, status: updated.status },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to retry submission" });
  }
};