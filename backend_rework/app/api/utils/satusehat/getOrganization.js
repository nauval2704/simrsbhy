require('dotenv').config()
const axios = require('axios');
const fetch = require("node-fetch");

const { getSatusehatToken } = require('../satusehat/generateToken');

const getOrganizationSatusehat = async () => {
    try {

        const token = await getSatusehatToken();
        const organizationId = process.env.ORGANIZATION_ID;
        const baseUrl = process.env.BASE_URL;
        const apiUrl = `${baseUrl}/Organization/${organizationId}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Handle response as needed
        const result = await response.json();
        return result;
    } catch (error) {
        // Log any errors
        throw error; // Handle or propagate the error as needed
    }
};

module.exports = {
    getOrganizationSatusehat
};