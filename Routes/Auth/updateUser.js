const express = require('express');
const router = express.Router();
const User = require('../Models/userModel');
const staticStrings = require('../config');
const multer = require('multer');
const upload = multer();

router.post('/', upload.none(), async (req, res) => {
  const { email, shippingAddress } = req.body;

  if (!email || !shippingAddress) {
    return res.status(400).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.missing_parameter_keyword,
    });
  }

  try {
    // Check if the user with the provided email exists
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(200).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.user_not_found_message,
      });
    }

    // Check if the provided address is the same as the existing one
    if (existingUser.shippingAddress === shippingAddress) {
      return res.status(200).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.address_no_change_message,
      });
    }

    // Perform the update operation
    const updateResult = await User.updateOne({ email: email }, { shippingAddress: shippingAddress });

    return res.status(200).json({
      [staticStrings.status_keyword]: true,
      [staticStrings.message_keyword]: staticStrings.address_updated_message,
    });
  } catch (error) {
    return res.status(500).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.internal_message_keyword,
    });
  }
});

module.exports = router;
