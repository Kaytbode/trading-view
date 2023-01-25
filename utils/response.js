const errorResponse = (res, statusCode, error) => {
    return res.status(statusCode).send({
        error
    });
}

const successResponseWithData = (res, statusCode, data) => {
    return res.status(statusCode).send({
        data
    });
}

module.exports = { errorResponse, successResponseWithData };