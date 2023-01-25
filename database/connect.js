const { Pool } = require('pg');
require('dotenv').config();

const { TRDVIEWPGHOST, TRDVIEWPGPORT, TRDVIEWPGUSER, TRDVIEWPGPW, TRDVIEWPGDB } = process.env;

const pool = new Pool({
    host: TRDVIEWPGHOST,
    port: TRDVIEWPGPORT,
    user: TRDVIEWPGUSER,
    password: TRDVIEWPGPW,
    database: TRDVIEWPGDB
});

module.exports = { pool };