const express = require('express');
const pageController = require('../controllers/page');

const router = express.Router();

router.get('/about_us', pageController.getAboutUs);

router.get('/contact_us',pageController.getContactUs);

router.get('/user', pageController.getUserPage);

module.exports = router;