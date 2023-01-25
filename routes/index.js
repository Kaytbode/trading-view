const express = require('express');
const { getData } = require('../controller/getAssetData');
const { getAssetDataMinutes } = require('../controller/changeAnalysis');
const { addAsset, removeAsset, getAllAssets } = require('../controller/watchlist');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('Welcome to BE GREAT FINANCE')
});

router.get('/api/ham/:asset', getData);

router.get('/api/ca/:asset', getAssetDataMinutes);

router.post('/api/watchlist/:asset', addAsset);

router.delete('/api/watchlist/:asset', removeAsset);

router.get('/api/watchlist/:sort', getAllAssets);

module.exports = router;