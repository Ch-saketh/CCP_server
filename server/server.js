require("dotenv").config();

console.log(
  "[env-check] DATABASE_URL present?",
  !!process.env.DATABASE_URL
);

const app = require("./app");

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  );
});
