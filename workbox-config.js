module.exports = {
  "globDirectory": "dist/open-voice-factory/",
  "globPatterns": [
    "manifest.json",
    "index.html",
    "*.js",
    "*.css",
    "assets/**/*.png"
  ],
  "dontCacheBustUrlsMatching": new RegExp('.+\.[a-f0-9]{20}\..+'),
  "maximumFileSizeToCacheInBytes": 5000000,
  "swSrc": "src/service-worker.js",
  "swDest": "dist/open-voice-factory/service-worker.js"
};
