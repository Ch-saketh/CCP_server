const prisma = require("../config/db");


const {
  hashPassword,
  comparePassword,
} = require("../utils/hash");

const {
  isStrongPassword,
} = require("../utils/password");

const generateToken =
  require("../utils/jwt");

const verifyGoogleToken =
  require("../utils/google");

// REGISTER
// exports.register = async (
//   req,
//   res
// ) => {

//   try {

//     console.log(
//       "Register endpoint hit"
//     );

//     console.log(
//       "Request body:",
//       req.body
//     );

//     const {
//       firstName,
//       lastName,
//       username,
//       email,
//       password,
//       phoneNumber,
//     } = req.body;

//     // check existing email
//     const existingEmail =
//       await prisma.user.findUnique({
//         where: { email },
//       });

//     if (existingEmail) {

//       return res.status(400).json({
//         message:
//           "Email already exists",
//       });
//     }

//     // check username
//     const existingUsername =
//       await prisma.user.findUnique({
//         where: { username },
//       });

//     if (existingUsername) {

//       return res.status(400).json({
//         message:
//           "Username already taken",
//       });
//     }

//     // hash password
//     const hashedPassword =
//       await hashPassword(password);

//     // determine role
//     const isAdmin =
//       email.endsWith(
//         "@CCP.in"
//       );

//     const role =
//       isAdmin
//         ? "ADMIN"
//         : "USER";

//     // create user
//     const user =
//       await prisma.user.create({

//         data: {

//           firstName,

//           lastName,

//           username,

//           email,

//           passwordHash:
//             hashedPassword,

//           phoneNumber,

//           role,

//           authProvider:
//             "EMAIL",
//         },
//       });

//     // generate jwt
//     const token =
//       generateToken(user);

//     return res.status(201).json({

//       success: true,

//       token,

//       user,
//     });

//   } catch (error) {

//     console.log(
//       "Register error:",
//       error.message
//     );

//     console.log(
//       "Stack:",
//       error.stack
//     );

//     return res.status(500).json({
//       message: "Server Error",
//     });
//   }
// };

// REGISTER
exports.register = async (req, res) => {
  try {
    console.log("========== REGISTER ==========");
    console.log("Request Body:", req.body);

    const {
      firstName,
      lastName,
      username,
      email,
      password,
      phoneNumber,
    } = req.body;

    // validation
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    console.log("1. Validation passed");

    // role logic
    let role;

    if (email.endsWith("@platform.com")) {
      role = "ADMIN";
    } else if (email.endsWith("@gmail.com")) {
      role = "USER";
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Only @gmail.com and @platform.com emails are allowed",
      });
    }

    console.log("2. Role assigned:", role);

    // existing email
    const existingEmail =
      await prisma.user.findUnique({
        where: { email },
      });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    console.log("3. Email check passed");

    // existing username
    const existingUsername =
      await prisma.user.findUnique({
        where: { username },
      });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    if (
  username.length < 3 ||
  username.length > 20
) {
  return res.status(400).json({
    success: false,
    message:
      "Username must be between 3 and 20 characters",
  });
}

    console.log("4. Username check passed");

   



    if (!isStrongPassword(password)) {
  return res.status(400).json({
    success: false,
    message:
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
  });
}

    // hash password
    const hashedPassword =
      await hashPassword(password);

    console.log("5. Password hashed");



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
          authProvider: "EMAIL",
        },
      });

    console.log("6. User created");
    console.log(user);

    // generate token
    const token =
      generateToken(user);

    console.log("7. JWT generated");

    return res.status(201).json({
      success: true,
      token,
      user,
    });

  } catch (error) {
    console.error(
      "========== REGISTER ERROR =========="
    );

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
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

      if (!isStrongPassword(password)) {
  return res.status(400).json({
    success: false,
    message:
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
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