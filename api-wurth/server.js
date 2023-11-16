const express = require("express");
const { mysql, myconn, dbOptions, connection } = require("./db");
const dotenv = require('dotenv');

dotenv.config();
const routes = require('./routes/routes');
const app = express();
app.set("port", process.env.PORT || 9000);
app.use(myconn(mysql, dbOptions, "single"));
app.use(express.json());

connection.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
        process.exit(1);  
    } else {
        console.log("Conexión exitosa a la base de datos");
    }
});

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://http2.mlstatic.com; " +
    "style-src 'self' https://http2.mlstatic.com;"
  );
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api', routes);
app.listen(app.get("port"), () => {
    console.log(`Server listening on port ${app.get("port")}`);
});
