const aiRepository = require("../repositories/ai.repository");
const publishUrlService = require("../services/publishUrl.service");

exports.publishUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!url) {
      return res.status(400).json({ 
        success: false,
        message: "URL is required" 
      });
    }

    // Precheck: Has the creator already recommended a product with this URL?
    const existing = await aiRepository.checkDuplicateLink(userId, url);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already added this product to your profile."
      });
    }

    // 1. Immediately save the URL to the database
    const submission = await aiRepository.createSubmission(userId, url);

    // 2. Start the AI Extraction (Async)
    const extractionPromise = publishUrlService.triggerAiExtraction(submission.id, url);

    // 3. Create a 5-second Timeout Promise
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve("TIMEOUT"), 5000);
    });

    // 4. RACE! Whichever finishes first wins.
    const result = await Promise.race([extractionPromise, timeoutPromise]);

    // Outcome A: AI took longer than 5 seconds
    if (result === "TIMEOUT") {
      return res.status(202).json({ 
        success: true, 
        status: "PENDING",
        message: "Processing is taking longer than 5 seconds. Please start polling.",
        submissionId: submission.id 
      });
    }

    // Outcome B: AI finished BEFORE 5 seconds!
    const completedSubmission = await aiRepository.getSubmissionById(submission.id);

    if (completedSubmission.status === "FAILED") {
      if (completedSubmission.errorMessage === "ALREADY_LINKED") {
        return res.status(400).json({
          success: false,
          message: "You have already added this product to your profile."
        });
      }
      return res.status(500).json({ 
        success: false, 
        message: "AI Parsing failed",
        error: completedSubmission.errorMessage
      });
    }

    return res.status(200).json({
      success: true,
      status: "COMPLETED",
      data: completedSubmission.aiExtractedData
    });

  } catch (error) {
    console.error("Publish Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message
    });
  }
};
