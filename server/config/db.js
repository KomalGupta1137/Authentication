const mysql = require("mysql");

const connection = mysql.createConnection({
  user: "root",
  password: "Mysql@1137",
  host: "localhost",
  database: "users",
});



connection.connect((error) => {
    if (error) {
      console.log("app is not connected to database");
      console.log(error)
    } else {
      console.log("app is connected to database");
    }
  });

module.exports = connection


