const errorResponse = (res, statusCode, error) => {
    return res.status(statusCode).json({
        error
    });
}

const successResponseWithData = (res, statusCode, data) => {
    return res.status(statusCode).json({
        data
    });
}

module.exports = { errorResponse, successResponseWithData };