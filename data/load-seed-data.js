require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
const beers = require('./beers.js');
const style = require('./styles.js');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();

        const savedStyles = await Promise.all(
            style.map(async style => {
                const result = await client.query(`
                    INSERT INTO style (name)
                    VALUES ($1)
                    RETURNING *;
                `,
                [style]);

                return result.rows[0];
            })
        );
        await Promise.all(
            beers.map(beer => {

                const style = savedStyles.find(style => {
                    return style.name === beer.style;
                });

                return client.query(`
                    INSERT INTO beer (style_id, name, brewery, abv, is_season, url)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
                
                [style.id, beer.name, beer.brewery, beer.abv, beer.is_season, beer.url]);

            })
        );
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }

}