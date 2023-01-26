const TradingView = require('@mathieuc/tradingview');
const { pool } = require('../database/connect');
require('dotenv').config();

function loginUser () {
  const { TRADINGVIEW_USERNAME, TRADINGVIEW_PASSWORD } = process.env;
  
  return new Promise((resolve, reject) => {
    TradingView.loginUser(TRADINGVIEW_USERNAME, TRADINGVIEW_PASSWORD, false)
    .then(user => resolve(user.session))
    .catch(err => reject(err));
  });
}

/*const { TRADINGVIEW_USERNAME, TRADINGVIEW_PASSWORD } = process.env;
const text = 'INSERT INTO watchlist(asset) VALUES($1) RETURNING *';

TradingView
  .loginUser(TRADINGVIEW_USERNAME, TRADINGVIEW_PASSWORD, false)
  .then(user => {
      pool.query(text, user.session);
  })
  .catch(err => reject(err));

  

    try {
        await pool.query(text, values);
        successResponseWithData(res, statusCodes.success, `${asset} successfully added to watchlist`)
    } catch (error) {
        errorResponse(res, statusCodes.serverError, error.stack);
    }*/
(async () => {
    const text = 'UPDATE session SET token = $1 WHERE id = 1';

    try {
        const token = await loginUser();
        console.log(token);
        await pool.query(text, [token]);
        // successResponseWithData(res, statusCodes.success, `${token} successfully added to user`)
    } catch (error) {
        console.log(error);
        //errorResponse(res, statusCodes.serverError, error.stack);
    }
})();

// module.exports = { loginUser };