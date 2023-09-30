const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/login', adminController.getLogin);

router.post('/login', adminController.postLogin);

router.get('/main', adminController.getMain);

router.get('/request', adminController.requestPage);

router.get('/requests', adminController.requests);

router.put('/request', adminController.updateRequest);

router.get('/tree', adminController.getTreePage);

router.get('/tree-data/:nodeId',adminController.getTree);

router.get('/company-info', adminController.getInfo);

router.get('/members-info', adminController.getMemberInfo);


module.exports = router;