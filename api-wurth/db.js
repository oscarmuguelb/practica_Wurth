const mysql = require("mysql");
const myconn = require("express-myconnection");

const dbOptions = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "wurth"
};

const connection = mysql.createConnection(dbOptions);

module.exports = {
    mysql,
    myconn,
    dbOptions,
    connection
};
