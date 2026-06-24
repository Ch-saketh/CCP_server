const aiRepository = require("../repositories/ai.repository");

exports.getSubmission = async (submissionId) => {
  return await aiRepository.getSubmissionById(submissionId);
};
