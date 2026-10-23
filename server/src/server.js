const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Import error middleware
const {
  notFound,
  errorHandler
} = require("./middleware/errorMiddleware");

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175"
    ]
  })
);

// Parse incoming request bodies BEFORE routes
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Job Portal API is running"
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes);

// Error handling (keep these last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
