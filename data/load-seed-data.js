require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
const beers = require('./beers.js');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();

        await Promise.all(
            beers.map(beer => {

                return client.query(`
                    INSERT INTO beer (name, brewery, style, url, abv, is_season)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
                
                [beer.name, beer.brewery, beer.style, beer.url, beer.abv, beer.is_season]);

            })
        );


        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }

}