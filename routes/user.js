const express = require('express');
const userController = require('../controllers/user');

const authentication = require('../middelware/auth');

const router = express.Router();

router.post('/sign_up', userController.postSignUp);

router.get('/my-team', userController.myTeam);

router.post('/login', userController.postLogin);

router.get('/sign_up', userController.getSignUpPage);

router.post('/change-password', authentication.authanticate, userController.changePassword);

router.get('/get-info', authentication.authanticate, userController.getInfo);

router.get('/image/:userId', userController.getImage);

router.post('/image', authentication.authanticate, userController.uploadImage);

router.post('/upgrade', authentication.authanticate, userController.upgradePlan);

module.exports = router;