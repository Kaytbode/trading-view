const { helkinAshi, momentum } = require('./indicator');
const { successResponseWithData } = require('../utils/response');
const { statusCodes } = require('../utils/status');

const calculateHAandMomentumOutput = (pArr) => {
  const p = pArr[0];
  const p1 = pArr[1];
  const p19 = pArr[19];

  const { hOpen, hClose } = helkinAshi(p, p1);
  const mom = momentum(p.close, p19.close);

  let output, color;

  if ((hClose > hOpen) && (mom > 0)) {
    output = 2;
    color = 'green';
  }
  else if (((hClose > hOpen) && (mom == 0)) || ((hClose < hOpen) && (mom > 0))) {
    output = 1;
    color = 'light-green';
  }
  else if (((hClose < hOpen) && (mom == 0)) || ((hClose > hOpen) && (mom < 0))) {
    output = -1;
    color = 'light-red';
  }
  else {
    output = -2;
    color = 'red';
  }

  return { output, color };
}

const HAandMomentumOutputs = (res, values, tf)=> {
    const data = {};
    
    values.forEach((val, idx)=> {
      const output = calculateHAandMomentumOutput(val);

      data[tf[idx]] = output;
    });

    data.price = values[0][0].close;
    
    successResponseWithData (res, statusCodes.success, data);
}

module.exports = { HAandMomentumOutputs, calculateHAandMomentumOutput };