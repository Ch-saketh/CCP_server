const prisma = require("../../auth/config/db");

exports.createSubmission = async (creatorId, url) => {
  return await prisma.productSubmission.create({
    data: {
      creatorId,
      originalUrl: url,
      status: "PENDING"
    }
  });
};

exports.checkDuplicateLink = async (creatorId, url) => {
  return await prisma.creatorProduct.findFirst({
    where: {
      creatorId,
      product: {
        productLinks: {
          some: {
            originalUrl: url
          }
        }
      }
    }
  });
};

exports.updateSubmissionStatus = async (id, status, extraData = {}) => {
  return await prisma.productSubmission.update({
    where: { id },
    data: {
      status,
      ...extraData
    }
  });
};

exports.getSubmissionById = async (id) => {
  return await prisma.productSubmission.findUnique({
    where: { id }
  });
};
