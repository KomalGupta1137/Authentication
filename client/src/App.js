import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUsername, setLoginUserName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  const handleRegister = () => {
    const data = {
      id: id,
      username: username,
      email: email,
      password: password,
    };
    axios
      .post("http://localhost:8080/register", data)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlelogin = () => {
    const data = {
      username: loginUsername,
      password: loginPassword,
    };
    axios
      .post("http://localhost:8080/login", data)
      .then((res) => {
        console.log("res", res);
        localStorage.setItem("user", JSON.stringify(res));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const authHeader = () => {
    const user = localStorage.getItem("data");
    if (user && user.token) {
      return {
        // "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*",
        'Authorization': `Bearer ${user.token}`,
      };
    } else {
      return {};
    }
  };



  const getUsers = () => {
    axios
      .get("http://localhost:8080/users",{
        headers:authHeader()
      } )
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

 
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2>Registration</h2>
          <input
            placeholder="id"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
          <input
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            placeholder="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2>Login</h2>
          <input
            placeholder="username"
            value={loginUsername}
            onChange={(e) => setLoginUserName(e.target.value)}
          />
          <input
            placeholder="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button onClick={handlelogin}>Login</button>
          {loginStatus ? <h1>Correct user</h1> : ""}
        </div>
      </div>
    </>
  );
};
export default App;
