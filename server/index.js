require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");
const path = require("path"); 

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/index.html"));
})

const router = require("./routes");
app.use("/api", router);

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
