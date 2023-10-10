const express = require('express');
const adminController = require('../controllers/admin');

const authentication = require('../middelware/auth');

const router = express.Router();

router.get('/', adminController.getLogin);
router.post('/login', adminController.postLogin);

router.get('/main', adminController.getMain);

router.get('/search-and-update', adminController.getSearch);

router.get('/request', adminController.requestPage);

router.get('/joining-requests', adminController.joiningRequests);
router.get('/widthdrawl-requests', adminController.widthdrawlRequests);

router.put('/widthdrawl-request', adminController.updateWidthdrawlRequest);
router.put('/joining-request', adminController.updateJoiningRequest);


router.get('/tree', adminController.getTreePage);
router.get('/tree-data/:nodeId',adminController.getTree);

router.get('/company-info', authentication.authanticate, adminController.getInfo);
router.get('/members-info', authentication.authanticate, adminController.getMemberInfo);

router.post('/search-users', authentication.authanticate, adminController.searchUsers);
router.post('/update-user', authentication.authanticate, adminController.updateUser);


module.exports = router;