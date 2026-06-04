const prisma = require("../config/db");

const {
  hashPassword,
  comparePassword,
} = require("../utils/hash");

const generateToken =
  require("../utils/jwt");

exports.register = async (req, res) => {

  try {

    console.log("Register endpoint hit");
    console.log("Request body:", req.body);

    const {
      firstName,
      lastName,
      username,
      email,
      password,
      phoneNumber,
    } = req.body;

    // check existing email
    const existingEmail =
      await prisma.user.findUnique({
        where: { email },
      });

    if (existingEmail) {

      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // check username
    const existingUsername =
      await prisma.user.findUnique({
        where: { username },
      });

    if (existingUsername) {

      return res.status(400).json({
        message: "Username already taken",
      });
    }

    // hash password
    const hashedPassword =
      await hashPassword(password);

    // determine role based on email
    const isAdmin = email.endsWith("@platform.com");
    const role = isAdmin ? "ADMIN" : "USER";

    // create user
    const user =
      await prisma.user.create({
        data: {
          firstName,
          lastName,
          username,
          email,
          passwordHash: hashedPassword,
          phoneNumber,
          role,
        },
      });

    // generate jwt
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      token,
      user,
    });

  } catch (error) {

    console.log("Register error:", error.message);
    console.log("Stack:", error.stack);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};


exports.login = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // find user
    const user =
      await prisma.user.findUnique({
        where: { email },
      });

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });
    }

    // compare password
    const isMatch =
      await comparePassword(
        password,
        user.passwordHash
      );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user,
    });

  } catch (error) {

    console.log("Login error:", error.message);
    console.log("Stack:", error.stack);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};