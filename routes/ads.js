// routes/ads.js
const express = require('express');
const router = express.Router();
const adsService = require('../services/adsService');

router.get('/', adsService.getAds);
router.post('/', adsService.createAd);
router.put('/:adId/impressions', adsService.updateImpressions);
router.put('/:adId/budget', adsService.updateBudget);
router.get('/serve', adsService.serveAds); // Route for serving ads to end users
router.get('/:adId', adsService.serveAd); // Route for serving a single ad to end users
router.post('/request', adsService.requestAd); // New route for requesting to publish ads

module.exports = router;

