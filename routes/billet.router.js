const express = require('express');
const router = express.Router();

const {
  getOneBillet,
  openBillet,
  closeBillet,
} = require('../controllers/billet.controller');

router.get('/getOneBillet/:id', getOneBillet);

router.post('/openBillet', openBillet);

router.post('/closeBillet', closeBillet);

module.exports = router;
