function createChartPromise (chart) {
    return new Promise((resolve, reject) => {
        chart.onUpdate(()=> resolve(chart.periods));
        chart.onError((...err)=> reject(err));
    });
}

const calculateShift = arr => {
    let positive, negative, value;

    const isBelowThreshold = (currentValue) => currentValue < 0;
    const isAboveThreshold = (currentValue) => currentValue > 0;

    negative = arr.every(isBelowThreshold);
    positive = arr.every(isAboveThreshold);

    if (negative) value = -2;
    else if (positive) value = 2;
    else value = 0;

    return value;
};

const calculateScorePandS = (pulse, shift)=> {
    let score = 0;
    if(pulse == 2 && shift == 2) {
        score = 3;
    }
    else if(pulse == 2 && shift == 0) {
        score = 2;
    }
    else if(pulse == 0 && shift == 2) {
        score = 1;
    }
    else if((pulse == 0 && shift == 0) 
           || (pulse == 2 && shift == -2)
           || (pulse == -2 && shift == 2)) {
        score = 0;
    }
    else if(pulse == 0 && shift == -2) {
        score = -1;
    }
    else if(pulse == -2 && shift == 0) {
        score = -2;
    }
    else if(pulse == -2 && shift == -2) {
        score = -3;
    }

    return score;
}

const compareAB = (a, b) => {
    if (a.score < b.score ) return -1;
    if (a.score > b.score ) return 1;
    if (a.score === b.score) {
       if (a.wltf > b.wltf) return 1;
       if (a.wltf < b.wltf) return -1;
       return 0;
    }
}

const compareABu = (a, b) => {
    if (a.score < b.score ) return 1;
    if (a.score > b.score ) return -1;
    if (a.score === b.score) {
       if (a.wltf > b.wltf) return -1;
       if (a.wltf < b.wltf) return 1;
       return 0;
    }
}

const compareBBu = (a, b) => {
    const absA = Math.abs(a.score);
    const absB = Math.abs(b.score);
    if (absA < absB) {
        return 1;
    }
    if (absA > absB) {
        return -1;
    }
    if (absA === absB) {
        if (a.score < b.score ) return 1;
        if (a.score > b.score ) return -1;
        if(a.score === b.score){
            if (a.score >= 0) {
                if (a.wltf > b.wltf) return -1;
                if (a.wltf < b.wltf) return 1;
            }
            if (a.score < 0) {
                if (a.wltf > b.wltf) return 1;
                if (a.wltf < b.wltf) return -1;
            }
            if (a.score == 0) {
                const aW = Math.abs(a.wltf);
                const bW = Math.abs(b.wltf);
                if (aW > bW) return -1;
                if (aW < bW) return 1;
            }
        }
       return 0;
    }
}

const compareBB = (a, b) => {
    const absA = Math.abs(a.score);
    const absB = Math.abs(b.score);
    if (absA < absB) {
        return 1;
    }
    if (absA > absB) {
        return -1;
    }
    if (absA === absB) {
        if (a.score < b.score ) return -1;
        if (a.score > b.score ) return 1;
        if(a.score === b.score){
            if (a.score > 0) {
                if (a.wltf > b.wltf) return -1;
                if (a.wltf < b.wltf) return 1;
            }
            if (a.score < 0) {
                if (a.wltf > b.wltf) return 1;
                if (a.wltf < b.wltf) return -1;
            }
            if (a.score == 0) {
                const aW = Math.abs(a.wltf);
                const bW = Math.abs(b.wltf);
                if (aW > bW) return -1;
                if (aW < bW) return 1;
            }
        }
       return 0;
    }
}

module.exports = { createChartPromise, calculateScorePandS, calculateShift,
                   compareAB, compareABu, compareBBu, compareBB };