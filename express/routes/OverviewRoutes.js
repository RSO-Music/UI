const express = require('express');
const router = express.Router();
const OverviewController = require('../controllers/OverviewController.js');

router.get('/', OverviewController.getOverviewForUser);


module.exports = router;
