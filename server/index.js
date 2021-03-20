const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("dotenv").config();
app.use(cors());
app.use(express.json()); //as body-parser



//to test the server
app.get("/", (req, res) => {
  res.send("hello");
});

// Middleware to authenticate user by verifying user's jwt-token.
const auth = () => {
    
}

app.post('/protected', auth, (_req, res) => {
  return  res.status(200).json({message:"inside protected route"})
})

//login the user and send access,refersh token
app.post("/login", (req, res) => {
  const user = req.body.user;
  if (!user) {
    return res.status(404).json({ message: "empty body" });
  }
  //login the user then send back access and refresh token
  //login the user here...
  let accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20s",
  });
  let refershToken = jwt.sign(user, process.env.REFRESH_TOKE_SECRET, {
    expiresIn: "7d",
  });

  return res.status(201).json({
    accessToken,
    refershToken,
  });
});

app.listen(4000, () => {
  console.log("server started at port 4000");
});
