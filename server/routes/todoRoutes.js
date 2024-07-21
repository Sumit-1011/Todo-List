const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const authenticateToken = require("../middleware/authMiddleware");
const User = require("../models/userModel");
const Todo = require("../models/todoModel");

// Use authentication middleware
router.use(authenticateToken);

// GET /todos
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).populate(
      "todos"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.todos);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /todos
router.post("/", async (req, res) => {
  let { todo } = req.body;

  if (!todo) {
    return res.status(400).json({ message: "No todo found" });
  }

  try {
    const newTodo = new Todo({
      todo,
      status: false,
    });

    await newTodo.save();

    // Update user's todos
    await User.updateOne(
      { email: req.user.email },
      { $push: { todos: newTodo._id } }
    );

    res.status(201).json({ todo, status: false, _id: newTodo._id });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /todos/:id
router.delete("/:id", async (req, res) => {
  const _id = new ObjectId(req.params.id); // Convert to ObjectId

  try {
    //console.log("Deleting Todo with ID:", _id);

    const deletedTodo = await Todo.deleteOne({ _id });

    if (deletedTodo.deletedCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    //console.log("Deleted Todo:", deletedTodo);

    const updatedUser = await User.updateOne(
      { email: req.user.email },
      { $pull: { todos: _id } }
    );

    //console.log("Updated User:", updatedUser);

    if (updatedUser.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "User or Todo not found in user's todos" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Failed to delete todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /todos/:id
// PUT /todos/:id
router.put("/:id", async (req, res) => {
  const _id = new ObjectId(req.params.id); // Convert to ObjectId
  const { todo, status } = req.body;

  if (typeof status !== "boolean") {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updateFields = {};
    if (todo) {
      updateFields.todo = todo;
    }
    updateFields.status = status;

    const updatedTodo = await Todo.updateOne({ _id }, { $set: updateFields });

    if (updatedTodo.matchedCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Always return a success response
    res.status(200).json({
      message: "Todo updated successfully",
      modifiedCount: updatedTodo.modifiedCount,
    });
  } catch (error) {
    console.error("Failed to update todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
