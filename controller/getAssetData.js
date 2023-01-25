const TradingView = require('@mathieuc/tradingview');
const { createChart } = require('../services/chart');
const { loginUser } = require('../services/auth');
const { createChartPromise } = require('../services/helper');
const { HAandMomentumOutputs } = require('../services/output');
const { errorResponse } = require('../utils/response');
const { regexAsset, regexTF } = require('../utils/regex');

const getData = async (req, res) => {
    const { asset } = req.params;
    const { tf } = req.query;
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

    tf.forEach(val => {
      if (!regexTF.test(val)) {
        errorResponse(res, 'Invalid Timeframe');
      }

      const chart = createChart(val, asset, 20, client);
  
      const data = createChartPromise(chart);
  
      rangePromise.push(data);
    });
    
    Promise.all(rangePromise).then((values) => {
      HAandMomentumOutputs(res, values, tf);
    }).catch(err=> errorResponse(res, err));
}

module.exports = { getData };