require("dotenv").config();

const Sequelize = require("sequelize");
console.log(process.env.NODE_ENV);

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
const databaseCredentials = {
    development: {
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        host: DB_HOST,
        dialect: "postgres",
    },
};
const { username, password, database, host, dialect } = databaseCredentials.development;

module.exports = databaseCredentials;

const options = {
    host,
    dialect,
    port: 5432,
    dialectOptions: {
        multipleStatements: true,
        connectTimeout: 220000,
    },
    pool: {
        max: 15,
        min: 0,
        idle: 350000,
        acquire: 1000000,
    },
    logging: false,
};

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "staging" || process.env.NODE_ENV === "production") {
    options.ssl = true;
    options.dialectOptions.ssl = {
        require: true,
        rejectUnauthorized: false,
    };
}

module.exports.connection = new Sequelize(database, username, password, options);