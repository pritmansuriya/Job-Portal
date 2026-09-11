const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require(
  "./routes/notificationRoutes"
);

const {
  notFound,
  errorHandler
} = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175"
    ]
  })
);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
  res.json({
    message: "Job Portal API is running"
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/jobs",
  jobRoutes
);

app.use(
  "/api/applications",
  applicationRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(notFound);
app.use(errorHandler);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});