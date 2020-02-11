/* global $ */
const parsePrice = require("parse-price");
const queryString = require("query-string");
const parseUrl = require("url-parse");
const { getCurrency } = require("./utils.js");

function extractInfo($) {
    const h1 = $("h1");
    const images = $("div#olpProductImage img");
    return {
        title: h1.length !== 0 ? h1.text().trim() : null,
        image:
            images.length !== 0
                ? images.attr("src").replace("_SS160_.", "")
                : null
    };
}

function buildSellerUrl(url) {
    const parsedUrl = queryString.parseUrl(url);
    return `${parsedUrl.url}/?seller=${parsedUrl.query.seller}`;
}

function extractSellers($) {
    const sellers = [];
    const title = $("#productTitle");
    sellers.push({
        title
    });

    return sellers;
}

// to in a way to make sense what they are doing, so this one should be
// called parseSellerDetails
async function parseSellerDetail($, request) {
    const sellers = await extractSellers($, request);
    const item = await extractInfo($);
    const currency = await getCurrency(request);

    if (request.userData.sellers) {
        item.sellers = request.userData.sellers.concat(sellers);
    } else {
        item.sellers = sellers;
    }
    const { keyword, asin, detailUrl, sellerUrl, country } = request.userData;
    item.keyword = keyword;
    item.asin = asin;
    item.itemDetailUrl = detailUrl;
    item.sellerOffersUrl = sellerUrl;
    item.country = country;
    item.currency = currency;
    if (item.title === null) {
        item.status = "This ASIN is not available for this country.";
    }
    return item;
}

module.exports = parseSellerDetail;
