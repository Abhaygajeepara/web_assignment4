const express = require('express');
const router = express.Router();
const User = require('../Models/userModel');
const staticStrings = require('../config');
const multer = require('multer');
const upload = multer();


router.post('/', upload.none(),async (req, res) => {
  const { email, currentPassword, newPassword, confirmPassword } = req.body;

  if (!email || !currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.missing_parameter_keyword,
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.new_password_mismatch_message,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.user_not_found_message,
      });
    }

    if (user.password !== currentPassword) {
      return res.status(400).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.incorrect_current_password_message,
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      [staticStrings.status_keyword]: true,
      [staticStrings.message_keyword]: staticStrings.password_updated_message,
    });
  } catch (error) {
    return res.status(500).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: staticStrings.internal_message_keyword,
    });
  }
});

module.exports = router;
