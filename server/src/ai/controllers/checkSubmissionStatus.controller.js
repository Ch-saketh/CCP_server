const checkSubmissionStatusService = require("../services/checkSubmissionStatus.service");

exports.checkSubmissionStatus = async (req, res) => {
  try {
    const { submissionId } = req.params;

    if (!submissionId) {
      return res.status(400).json({ 
        success: false,
        message: "Submission ID is required" 
      });
    }

    const submission = await checkSubmissionStatusService.getSubmission(submissionId);

    if (!submission) {
      return res.status(404).json({ 
        success: false,
        message: "Submission not found" 
      });
    }

    if (submission.status === "COMPLETED") {
      return res.status(200).json({ 
        success: true,
        status: "COMPLETED", 
        data: submission.aiExtractedData 
      });
    }

    if (submission.status === "FAILED") {
      if (submission.errorMessage === "ALREADY_LINKED") {
        return res.status(400).json({
          success: false,
          message: "You have already added this product to your profile."
        });
      }
      return res.status(200).json({ 
        success: false,
        status: "FAILED", 
        message: "AI Parsing failed",
        error: submission.errorMessage 
      });
    }

    return res.status(200).json({ 
      success: true,
      status: submission.status 
    });

  } catch (error) {
    console.error("Check Status Error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
