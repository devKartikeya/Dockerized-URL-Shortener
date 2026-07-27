const express = require('express');
const { shortenURL, generateURL } = require('../controllers/urlController');
const router = express.Router();

/* POST API for shorten the url */
router.post("/shorten", function (request, response) {
    shortenURL(request, response);
});

/* GET API to redirect user to the correct url */
router.get("/:shortCode", function(request, response){
    generateURL(request, response);
})

module.exports = router;