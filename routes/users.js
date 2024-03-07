// users.js
const express = require('express');
const router = express.Router();
const usersService = require('../services/usersService');

router.post('/login', usersService.login);
router.post('/request-ad', usersService.requestAd);
router.put('/:userId/advertiser', usersService.updateUserType);

module.exports = router;

