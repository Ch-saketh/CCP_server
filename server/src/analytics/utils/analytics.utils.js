const calculateCTR = (views, clicks) => {
  if (!views) return 0;

  return Number(
    ((clicks / views) * 100).toFixed(2)
  );
};

const getTodayDate = () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
};

module.exports = {
  calculateCTR,
  getTodayDate,
};