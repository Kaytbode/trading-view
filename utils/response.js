const errorResponse = (res, error) => {
    return res.send({
        error
    });
}

const successResponseWithData = (res, data) => {
    return res.send({
        data
    });
}

module.exports = { errorResponse, successResponseWithData };