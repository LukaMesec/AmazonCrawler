const Apify = require("apify");

function extractInfo($) {}

async function parsePrimes($, request) {
    console.log(request);
    return request;
}

module.exports = parsePrimes;
