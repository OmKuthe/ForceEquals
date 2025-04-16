const express = require('express');
const { protect } = require('../middleware/auth.js');
const { getAccounts, updateStatus } = require('../controller/accountController.js');
const router = express.Router();

router.route('/')
  .get(protect, getAccounts);

router.route('/:id/status')
  .post(protect, updateStatus);

module.exports = router;