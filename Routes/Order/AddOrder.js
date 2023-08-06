const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../Models/Order');
const User = require('../Models/userModel');
const staticStrings = require('../config');
const multer = require('multer');
const upload = multer();

router.post('', upload.none(), async (req, res) => {
  const { user_id, total_amount, items, qty } = req.body;

  if (!user_id || !total_amount || !items || !qty) {
    return res.status(400).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.missing_parameter_keyword,
    });
  }
  const itemsList = JSON.parse(items);
  const qtyList = JSON.parse(qty);
  console.log(itemsList);
  console.log(qtyList);
  if (itemsList.length !== qtyList.length) {
    return res.status(400).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.length_not_same,
    });
  }

  try {
    const existingUser = await User.findById(user_id);
    if (!existingUser) {
      return res.status(404).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.user_not_found_message,
      });
    }

    
    
    const itemIds = itemsList.map((stringId, index) =>
       new mongoose.Types.ObjectId(stringId),
  
    );
    const qtys = qtyList.map((stringId, index) =>  parseInt(qtyList[index]));

    const newOrder = new Order({
      user_id,
      total_amount,
      items: itemIds,
      qty:qtys,
      shipping_address: existingUser.shippingAddress,
    });

    await newOrder.save();

    return res.status(201).json({
      [staticStrings.status_keyword]: true,
      [staticStrings.message_keyword]: staticStrings.order_successful_keyword,
    });
  } catch (error) {
    return res.status(500).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.order_failed_keyword + error,
    });
  }
});

module.exports = router;
