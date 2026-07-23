require('dotenv').config()
const fetch = require("node-fetch");

let cachedToken = null; // Store the cached token
let tokenExpirationTime = 0; // Store the expiration timestamp

const getSatusehatToken = async () => {
    try {
        const currentTime = Date.now();

        // Check if token is cached and not expired
        if (cachedToken && currentTime < tokenExpirationTime) {
            return cachedToken; // Return cached token
        }

        const clientId = process.env.CLIENT_KEY;
        const clientSecret = process.env.SECRET_KEY;
        const url = process.env.AUTH_URL + '/accesstoken?grant_type=client_credentials';

        const response = await fetch(url, {
            method: 'POST',
            body: `client_id=${clientId}&client_secret=${clientSecret}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Update cached token and expiration time
        cachedToken = data.access_token;
        tokenExpirationTime = currentTime + (15 * 60 * 1000); // 15 minutes in milliseconds

        return cachedToken;

    } catch (error) {
        throw new Error('Failed to get SATUSEHAT token: ' + error.message);
    }
};

module.exports = { getSatusehatToken };