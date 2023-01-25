const { pool } = require('../database/connect');
const TradingView = require('@mathieuc/tradingview');
const { createChart } = require('../services/chart');
const { loginUser } = require('../services/auth');
const { createChartPromise, calculateScorePandS, 
        compareAB, compareABu, compareBBu, compareBB, calculateShift } = require('../services/helper');
const { calculateHAandMomentumOutput } = require('../services/output');
const { changeAnalysis } = require('../services/indicator');
const { errorResponse, successResponseWithData } = require('../utils/response');
const { statusCodes } = require('../utils/status');
const { regexAsset, regexTF, regexRange } = require('../utils/regex');

const addAsset = async (req, res) => {
    const { asset } = req.params;

    const text = 'INSERT INTO watchlist(asset) VALUES($1) RETURNING *';
    const values = [asset];

    try {
        await pool.query(text, values);
        successResponseWithData(res, statusCodes.success, `${asset} successfully added to watchlist`)
    } catch (error) {
        errorResponse(res, statusCodes.serverError, error.stack);
    }
}

const removeAsset = async (req, res) => {
    const { asset } = req.params;

    const text = 'DELETE FROM watchlist WHERE asset = ($1) RETURNING *';
    const values = [asset];

    try {
        await pool.query(text, values);
        successResponseWithData(res, statusCodes.success, `${asset} successfully removed from watchlist`)
    } catch (error) {
        errorResponse(res, statusCodes.serverError, error.stack);
    }
}

const getAllAssets = async (req, res) => {
    const { pulse, shift, wltf } = req.query;
    const { sort } = req.params;

    const text = 'SELECT asset FROM watchlist';

    const data = [];

    
    const { rows } = await pool.query(text).catch(err=> {
        errorResponse(res, statusCodes.serverError, err.stack);
    });

    const assets = rows.map(({asset})=> asset);

    const sessionId = await loginUser().catch(err=> {
        errorResponse(res, statusCodes.unauthorized, err);
    });

    const client = new TradingView.Client({
        token: sessionId
    });

    
    assets.forEach(async (asset, idx, arr) => {
        if (!regexAsset.test(asset)) {
            errorResponse(res, statusCodes.unprocessableEntity, `${asset} Invalid Asset`);
        }
        //calculate the pulse 
        const tfPromise = [];

        const storeData = {name: asset};

        pulse.forEach(tf => {
            if (!regexTF.test(tf)) {
                errorResponse(res, statusCodes.unprocessableEntity, `${tf} Invalid Timeframe`);
            }
        
            const chart = createChart(tf, asset, 20, client);
        
            const chartP = createChartPromise(chart);
        
            tfPromise.push(chartP);
        });

        const pulseValues = await Promise.all(tfPromise).catch(err=> {
            errorResponse(res, statusCodes.unprocessableEntity, err)
        });

        let pulseValue = 0;

        pulseValues.every(val => {
            const { output } = calculateHAandMomentumOutput(val);

            if (output < 0 && pulseValue < 0) {
                pulseValue = -2;
            }
            else if (output > 0 && pulseValue > 0) {
                pulseValue = 2;
            }
            else if (pulseValue == 0) {
                pulseValue = output;
            }
            else {
                pulseValue = 0;
                return false;
            }
            
            return true;
        });
        
        storeData.p = pulseValue;

        // calculate the shift
        const rangePromise = [], keepShift = [];
        let shiftValue = 0, sum = 0;


        shift.forEach(range => {
            if (!regexRange.test(range)) {
                errorResponse(res, statusCodes.unprocessableEntity, `${range} Invalid range`);
            }
        
            const chart = createChart('1', asset, +range, client);
        
            const chartP = createChartPromise(chart);
        
            rangePromise.push(chartP);
        });

        const shiftValues = await Promise.all(rangePromise).catch(err=> {
            errorResponse(res, statusCodes.unprocessableEntity, err)
        });

        shiftValues.forEach(val=> {
            const range = val.length;

            const ca = changeAnalysis(val[0].close, val[range-1].close);

            keepShift.push(ca);

            sum += ca;
        });

        storeData.s = calculateShift(keepShift);
        storeData.avg = sum/(shiftValues.length);

        storeData.score = calculateScorePandS(pulseValue, shiftValue);

        // calculate watchlist change analysis timeframe
        let wlCA;

        if (wltf) {
            const wlchart = createChart('1', asset, +wltf, client);

            const chartwl = createChartPromise(wlchart);

            const wlValues = await Promise.all([chartwl]).catch(err=> {
                errorResponse(res, statusCodes.unprocessableEntity, err)
            });

            const wlist = wlValues[0];

            const wlRange = wlist.length;

            wlCA = changeAnalysis(wlist[0].close, wlist[wlRange-1].close);
        }

        storeData.wltf = wlCA || storeData.avg;

        data.push(storeData);
    
        if (idx === (arr.length - 1)){
            setTimeout(() => {
                switch(sort) {
                    case '1':
                        data.sort(compareABu);
                        break;
                    case '2':
                        data.sort(compareAB);
                        break;
                    case '3':
                        data.sort(compareBBu);
                        break;
                    case '4':
                        data.sort(compareBB);
                        break;
                }
                successResponseWithData(res, statusCodes.success, data);
            }, 1000);
        }
    });
}

module.exports = { addAsset, removeAsset, getAllAssets };