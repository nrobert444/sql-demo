require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');
console.log(process.env);
// Database Client
const Client = pg.Client;
const client = new Client(process.env.DATABASE_URL);
client.connect();
// Application Setup
const app = express();
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request
// location route
app.get('/api/beers', async(req, res) => {
    try {
        const result = await client.query(`SELECT * FROM beer;`);
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});
module.exports = { app, };
