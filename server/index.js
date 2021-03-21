const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("dotenv").config();
app.set("view engine", "ejs");
app.use(cors());
app.use(express.json()); //as body-parser
let refreshTokens = [];
//to test the server
app.get("/", (req, res) => {
  res.send("hello");
});

// Creates a new accessToken using the given refreshToken
app.post("/refresh", (req, res, next) => {
  //grab token form body
  const refreshToken = req.body.token;

  //check is refrsh token is valid
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.json({ message: "Refresh token not found, login again" });
  }

  // If the refresh token is valid, create a new accessToken and return it.
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (!err) {
      //create accesstoken
      const accessToken = jwt.sign(
        { username: user.name },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "20s" }
      );
      return res.json({ sucess: true, accessToken });
    } else {
      return res.json({
        success: false,
        message: "Invalid refresh token",
      });
    }
  });
});

// Middleware to authenticate user by verifying user's jwt-token.
const auth = async (req, res, next) => {
  //grab token from header
  let token = req.headers["authorization"];
  token = token.split(" ")[1]; //Access token

  if (!token) {
    return res.send("no token found");
  }
  //verify the token and send res
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (!err) {
      req.user = user;
      next();
    } else if (err.message === "jwt expired") {
      return res.json({
        success: false,
        message: "Access token expired",
      });
    } else {
      return res.status(403).json({
        err,
        message: "User not authenticated",
      });
    }
  });
};

app.post("/protected", auth, (_req, res) => {
  return res.status(200).json({ message: "inside protected route" });
});

//login the user and send access,refersh token
app.post("/login", (req, res) => {
  const user = req.body.user;
  if (!user) {
    return res.status(404).json({ message: "empty body" });
  }
  //login the user then send back access and refresh token
  //login the user here...
  let accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
  let refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  refreshTokens.push(refreshToken);

  return res.status(201).json({
    accessToken,
    refreshToken,
  });
});

app.listen(4000, () => {
  console.log("server started at port 4000");
});
