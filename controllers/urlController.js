const Url = require("../models/Url");
const generateShortCode = require("../utils/generateShortCode");

async function shortenURL(request, response) {
    console.log(request.body)
    const { url } = request.body;

    // Check if URL is provided
    if (!url || url.trim() === "") {
        return response.status(400).json({
            success: false,
            message: "URL is required"
        });
    }

    // Validate URL
    try {
        new URL(url);
    } catch (err) {
        return response.status(400).json({
            success: false,
            message: "Invalid URL"
        });
    }

    const existingURL = await Url.findOne({
        originalUrl: url
    });

    if (existingURL) {
        return response.status(200).json({
            success: true,
            shortUrl: `http://localhost:3000/${existingURL.shortCode}`
        });
    }

    const shortCode = generateShortCode();
    const newURL = await Url.create({
        originalUrl: url,
        shortCode
    });

    return response.status(201).json({
        success: true,
        shortUrl: `http://localhost:3000/${newURL.shortCode}`
    });
}

module.exports = { shortenURL };