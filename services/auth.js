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

(async () => {
    const text = 'UPDATE session SET token = $1 WHERE id = 1';

    try {
        const token = await loginUser();
        await pool.query(text, [token]);
    } catch (error) {
        console.log(error);
    }
})();
