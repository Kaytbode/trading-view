const TradingView = require('@mathieuc/tradingview');
const { createChart } = require('../services/chart');
const { loginUser } = require('../services/auth');
const { createChartPromise } = require('../services/helper');
const {  outputCA } = require('../services/outputCA');
const { errorResponse } = require('../utils/response');
const { regexAsset, regexRange } = require('../utils/regex');

const getAssetDataMinutes = async (req, res) => {
  const { asset } = req.params;
  const { range } = req.query;
  const rangePromise = [];

  if (!regexAsset.test(asset)) {
    errorResponse(res, 'Invalid Asset');
  }

  const sessionId = await loginUser().catch(err=> {
    errorResponse(res, err);
  });
  
  const client = new TradingView.Client({
    token: sessionId
  });

  range.forEach(val => {
    if (!regexRange.test(val)) {
      errorResponse(res, 'Invalid range');
    }

    const chart = createChart('1', asset, +val, client);

    const data = createChartPromise(chart);

    rangePromise.push(data);
  });
  
  Promise.all(rangePromise).then((values) => {
    outputCA(res, values);
  }).catch(err=> errorResponse(res, err));
}

module.exports = { getAssetDataMinutes };