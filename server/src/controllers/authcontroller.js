const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==================== REGISTER ====================
const register = async (req, res) => {
  try {
    const { name, password, role } = req.body;

    const email = req.body.email?.trim().toLowerCase();

    console.log("REGISTER API CALLED");
    console.log("Email:", email);

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check existing user
    console.log("Checking existing user...");

    const existingUser = await User.findOne({
      email,
    });

    console.log("Existing user:", !!existingUser);

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    console.log("Hashing password...");

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    console.log("Creating user...");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "jobseeker",
    });

    console.log("User created:", user._id);

    // Generate token
    const token = generateToken(user._id);

    console.log("Registration successful");

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

// ==================== LOGIN ====================
const login = async (req, res) => {
  try {
    console.log("================================");
    console.log("LOGIN API CALLED");

    const { password } = req.body;

    const email = req.body.email?.trim().toLowerCase();

    console.log("Email:", email);
    console.log("Password received:", !!password);

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    console.log("Searching user...");

    const user = await User.findOne({
      email,
    });

    console.log("User found:", !!user);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    console.log("Checking password...");

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    console.log(
      "Password correct:",
      isPasswordCorrect
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    console.log("Generating JWT...");

    const token = generateToken(user._id);

    console.log("Login successful");
    console.log("================================");

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
  console.error("========== LOGIN ERROR ==========");
  console.error(error);
  console.error("================================");

  return res.status(500).json({
    message: "Login failed",
    error: error.message
  });
}
};

module.exports = {
  register,
  login,
};

