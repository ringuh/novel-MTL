const router = require('express').Router()
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird'); // removes deprecated messages
var chalk = require('chalk'); // colors
const slugify = require('slugify')

router.use(require('express').json())

let User = require("../models/user.model")

var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;


router.route(["/"])
  .get(function (req, res, next) {
    

  })
  .post(function (req, res, next) {

    console.log("/login user")
    console.log(req.body)
    console.log(req.params)
    console.log("----------------------------")

    return res.json({error: "returning"})
   


    });


module.exports = router;