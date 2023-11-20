require("dotenv").config();
const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env;

const config = {
    server: DB_HOST,
    port: parseInt(DB_PORT),
    database: DB_DATABASE,
    authentication: {
        type: "default",
        options: {
            userName: DB_USERNAME,
            password: DB_PASSWORD,
        },
    },
    options: { encrypt: false },
};

module.exports = { config };
