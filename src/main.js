/* global $, window */
const Apify = require("apify");
const createSearchUrls = require("./createSearchUrls");
const parseSellerDetail = require("./parseSellerDetail");
const parseItemUrls = require("./parseItemUrls");
const parsePaginationUrl = require("./parsePaginationUrl");
const { saveItem, getOriginUrl } = require("./utils");
const SessionsCheerioCrawler = require("./crawler");

// TODO: Add an option to limit number of results for each keyword
Apify.main(async () => {
    // Get queue and enqueue first url.
    const requestQueue = await Apify.openRequestQueue();
    const input = await Apify.getValue("INPUT");
    const env = await Apify.getEnv();
    // based on the input country and keywords, generate the search urls
    const urls = await createSearchUrls(input);
    for (const searchUrl of urls) {
        await requestQueue.addRequest(searchUrl);
    }

    const config = {
        maxConcurrency: input.maxConcurrency || 40,
        maxRequestsPerCrawl: input.maxRequestsPerCrawl || null,
        useApifyProxy: true,
        apifyProxyGroups: input.apifyProxyGroups || null,
        maxRequestRetries: 6,
        handlePageTimeoutSecs: 2.5 * 60 * 1000,
        liveView: input.liveView ? input.liveView : true,
        country: input.country,
        autoscaledPoolOptions: {
            systemStatusOptions: {
                maxEventLoopOverloadedRatio: 0.65,
                maxCpuOverloadedRatio: 0.4,
                maxClientOverloadedRatio: 0.3
            }
        }
    };

    // Create crawler.
    const crawler = new SessionsCheerioCrawler({
        requestQueue,
        ...config,
        maxOpenPagesPerInstance: 5,
        retireInstanceAfterRequestCount: 5,
        handlePageFunction: async ({ $, request }) => {
            const urlOrigin = await getOriginUrl(request);
            const items = await parseItemUrls($, request);
            for (const item of items) {
                console.log(item.detailUrl);

                // await Apify.pushData({
                //     productUrl: item.detailUrl
                // });

                // await requestQueue.addRequest(
                //     {
                //         url: item.url,
                //         userData: {
                //             label: "seller",
                //             keyword: request.userData.keyword,
                //             asin: item.asin,
                //             detailUrl: item.detailUrl,
                //             sellerUrl: item.sellerUrl
                //         }
                //     },
                //     { forefront: true }
                // );
            }
        },

        // If request failed 4 times then this function is executed.
        handleFailedRequestFunction: async ({ request }) => {
            await Apify.pushData({
                status: "Page failed 4 times, check it out, what happened.",
                url: request.url,
                keyword: request.userData.keyword
            });
            console.log(`Request ${request.url} failed 4 times`);
        }
    });

    // Run crawler.
    await crawler.run();
});
