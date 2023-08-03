const express = require('express');
const router = express.Router();
const Cart = require('../Models/Cart');
const staticStrings = require('../config');
const multer = require('multer');
const upload = multer();
router.post('/deleteCartItem',upload.none(), async (req, res) => {
  const { productId, userId } = req.body;

  try {
    if (!productId || !userId ) {
      return res.status(400).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.int_validation_keyword,
      });
    }

    const cartItem = await Cart.findOneAndDelete({ user_id: userId, product_id: productId });

    if (cartItem) {
      return res.status(200).json({
        [staticStrings.status_keyword]: true,
        [staticStrings.message_keyword]: staticStrings.successfulMessage_keyword,
      });
    } else {
      return res.status(404).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.dataNotfound_message_keyword,
      });
    }
  } catch (error) {
    return res.status(500).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.internal_message_keyword,
    });
  }
});

module.exports = router;
