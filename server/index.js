require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./config/database");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://todo-list-61yi.onrender.com", // Adjust as necessary
  })
);

app.use(express.static(path.join(__dirname, "public/dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dist/index.html"));
});

const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToMongoDB();
    app.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process with failure code
  }
}

startServer();
