require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');
console.log(process.env);
const Client = pg.Client;
const client = new Client(process.env.DATABASE_URL);
client.connect();
const app = express();

app.use(morgan('dev'));
app.use(cors()); 
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
