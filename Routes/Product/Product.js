const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer();
const config = require('../config'); // Include the config.js file
const Product = require('../Models/Product');

// Route to add a new product
router.post('/add', upload.none(), async (req, res) => {
  const { description, image, pricing, shippingCost } = req.body;
  if (
    isNaN(pricing) ||
   isNaN(shippingCost)
  ) {
    return res.status(400).json({
      [config.status_keyword]: false,
      [config.message_keyword]: config.invalid_data_type_message,
    });
  }
  try {
    const newProduct = new Product({
      description,
      image,
      pricing,
      shippingCost,
    });

    await newProduct.save();

    return res.status(201).json({
      [config.status_keyword]: true,
      [config.message_keyword]: config.product_added_message,
    });
  } catch (error) {
    return res.status(500).json({
      [config.status_keyword]: false,
      [config.message_keyword]: config.internal_server_error_message + error,
    });
  }
});

// Route to get all products
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      [config.status_keyword]: true,
      [config.data_keyword]: products,
    });
  } catch (error) {
    return res.status(500).json({
      [config.status_keyword]: false,
      [config.message_keyword]: config.internal_server_error_message,
    });
  }
});

module.exports = router;
