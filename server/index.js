require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./config/database");
const path = require("path");
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://todo-list-61yi.onrender.com", // Production domain
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

// Serve static files
app.use(express.static(path.join(__dirname, "public/dist")));

// API routes
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);

// Serve the React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dist/index.html"));
});

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
