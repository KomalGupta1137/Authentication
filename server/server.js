const db = require("./config/db");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

// Enable CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//registration api
app.post("/register", (req, res) => {
  const id = req.body.id;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  //Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }

    //Insert the username and hashedPassword to the database
    const query =
      "INSERT INTO users(id,username,email,password) VALUES(?, ?, ?, ?)";
    db.query(query, [id, username, email, hashedPassword], (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    });
  });
});

//login api
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], (error, results) => {
    if (error) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.length > 0) {
        const plainTextPassword = password;
        const hashedPassword = results[0].password;
        bcrypt.compare(plainTextPassword, hashedPassword, (error, isMatch) => {
          //handle the error recieved while comparing plainText password and hashedPassword
          if (error) {
            res.status(400).json({ error: error });
          }
          if (isMatch) {
            //password is matched now proceed to create token and give to user while logging in
            const token = jwt.sign(
              { userId: results[0].id },
              process.env.ACCESS_TOKEN_SECRET
            );
            const user = {
              user:username,
              password:password,
              token:token
            }
            res.status(200).send(user);
          } else {
            res.status(401).json({ error: "wrong combination" });
          }
        });
      }
    }
  });
});

//middleware for jwt verify
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("token", token)
  console.log("secret-key",process.env.ACCESS_TOKEN_SECRET )
  if (!token) {
    return res.status(401).send("unauthorized");
  }

  // //jwt verification
  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    
  //   if (error) {
  //     console.log(error);
  //     return res.status(401).send("unauthorized");
  //   }
  //   console.log(decoded);
  // });
};


//protected route for all users
app.get("/users",authenticate, (req, res) => {
  const query = "SELECT * from users;";
  const values = [];
  db.query(query, values, (error, results) => {
    if (error) {
      res.status(500).json({ error: "Internal server error" });
    }
    //now come to part where there is no error
    else {
      res.send(results);
    }
  });
});


//listen for requests
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
