const express = require("express");
const Task = require("../models/Task.model");

const router = express.Router();

router.post("/task", (req, res) => {
  // Create a new task from the request body
  const newTask = new Task(req.body);

  // Save the task to the database
  newTask.save((error, savedTask) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(savedTask);
  });
});

// Get all tasks
router.get("/task", (req, res) => {
  Task.find((error, tasks) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(tasks);
  });
});

// Get a specific task by ID
router.get("/task/:id", (req, res) => {
  Task.findById(req.params.id, (error, task) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(task);
  });
});

module.exports = router;
