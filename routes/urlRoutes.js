const express = require('express');
const { shortenURL, generateURL } = require('../controllers/urlController');
const router = express.Router();

router.post("/shorten", function (request, response) {
    shortenURL(request, response);
});

router.get("/:shortCode", function(request, response){
    generateURL(request, response);
})

module.exports = router;