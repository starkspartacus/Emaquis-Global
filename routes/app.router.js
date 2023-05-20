const express = require('express');
const { getAppConfig } = require('../controllers/app_config.controller');
const router = express.Router();

router.get('/config', getAppConfig);

module.exports = router;
