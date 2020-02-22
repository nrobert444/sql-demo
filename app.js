require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');

const Client = pg.Client;
const client = new Client(process.env.DATABASE_URL);
client.connect();
// Application Setup
const app = express();
app.use(express.static('public'));
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request\
app.use(express.json()); // enable reading incoming json data
app.use(express.urlencoded({ extended: true }))
// location route

app.get('/api/beers', async (req, res) => {
    try {
        const result = await client.query(`
            SELECT
                b.*,
                s.name as style
            FROM beer b
            JOIN style s
            ON   b.type_id = s.id;
        `);
        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});
// using .post instead of get
app.post('/api/beers', async (req, res) => {
    // using req.body instead of req.params or req.query (which belong to /GET requests)
    try {
        console.log(req.body);
        // make a new cat out of the cat that comes in req.body;
        const result = await client.query(`
            INSERT INTO beer (style_id, name, brewery, style, url, abv, is_season)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `,
        // pass the values in an array so that pg.Client can sanitize them
        [req.body.styleId, req.body.name, req.body.brewery, req.body.style, req.body.url, req.body.abv, req.body.is_season]
        );
        res.json(result.rows[0]); // return just the first result of our query
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});
app.get('/api/beer/:myBeerId', async (req, res) => {
    try {
        const result = await client.query(`
            SELECT *
            FROM beer
            WHERE beer.id=$1`, 
            // the second parameter is an array of values to be SANITIZED then inserted into the query
            // i only know this because of the `pg` docs
        [req.params.myBeerId]);
        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});
module.exports = { app, };