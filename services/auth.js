const TradingView = require('@mathieuc/tradingview');
require('dotenv').config();

function loginUser () {
  const { TRADINGVIEW_USERNAME, TRADINGVIEW_PASSWORD } = process.env;
  
  return new Promise((resolve, reject) => {
    TradingView.loginUser(TRADINGVIEW_USERNAME, TRADINGVIEW_PASSWORD, false)
    .then(user => resolve(user.session))
    .catch(err => reject(err));
  });
}

module.exports = { loginUser };