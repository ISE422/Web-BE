const mainM = require("../models/main.m");
const CryptoJS = require("crypto-js");

// total char of hash
const hashLength = 64;

module.exports = {
  renderHome: (req, res, next)=>{
    res.end("Home page")
  },
  renderLogin: (req, res, next)=>{
    res.end("Login page")
  }
};
