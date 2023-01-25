const createChart = (tf, asset, range, client) => {
    const chart = new client.Session.Chart();
  
    chart.setMarket(asset, {
      timeframe: tf,
      range: range,
      to: Math.floor(Date.now()/1000)
    });
  
    return chart;
}

module.exports = { createChart };