const express = require('express');
const multer = require('multer');
const router = express.Router();
const Cart = require('../Models/Cart');
const staticStrings = require('../config');
const upload = multer();
router.post('/addToCart',upload.none(), async (req, res) => {
  const { productId, quantities, userId } = req.body;

  try {
    if (!productId || !quantities || !userId || !Number.isInteger(parseInt(quantities)) ) {
      return res.status(400).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.int_validation_keyword,
      });
    }

    const existingCartItem = await Cart.findOne({ user_id: userId, product_id: productId });

    if (existingCartItem) {
      existingCartItem.quantity = quantities;
      await existingCartItem.save();

      return res.status(200).json({
        [staticStrings.status_keyword]: true,
        [staticStrings.message_keyword]: staticStrings.quantityUpdate_message_keyword,
      });
    } else {
      const newCartItem = new Cart({
        product_id: productId,
        quantity: quantities,
        user_id: userId,
      });

      await newCartItem.save();

      return res.status(201).json({
        [staticStrings.status_keyword]: true,
        [staticStrings.message_keyword]: staticStrings.addToCartSuccessfully_message_keyword,
      });
    }
  } catch (error) {
    return res.status(500).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.addToCartFailed_message_keyword,
    });
  }
});

module.exports = router;
