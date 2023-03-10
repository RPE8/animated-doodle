const path = require("path");
/* eslint-disable-next-line no-unused-vars */
const express = require("express");
const mongoose = require("mongoose");

const config = require("./config/config");
const blogRoutes = require("./routes/blog.routes");
const userRoutes = require("./routes/user.routes");
const loginRoutes = require("./routes/login.routes");
const testingRoutes = require("./routes/testing.routes");
const { errorHandler } = require("./middlewares/error.middleware");
const { auth } = require("./middlewares/auth.middleware");
const { cors } = require("./middlewares/cors.middleware");
const { logger } = require("./middlewares/logging.middleware");

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.MONGODB_URI);
    console.log(`Connected to MongoDB: ${connection.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();

const app = express();
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors);
app.use(logger);
if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRoutes);
}
app.use("/api/blogs", auth, blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/login", loginRoutes);
app.use(errorHandler);

module.exports = app;
