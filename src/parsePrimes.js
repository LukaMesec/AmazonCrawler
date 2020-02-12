const Apify = require("apify");

function extractInfo($) {
    console.log($());
}

async function parsePrimes($, request) {
    const primes = extractInfo($);
    console.log(primes);
}

module.exports = parsePrimes;
