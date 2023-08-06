const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
;
const Order = require('../Models/Order');
const Product = require('../Models/Product'); 
const User = require('../Models/userModel');
const staticStrings = require('../config');

router.get('', async (req, res) => {
  const orderId = req.query.orderId;

  if (!orderId ) {
    return res.status(400).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.invalid_order_id_keyword,
    });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.order_not_found_keyword,
      });
    }

    const itemsWithDetails = [];
    for (let i = 0;i<order.items.length;i++) {
      const item  =  order.items[i];
      const qty  =  order.qty[i];
     
      const productId = item;
      const product = await Product.findById(productId).lean();
      console.log(order);
      if (product) {
        itemsWithDetails.push({
          id: product._id,
          description: product.description,
          image: product.image,
          pricing: product.pricing,
          shippingcost: product.shippingCost,
          qty: order.qty[i]
         
         
        });
      }
    }

    const response = {
      user_id: order.user_id._id,
      order_date: order.order_date,
      total_amount: order.total_amount,
      items: itemsWithDetails,
    
      shipping_address: order.shipping_address,
    };

    return res.status(200).json({
      [staticStrings.status_keyword]: true,
      [staticStrings.message_keyword]: staticStrings.dataNotfound_message_keyword,
      [staticStrings.data_keyword]: response,
    });
  } catch (error) {
    return res.status(500).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.internal_server_error_keyword,
    });
  }
});

module.exports = router;
