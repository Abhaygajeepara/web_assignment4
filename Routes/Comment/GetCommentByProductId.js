const express = require('express');
const router = express.Router();
const Comment = require('../Models/Comment');
const staticStrings = require('../config');

router.get('/', async (req, res) => {
  const product_id = req.query.product_id;

  if (!product_id ) {
    return res.status(400).json({
      [staticStrings.status_keyword]: false,
      [staticStrings.message_keyword]: `${staticStrings.missing_parameter_keyword}`,
    });
  }

  try {
    const comments = await Comment.find({ product_id });

    if (comments.length > 0) {
      const response = comments.map((comment) => ({
        id: comment.id,
        product_id: comment.product_id,
        user_id: comment.user_id,
        rating: comment.rating,
        comment_text: comment.comment_text,
        image: comment.image.map((imageName) => `${staticStrings.getImagePath}/${imageName}`),
      }));

      return res.status(200).json({
        [staticStrings.data_keyword]: response,
        [staticStrings.status_keyword]: true,
        [staticStrings.message_keyword]: staticStrings.dataFound_message_keyword,
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
