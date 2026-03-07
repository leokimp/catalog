/**
 * HDHub4u — Nuvio proxy scraper
 * All scraping is delegated to the Cloudflare Worker.
 * Nuvio calls getStreams() locally; this file just forwards
 * the call and returns the result.
 *
 * ⚠️  Replace WORKER_URL with your actual CF Worker URL.
 */

var hdhub4u_exports = {};

var WORKER_URL = "https://hdhub4u.YOUR-SUBDOMAIN.workers.dev";

function getStreams(tmdbId, mediaType, season, episode) {
  return new Promise(function (resolve) {
    var params = new URLSearchParams({ tmdbId: tmdbId, type: mediaType });
    if (season  && season  !== "null") params.set("season",  season);
    if (episode && episode !== "null") params.set("episode", episode);

    var url = WORKER_URL + "/streams?" + params.toString();
    console.log("[Proxy] Calling CF Worker:", url);

    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var streams = data.streams || [];
        console.log("[Proxy] Received", streams.length, "streams from CF Worker");
        resolve(streams);
      })
      .catch(function (err) {
        console.error("[Proxy] CF Worker call failed:", err.message);
        resolve([]);
      });
  });
}

hdhub4u_exports.getStreams = getStreams;
module.exports = hdhub4u_exports;
