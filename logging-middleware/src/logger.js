const axios = require("axios");

const BASE_URL = "http://4.224.186.213/evaluation-service";

let accessToken = "";

// Bearer Token Set Karne Ke Liye
function setAccessToken(token) {
    accessToken = token;
}

// Logging Function
async function Log(stack, level, packageName, message) {
    try {
        const response = await axios.post(
            `${BASE_URL}/logs`,
            {
                stack: stack,
                level: level,
                package: packageName,
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Log Created Successfully");
        return response.data;

    } catch (error) {
        console.log(error.response?.data || error.message);
    }
}

module.exports = {
    Log,
    setAccessToken
};