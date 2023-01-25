const errorResponse = (res, statusCode, error) => {
    res.status(statusCode).json({
        error
    });
}

const successResponseWithData = (res, statusCode, data) => {
    res.status(statusCode).json({
        data
    });
}

module.exports = { errorResponse, successResponseWithData };