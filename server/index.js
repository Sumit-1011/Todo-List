require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./config/database");
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://todo-list-extension-client.onrender.com", // Production domain
];

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// API routes
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToMongoDB();
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process with failure code
  }
}

startServer();
