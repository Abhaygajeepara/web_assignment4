const express = require('express');
const router = express.Router();
const Cart = require('../Models/Cart');
const Product = require('../Models/Product');
const staticStrings = require('../config');

router.get('/getCartItems', async (req, res) => {
  const userId = req.query.userId;

  try {
    if (!userId ) {
      return res.status(400).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.missing_parameter_keyword ,
      });
    }

    const cartItems = await Cart.find({ user_id: userId });
console.log(cartItems.length )
    if (cartItems.length > 0) {
      const response = [];
      for (const cartItem of cartItems) {
        const productId = cartItem.product_id;
        const product = await Product.findOne({ _id: productId });

        if (product) {
          const cartItemData = {
            productId: productId,
            description: product.description,
            image: product.image,
            pricing: product.pricing,
            quantities: cartItem.quantity,
            userId: cartItem.user_id,
          };
          response.push(cartItemData);
        }
      }

      return res.status(200).json({
        [staticStrings.status_keyword]: true,
        [staticStrings.data_keyword]: response,
        [staticStrings.message_keyword]: staticStrings.dataFound_message_keyword,
      });
    } else {
      return res.status(200).json({
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
