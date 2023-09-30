const express = require('express');
const mainController = require('../controllers/main');

const authantication = require('../middelware/auth');

const router = express.Router();

router.get('/', mainController.getMain);

router.get('/wallet', mainController.getWallet);

router.get('/earning', authantication.authanticate, mainController.getEarnings);

router.get('/wallet-info', authantication.authanticate, mainController.getWalletInfo)

router.get('/members', authantication.authanticate, mainController.getMembers);

router.get('/widthdrawl-history', authantication.authanticate, mainController.widthdrawlHistory)

router.post('/widthdrawl-request', authantication.authanticate, mainController.widthdrawlRequest);

router.post('/joining-request', authantication.authanticate, mainController.joiningRequest);

router.get('/get-image', mainController.getImage);



module.exports = router;