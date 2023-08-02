const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router();
const { ObjectId } = mongoose.Types;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
   
      const targetDirectory = path.join(__dirname, '../public/images/');
      if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true });
      }
      cb(null, targetDirectory);
    },
    filename: (req, file, cb) => {
      const currentTimestamp = Date.now();
      const fileName = `${currentTimestamp}_${file.originalname}`;
      cb(null, fileName);
    },
  });
  
  const upload = multer({ storage });

const fs = require('fs');
const path = require('path');

const Comment = require('../Models/Comment');
const staticStrings = require('../config');

router.post('/addComment', upload.array('image'), async (req, res) => {
    const { product_id, user_id, rating, comment_text } = req.body;
  
    try {
      // Check if required parameters are provided and of correct types
      if (!product_id || !user_id || !rating || !comment_text) {
        return res.status(400).json({
          [staticStrings.status_keyword]: false,
          [staticStrings.message_keyword]: staticStrings.missing_parameter_keyword,
        });
      }
  
      if (!Number.isInteger(parseInt(rating))) {
        return res.status(400).json({
          [staticStrings.status_keyword]: false,
          [staticStrings.message_keyword]: staticStrings.int_validation_keyword,
        });
      }
  
      // Check if files are uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          [staticStrings.status_keyword]: false,
          [staticStrings.message_keyword]: "No image uploaded.",
        });
      }
  
      const imageNames = [];
  
      const targetDirectory = path.join("upload", './');
      if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true });
      }
  
   
      for (const file of req.files) {
        const currentTimestamp = Date.now();
        const fileName = file.originalname;
        const newFileName = `${currentTimestamp}_${fileName}`;
        const targetFilePath = path.join(targetDirectory, newFileName);
  
        fs.renameSync(file.path, targetFilePath);
        imageNames.push(newFileName);
      }
  
      // Create a new Comment instance with the uploaded data
      const newComment = new Comment({
        product_id: new ObjectId(product_id),
        user_id: new ObjectId(user_id),
        rating: parseInt(rating),
        image: imageNames,
        comment_text,
      });
  
      // Save the new Comment to the database
      await newComment.save();
  
      return res.status(201).json({
        [staticStrings.status_keyword]: true,
        [staticStrings.message_keyword]: staticStrings.addComment_successful_keyword,
      });
    } catch (error) {
      // Handle any errors during the process
      return res.status(500).json({
        [staticStrings.status_keyword]: false,
        [staticStrings.message_keyword]: staticStrings.addComment_fail_keyword + " " + error,
      });
    }
  });
  
  module.exports = router;