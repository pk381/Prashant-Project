const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/login', adminController.getLogin);

router.get('/main', adminController.getAdmin);

module.exports = router;