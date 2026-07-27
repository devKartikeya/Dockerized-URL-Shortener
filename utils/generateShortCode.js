const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateShortCode(length = 6) {
  let shortCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
    shortCode += CHARACTERS[randomIndex];
  }

  return shortCode;
}

module.exports = generateShortCode;