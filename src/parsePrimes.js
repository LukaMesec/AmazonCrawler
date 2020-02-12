const Apify = require("apify");

function extractInfo($) {}

async function parsePrimes($, request) {
    const primes = extractInfo($);
    console.log(request);
}

module.exports = parsePrimes;
