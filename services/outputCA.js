const { changeAnalysis } = require('./indicator');
const { successResponseWithData } = require('../utils/response');

const outputCA = (res, values)=> {
    const data = {};
    let sum = 0;
  
    values.forEach(val => {
      const range = val.length;
      const ca = changeAnalysis(val[0].close, val[range-1].close);

      sum += ca;
      data[range] = ca;
    });

    data.avg = sum/values.length

    return successResponseWithData (res, data);
  }

module.exports = { outputCA };