// config.js
require('dotenv').config();

const config = {
  razorpayKeyID: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
};

module.exports = config;
