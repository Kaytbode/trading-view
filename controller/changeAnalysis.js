const TradingView = require('@mathieuc/tradingview');
const { createChart } = require('../services/chart');
const { getToken } = require('../database/token');
const { createChartPromise } = require('../services/helper');
const {  outputCA } = require('../services/outputCA');
const { errorResponse } = require('../utils/response');
const { statusCodes } = require('../utils/status');
const { regexAsset, regexRange } = require('../utils/regex');

const getAssetDataMinutes = async (req, res) => {
  const { asset } = req.params;
  const { range } = req.query;
  const rangePromise = [];

  if (!regexAsset.test(asset)) {
    errorResponse(res, statusCodes.unprocessableEntity, 'Invalid Asset');
  }

  const token = await getToken(res, statusCodes.unprocessableEntity);
  
  const client = new TradingView.Client({
    token
  });

  range.forEach(val => {
    if (!regexRange.test(val)) {
      errorResponse(res, statusCodes.unprocessableEntity, 'Invalid range');
    }

    const chart = createChart('1', asset, +val, client);

    const data = createChartPromise(chart);

    rangePromise.push(data);
  });

  const values = await Promise.all(rangePromise).catch(err =>{
    errorResponse(res, statusCodes.unprocessableEntity, err);
  })

  outputCA(res, values);
}

module.exports = { getAssetDataMinutes };