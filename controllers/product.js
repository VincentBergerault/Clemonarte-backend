const express = require("express");
const Product = require("../models/product.model");

const router = express.Router();
// Get all items
router.get('/', async (req, res) =>  {
  try {
    const items = await Product.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // Get a specific item by ID
// router.get('/:id', (req, res) => {
//     Product.findById(req.params.id, (error, item) => {
//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     res.json(item);
//   });
// });

module.exports = router;
