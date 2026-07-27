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

async function generateURL(request, response) {
    const { shortCode } = request.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
        return response.status(404).json({
            success: false,
            message: "Short URL not found"
        });
    }

    await Url.updateOne(
        { shortCode },
        {
            $inc: {
                clicks: 1
            }
        }
    );

    console.log(url);
    return response.redirect(url.originalUrl);
}

module.exports = { shortenURL, generateURL };