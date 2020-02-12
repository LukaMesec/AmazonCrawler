/* global $ */
const parsePrice = require("parse-price");
const queryString = require("query-string");
const parsePrimes = require("./parsePrimes.js");
const parseUrl = require("url-parse");
const { getCurrency } = require("./utils.js");
const Apify = require("apify");

function extractInfo($) {
    const description = String(
        $("div#productDescription")
            .text()
            .replace(/\r?\n|\r/g, "")
    )
        .trim()
        .replace(/\t/g, "");
    const title = String($("span#productTitle").text()).trim();

    const price = String(
        $("span.a-color-price")
            .first()
            .text()
            .replace(/\r?\n|\r/g, "")
    ).trim();
    // const picUrl = $("li.a-align-center sims-fbt-image-1");

    // const technicalDetails = $("div.attrG").text()
    const itemWeight = $("tr.size-weight")
        .first()
        .text()
        .replace(/\w{3}/g, "");
    const itemDimensions = $("tr.size-weight:nth-of-type(2)")
        .text()
        .replace(/\w{3}/g, "");

    // .replace(/[0-9]{2,}/g, " " + /[0-9]{2,}/g)
    // .replace(/[A-Z]/g, " " + /[A-Z]/g);
    const modelNumber = $("tr.item-model-number")
        .text()
        .replace(/[A-z]+/g, "");
    // const productImg=$("div#ivLargeImage")
    // console.log(description, title);
    // const h1 = $("h1");
    // const images = $("div#olpProductImage img");
    return {
        title,
        price,
        description,
        itemWeight,
        itemDimensions,
        modelNumber
        // title: h1.length !== 0 ? h1.text().trim() : null,
        // image:
        //     images.length !== 0
        //         ? images.attr("src").replace("_SS160_.", "")
        //         : null
    };
}
async function offerDetails($, request) {
    const requestQueue = await Apify.openRequestQueue();
    console.log(request);
    return request;
    // const req1 = await requestQueue.addRequest(
    //     {
    //         url: String(request.userData.sellerUrl)
    //     },
    //     { forefront: true }
    // );
    // const primes = await parsePrimes($, req1);
    // item.primes = primes;
}

// function extractMoreInfro($) {
//     const description = $("div#productDescription")
//         .text()
//         .replace(/\r?\n|\r/g, "")
//         .replace("\t", "");
//     const title = $("span#productTitle")
//         .text()
//         .replace(/\r?\n|\r/g, "")
//         .replace("\t", "");
//     return {
//         description,
//         title
//     };
// }

// function buildSellerUrl(url1) {
//     const parsedUrl = queryString.parseUrl(url);
//     return `${parsedUrl.url}/?seller=${parsedUrl.query.seller}`;
// }

async function extractSellers($, request) {
    return $;
    // console.log(request);
    // const sellers = [];
    // console.log(request);
    // const hostName = parseUrl(request.url).hostname;
    // $("div.olpOffer").each(function() {
    //     const priceElem = $(this).find("span.olpOfferPrice");
    //     const sellerNameEle = $(this).find("h3.olpSellerName img");
    //     let price;
    //     let priceParsed = null;
    //     if (priceElem.length !== 0) {
    //         price = priceElem
    //             .text()
    //             .trim()
    //             .replace("Rs.", "Rs");
    //         priceParsed = parsePrice(price);
    //     } else {
    //         price = "price not displayed";
    //     }
    //     let shippingInfo;
    //     let condition;
    //     const sellerName =
    //         sellerNameEle.length !== 0
    //             ? sellerNameEle.attr("alt")
    //             : $(this)
    //                   .find("h3.olpSellerName")
    //                   .text()
    //                   .trim();
    //     const sellerShopUrl =
    //         sellerNameEle.length !== 0
    //             ? hostName
    //             : $(this).find("h3.olpSellerName a").length !== 0
    //             ? buildSellerUrl(
    //                   `${hostName}${$(this)
    //                       .find("h3.olpSellerName a")
    //                       .attr("href")}`
    //               )
    //             : null;
    //     let prime = false;
    //     if ($(this).find("a:contains('Fulfillment by Amazon')").length !== 0) {
    //         prime = true;
    //     } else if ($(this).find("i.a-icon-prime").length !== 0) {
    //         prime = true;
    //     } else if (sellerName === "Amazon.com") {
    //         prime = true;
    //     }
    //     const offerConditionEle = $(this).find("div#offerCondition");
    //     const olpConditionEle = $(this).find("span.olpCondition");
    //     if (offerConditionEle.length !== 0) {
    //         condition = offerConditionEle
    //             .text()
    //             .replace(/\s\s+/g, " ")
    //             .trim();
    //     } else if (olpConditionEle.length !== 0) {
    //         condition = olpConditionEle
    //             .text()
    //             .replace(/\s\s+/g, " ")
    //             .trim();
    //     } else {
    //         condition = "condition unknown";
    //     }
    //     const olpShippingInfoEle = $(this).find("p.olpShippingInfo ");
    //     if (olpShippingInfoEle.length !== 0) {
    //         shippingInfo = olpShippingInfoEle
    //             .text()
    //             .replace(/\s\s+/g, " ")
    //             .trim();
    //     } else if (
    //         $("div.olpPriceColumn:contains('FREE Shipping')").length !== 0
    //     ) {
    //         shippingInfo = "& eligible for FREE Shipping";
    //     } else {
    //         shippingInfo = "shipping info not included";
    //     }
    //     sellers.push({
    //         price,
    //         priceParsed,
    //         condition,
    //         sellerName,
    //         prime,
    //         shippingInfo,
    //         shopUrl: sellerShopUrl
    //     });
    // });
    // return sellers;
    // return request;
}

// to in a way to make sense what they are doing, so this one should be
// called parseSellerDetails
async function parseSellerDetail($, request) {
    const sellerDetailsUrl = String(request.url).replace(
        "/dp/",
        "/gp/offer-listing/"
    );
    const item = await extractInfo($);
    const offerDetails1 = await offerDetails($, request);

    // request.url = sellerDetailsUrl;
    // request.loadedUrl = sellerDetailsUrl;
    // request.uniqueKey = sellerDetailsUrl;
    // const sellers = await extractSellers($, request);
    // console.log(sellers);
    // const qu1 = await requestQueue.addRequest({
    //     url: String(request.userData.sellerUrl)
    // });
    // const reults1 = await extractSellers($, qu1);
    // console.log(reults1);
    item.productUrl = request.url;
    return item;
}

module.exports = parseSellerDetail;
