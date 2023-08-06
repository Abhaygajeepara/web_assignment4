const express = require('express');
const multer = require('multer');
const User = require('../Models/userModel');
const upload = multer();
const router = express.Router();
const staticStrings = require('../config');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', upload.none(), async (req, res) => {
  const { email, password, username, shippingAddress } = req.body;

  if (!email || !password || !username || !shippingAddress) {
    return res.status(400).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.missing_parameter_keyword,
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.invalid_email_format_keyword,
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.user_already_exists_keyword,
      });
    }

    const newUser = new User({
      email,
      password,
      username,
      shippingAddress: shippingAddress,
    });

    await newUser.save();

    return res.status(201).json({
      [staticStrings.status_keyword]: true,
      [staticStrings.message_keyword]: staticStrings.registration_successful_keyword,
    });
  } catch (error) {
    return res.status(500).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.internal_server_error_keyword + ""+ error,
    });
  }
});

module.exports = router;
