const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const users = [];

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    name,
    email,
    password: hashedPassword,
  });

  res.json({
    message: "Signup Successful",
  });
});

app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email
  );

  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const validPassword =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!validPassword) {
    return res.status(400).json({
      message: "Wrong Password",
    });
  }

  const token = jwt.sign(
    {
      email: user.email,
    },
    "secretkey",
    {
      expiresIn: "1d",
    }
  );

  res.json({
    message: "Login Successful",
    token,
  });
});

app.listen(5000, () => {
  console.log("Server Running");
});
