const express = require('express');
const Item = require('../models/Item.model');

const router = express.Router();

router.post('/item', (req, res) => {
  // Create a new item from the request body
  const newItem = new Item(req.body);

  // Save the item to the database
  newItem.save((error, savedItem) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(savedItem);
  });
});

// Get all items
router.get('/item', (req, res) => {
  Item.find((error, items) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(items);
  });
});

// Get a specific item by ID
router.get('/item/:id', (req, res) => {
  Item.findById(req.params.id, (error, item) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(item);
  });
});

module.exports = router;
