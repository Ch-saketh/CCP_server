const prisma = require("../config/db");

const {
  hashPassword,
  comparePassword,
} = require("../utils/hash");

const generateToken =
  require("../utils/jwt");

const verifyGoogleToken =
  require("../utils/google");

// REGISTER
exports.register = async (
  req,
  res
) => {

  try {

    console.log(
      "Register endpoint hit"
    );

    console.log(
      "Request body:",
      req.body
    );

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
        message:
          "Email already exists",
      });
    }

    // check username
    const existingUsername =
      await prisma.user.findUnique({
        where: { username },
      });

    if (existingUsername) {

      return res.status(400).json({
        message:
          "Username already taken",
      });
    }

    // hash password
    const hashedPassword =
      await hashPassword(password);

    // determine role
    const isAdmin =
      email.endsWith(
        "@CCP.in"
      );

    const role =
      isAdmin
        ? "ADMIN"
        : "USER";

    // create user
    const user =
      await prisma.user.create({

        data: {

          firstName,

          lastName,

          username,

          email,

          passwordHash:
            hashedPassword,

          phoneNumber,

          role,

          authProvider:
            "EMAIL",
        },
      });

    // generate jwt
    const token =
      generateToken(user);

    return res.status(201).json({

      success: true,

      token,

      user,
    });

  } catch (error) {

    console.log(
      "Register error:",
      error.message
    );

    console.log(
      "Stack:",
      error.stack
    );

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// LOGIN
exports.login = async (
  req,
  res
) => {

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
        message:
          "User not found",
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
        message:
          "Invalid credentials",
      });
    }

    // generate token
    const token =
      generateToken(user);

    return res.json({

      success: true,

      token,

      user,
    });

  } catch (error) {

    console.log(
      "Login error:",
      error.message
    );

    console.log(
      "Stack:",
      error.stack
    );

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// GOOGLE AUTH
exports.googleAuth = async (
  req,
  res
) => {

  try {

    const { token } = req.body;

    // verify token
    const payload =
      await verifyGoogleToken(
        token
      );

    const {
      sub,
      email,
      given_name,
      family_name,
      picture,
    } = payload;

    // check user
    let user =
      await prisma.user.findUnique({
        where: { email },
      });

    // EXISTING USER
    if (user) {

      const jwtToken =
        generateToken(user);

      return res.json({

        success: true,

        token: jwtToken,

        user,
      });
    }

    // NEW USER
    return res.json({

      success: true,

      requiresAdditionalInfo:
        true,

      googleData: {

        firstName:
          given_name,

        lastName:
          family_name,

        email,

        googleId: sub,

        profileImage:
          picture,
      },
    });

  } catch (error) {

    console.log(
      "Google auth error:",
      error.message
    );

    return res.status(500).json({

      message:
        "Google auth failed",
    });
  }
};

// COMPLETE GOOGLE SIGNUP
exports.completeGoogleSignup =
  async (req, res) => {

    try {

      const {

        firstName,
        lastName,
        email,
        googleId,
        profileImage,

        username,
        password,
        phoneNumber,

      } = req.body;

      // username exists
      const existingUsername =
        await prisma.user.findUnique({
          where: { username },
        });

      if (existingUsername) {

        return res.status(400).json({

          message:
            "Username already taken",
        });
      }

      // hash password
      const hashedPassword =
        await hashPassword(
          password
        );

      // create user
      const user =
        await prisma.user.create({

          data: {

            firstName,

            lastName,

            email,

            username,

            passwordHash:
              hashedPassword,

            phoneNumber,

            googleId,

            profileImage,

            authProvider:
              "GOOGLE",

            role: "USER",
          },
        });

      // jwt token
      const token =
        generateToken(user);

      return res.status(201).json({

        success: true,

        token,

        user,
      });

    } catch (error) {

      console.log(
        "Google signup error:",
        error.message
      );

      return res.status(500).json({

        message:
          "Google signup failed",
      });
    }
  };