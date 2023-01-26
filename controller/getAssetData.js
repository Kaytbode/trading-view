const TradingView = require('@mathieuc/tradingview');
const { pool } = require('../database/connect');
const { createChart } = require('../services/chart');
const { loginUser, token } = require('../services/auth');
const { createChartPromise } = require('../services/helper');
const { HAandMomentumOutputs } = require('../services/output');
const { errorResponse } = require('../utils/response');
const { statusCodes } = require('../utils/status');
const { regexAsset, regexTF } = require('../utils/regex');

const getData = async (req, res) => {
    const { asset } = req.params;
    const { tf } = req.query;
    const rangePromise = [];

    if (!regexAsset.test(asset)) {
      errorResponse(res, statusCodes.unprocessableEntity, 'Invalid Asset');
    }

    const text = 'SELECT token FROM session WHERE id = 1';

    const { rows } = await pool.query(text).catch(err=> {
      errorResponse(res, statusCodes.serverError, err.stack);
    });

    const { token } = rows[0];
    // console.log(token);
   // const sessionId = await loginUser();

    const client = new TradingView.Client({
       token
    });

    tf.forEach(val => {
      if (!regexTF.test(val)) {
        errorResponse(res, statusCodes.unprocessableEntity, 'Invalid Timeframe');
      }

      const chart = createChart(val, asset, 20, client);
  
      const data = createChartPromise(chart);
  
      rangePromise.push(data);
    });
    
    const values = await Promise.all(rangePromise).catch(err =>{
      errorResponse(res, statusCodes.unprocessableEntity, err);
    })

    return HAandMomentumOutputs(res, values, tf);
}

module.exports = { getData };