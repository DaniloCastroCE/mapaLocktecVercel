const express = require('express');
const router = express.Router();
const {home} = require('../controller/routers/get.js')

router.get('/', home)

module.exports = router