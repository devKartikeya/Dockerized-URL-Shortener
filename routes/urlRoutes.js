const express = require('express');
const { shortenURL } = require('../controllers/urlController');
const router = express.Router();

router.post("/shorten", function (request, response) {
    shortenURL(request, response);
});

module.exports = router;