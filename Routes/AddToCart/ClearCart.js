const express = require('express');
const router = express.Router();
const Cart = require('../Models/Cart'); // Assuming you have defined the Cart model
const staticStrings = require('../config');
const multer = require('multer');
const upload = multer();
router.post('/clearCart',upload.none(), async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.int_validation_keyword,
      });
    }

    const cartItems = await Cart.find({ user_id: userId });

    if (cartItems.length === 0) {
      return res.status(404).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.dataNotfound_message_keyword,
      });
    }

    await Cart.deleteMany({ user_id: userId });

    return res.status(200).json({
      [staticStrings.status_keyword]: true,
      [staticStrings.message_keyword]: staticStrings.successfulMessage_keyword,
    });
  } catch (error) {
    return res.status(500).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.internal_message_keyword,
    });
  }
});

module.exports = router;
