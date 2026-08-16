const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.BACKEND_PORT || 5000;

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOST = process.env.MONGO_HOST || "mongodb";
const MONGO_PORT = process.env.MONGO_PORT || "27017";
const MONGO_DATABASE = process.env.MONGO_DATABASE || "taskdb";

const MONGO_URI =
  `mongodb://${MONGO_USER}:${MONGO_PASSWORD}` +
  `@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=admin`;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const Task = mongoose.model("Task", taskSchema);

app.get("/", (req, res) => {
  res.send("Task 8 Backend Running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    application: "Task 8 Backend",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ _id: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Task 8 Backend running on port ${PORT}`);
});
