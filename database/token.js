const { pool } = require('./connect');
const { errorResponse } = require('../utils/response');

const getToken = async (res, status) => {
    const text = 'SELECT token FROM session WHERE id = 1';

    const { rows } = await pool.query(text).catch(err=> {
      errorResponse(res, status, err.stack);
    });

    const { token } = rows[0];

    return token;
}

module.exports = { getToken };