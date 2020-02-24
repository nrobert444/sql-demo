require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;

run();

async function run() {

    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();
    
        await client.query(`

        CREATE TABLE style (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(256) NOT NULL
        );


            CREATE TABLE beer (
                id SERIAL PRIMARY KEY NOT NULL,
                name VARCHAR(256) NOT NULL,
                brewery VARCHAR(256) NOT NULL,
                style_id INTEGER NOT NULL REFERENCES style(id),
                url VARCHAR(256) NOT NULL,
                abv DECIMAL NOT NULL,
                is_season BOOLEAN NOT NULL
            );
        `);
    }
    catch (err) {  
        console.log(err);
    }
    finally {
        
        client.end();
    }
    
}