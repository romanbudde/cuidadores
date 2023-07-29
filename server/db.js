const { Pool } = require('pg');

const pool = new Pool({
    user: "radmin",
    password: "UhsUFndhYvBu8Op8r3qB4z2U3sqnA1OY",
    host: "dpg-cj2hk5l9aq0e0q25ebp0-a.oregon-postgres.render.com",
    port: "5432",
    database: "db_cuidadores_9a2e",
    ssl: true
});

module.exports = pool;