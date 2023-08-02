const express = require('express');
const multer = require('multer');
const User = require('../Models/userModel');
const upload = multer();
const router = express.Router();
const staticStrings = require('../config');



router.post('/', upload.none(), async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.missing_parameter_keyword,
      });
    }
  
    try {
      const user = await User.findOne({ email, password });
      if (user) {
        const response = {
          id: user._id,
          email: user.email,
          username: user.username,
          shippingAddress: user.shippingAddress,
        };
        return res.status(200).json({
          [staticStrings.data_keyword]: response,
          [staticStrings.status_keyword]: true,
        });
      } else {
        return res.status(401).json({
          [staticStrings.status_keyword]: false,
          [staticStrings.message_keyword]: staticStrings.wrong_credential_keyword,
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
