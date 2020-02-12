const Apify = require("apify");

function extractInfo($) {
    console.log($());
    const title = $("h1.a-size-large a-spacing-none").text();
    return title;
}

async function parsePrimes($, request) {
    const primes = extractInfo($);
    console.log(primes);
    return primes;
}

module.exports = parsePrimes;
