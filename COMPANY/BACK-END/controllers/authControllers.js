const knex = require("../db/knex");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendVerificationEmail } = require("../utils/sendEmail");
const { resetEmail } = require("../utils/resetEmail");

// ===============================
// Create User (Normal Users Only)
// ===============================
// exports.createUser = async (req, res) => {
//   try {
//     const { name, email, state, lga, phone, password, gender } = req.body;
//     console.log("Registration Request Body:: ", req.body);
//     if (!name || !email || !state || !lga || !phone || !password || !gender) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const exists = await knex("Users").where({ email }).first();
//     if (exists) {
//       return res.status(409).json({ error: "Credentials already exist" });
//     }
//     console.log("Passed");
//     const phoneNumber = await knex("Users").where({ phone }).first();
//     if (phoneNumber) {
//       return res.status(409).json({ error: "Credentials already exist" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const verificationToken = jwt.sign(
//       { email },
//       process.env.EMAIL_TOKEN_SECRET,
//       { expiresIn: "1d" }
//     );
//     const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
//     const sendMail = await sendVerificationEmail(email, verifyUrl);
//     console.log("THis is the sendemail response :",sendMail)
//     if (!sendMail.success) {
//       return res.status(400).json({ error: sendMail.error });
//     }
//     // sendMail;
//     console.log("authController:: sendingin mail :", sendMail);

//     await knex("Users").insert({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       gender,
//       role: "user",
//       state,
//       lga,
//       verification_token: verificationToken,
//       is_verified: false,
//       created_at: knex.fn.now(),
//       updated_at: knex.fn.now(),
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Registration successful. Please verify your email.",
//     });
//   } catch (error) {
//     console.error("Auth Error:", error);
//     return res.status(403).json({success:false, error: "Unauthorized" });
//   }
// };

exports.createUser = async (req, res) => {
  try {
    const { name, email, state, lga, phone, password, gender } = req.body;

    if (!name || !email || !state || !lga || !phone || !password || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists (combined check for efficiency)
    const exists = await knex("Users")
      .where({ email })
      .orWhere({ phone })
      .first();

    if (exists) {
      return res
        .status(409)
        .json({ error: "Email or Phone number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = jwt.sign(
      { email },
      process.env.EMAIL_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // 1. AWAIT the email sending
    const emailResponse = await sendVerificationEmail(email, verifyUrl);

    // 2. Correct Error Checking (matches your sendEmail return object)
    if (emailResponse.error) {
      console.error("Email dispatch failed:", emailResponse.error);
      return res.status(403).json({
        error: "Failed to send verification email. Please try again.",
      });
    }

    // 3. Insert into Database only if email was sent successfully
    await knex("Users").insert({
      name,
      email: email.toLowerCase().trim(),
      phone,
      password: hashedPassword,
      gender,
      role: "user",
      state,
      lga,
      verification_token: verificationToken,
      is_verified: false,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    });

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your inbox to verify your email.",
    });
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(403).json({ success: false, error: "Unauthorized" });
  }
};

// ===============================
// LOGIN (For all roles except Admin)
// ===============================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login Request Body:: ", req.body);

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const account = await knex("Users").where({ email }).first();

    if (!account) {
      return res.status(403).json({ error: "Invalid credentialss" });
    }

    // Verify email for normal users only
    if (!account.is_verified) {
      return res.status(403).json({ error: "Email not verified" });
    }
    const valid = await bcrypt.compare(password, account.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Token
    const token = jwt.sign(
      { userId: account.id, role: account.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token: token,
      role: account.role, // Still send role in body for frontend immediate use
      message: "Login successful",
    });
  } catch (err) {
    console.log("Login Error:: ", err);
    return res.status(403).json({ error: "Unauthorized" });
  }
};
// ... (rest of the catch block) ...

// In authControllers.js
exports.checkLogin = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    console.log("checkLogin:: ", token);
    if (!token) {
      return res
        .status(406)
        .json({ success: false, error: "no token provided" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, error: "Invalid Token" });
      }
      if (decoded) {
        return res.status(200).json({ success: true, role: decoded.role });
      }
    });
  } catch (err) {
    console.log("checkLogin Error:: ", err);
    return res.status(403).json({ success: false, error: "Unauthorized" });
  }
};

exports.logout = (req, res) => {
  // No need for req.body.role check
  // Clear the single, constant cookie name
  res.clearCookie("accessToken", {
    httpOnly: true,
    // Use the same secure/sameSite settings as the login function
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Use strict or none depending on cross-site needs
  });

  return res.json({
    success: true,
    message: "Logged out successfully", // Generic message
  });
};

// ===============================
// Middleware - Protect Routes
// ===============================
// In authControllers.js

exports.authenticate = (req, res, next) => {
  // Check the 'authorization' header (Express lowers the case automatically)
  const authHeader = req.headers["authorization"];
  console.log("Authenticate Middleware:: Auth Header:: ", authHeader);

  // Extract the token part from "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("Blocked by Middleware: No Token found in headers");
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Blocked by Middleware: Token invalid", err);
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

// ===============================
// Get Logged In User Profile
// ===============================
exports.getProfile = async (req, res) => {
  try {
    const { role, userId } = req.user;
    // const role = req.role;
    console.log("authControllers :: ", req.user, role);
    // const role = req.role;
    const account = await knex("Users")
      .select(
        "id",
        "name",
        "email",
        "phone",
        "gender",
        "role",
        "state",
        "capacity",
        "lga",
        "age"
      )
      .where({ id: userId, role: role })
      .first();

    if (!account) return res.status(401).json({ error: "Invalid credentials" });

    return res.status(200).json({ success: true, user: account });
  } catch (error) {
    console.error("Profile Error:", error);
    return res.status(403).json({ error: "Unauthorized" });
  }
};
// ===============================
// Reset Password
// ===============================
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const account = await knex("Users").where({ email }).first();
    if (!account) {
      // Return 200 even if user not found for security (prevents email enumeration)
      // or 401 if you prefer explicit errors
      return res.status(401).json({ error: "Invalid credentials" });
    } // <--- Added missing closing brace

    const resetToken = jwt.sign({ email }, process.env.EMAIL_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const sendMail = await resetEmail(email, resetUrl);

    if (sendMail.error) {
      return res.status(400).json({ error: sendMail.error });
    }

    // Properly return a success response
    return res
      .status(200)
      .json({ message: "Password reset link sent to email" });
  } catch (error) {
    // <--- Removed the extra stray "}" before this
    console.error("Reset Password Error:", error);
    return res.status(403).json({ error: "Unauthorized" });
  }
};
