const Scraper = require('../module/scraper')
const router = require('express').Router()
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird'); // removes deprecated messages
var chalk = require('chalk'); // colors
const slugify = require('slugify')

router.use(require('express').json())

let Novel = require("../models/novel.model")
let Chapter = require("../models/chapter.model")

var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;

const BuildConnection = (db, req, res) => {
  console.log(req.originalUrl, req.method)
  console.log(res.params)
  mongoose.connect(global.ServerConf.database, global.ServerConf.db_options)
  db = mongoose.connection

  db.once('disconnected', function () {
    console.log(disconnected(`${req.originalUrl} connection is disconnected`),
      mongoose.connection.readyState);
  });

  res.on('finish', function () {
    console.log(`${req.originalUrl} response finished`)
    //mongoose.disconnect()
  });

  return db
}; 

router.get("/", (req, res) => {
  let db = null
  db = BuildConnection(db, req, res);


  db.once('open', function () {
    Novel.find({}, "id name image_url description", { sort: "name" }, function (err, novels) {
      if (err) {
        console.log(termination(err.message))
        res.json({ error: err.message })
      } else {
        res.json(novels)
      }
    });
  });
});

router.route(["/create", "/:id"])
  .get(function (req, res, next) {

    let db = null
    db = BuildConnection(db, req, res);



    db.once('open', function () {

      Novel.findOne({ _id: req.params.id }, function (err, novel) {
        if (err) {
          console.log(termination(err.message))
          res.json({ error: err.message })
        } else {

          console.log(connected("SUCCESS"))
          res.json(novel)
        }
      });

    });
  })
  .post(function (req, res, next) {

    if (req.body._id !== req.params.id)
      return res.json({ error: "/:id the path doesn't match '_id' of post" })

    let db = null
    db = BuildConnection(db, req, res);

    db.once('open', function () {

      if (!req.params.id)
        Novel.create(req.body)
          .then((novel) => {
            return res.json({ message: "Novel saved succesfully", id: novel._id })
          }).catch((err) => {
            return res.json({ error: err.message })
          })
      else
        Novel.findOne({ _id: req.params.id })
          .then((novel) => {
            if (!novel)
              throw { message: `Novels with _id ${req.params.id} not found` }

            novel.name = req.body.name
            novel.description = req.body.description
            novel.raw_directory = req.body.raw_directory
            novel.raw_url = req.body.raw_url

            novel.save()
              .then((i) => res.json(i))
              .catch((err) => res.json({ error: err.message }))
          })
          .catch((err) => {
            return res.json({ error: err.message })
          })
    });
  });



router.route("/:id/chapters")
  .get(function (req, res, next) {

    let db = null
    db = BuildConnection(db, req, res);


    db.once('open', function () {

      Chapter.find({ novelId: req.params.id, type: "raw" })
        .then((chapters) => {
          return res.json(chapters)
        })
        .catch((err) => {
          console.log(err)
          return res.json({ error: err.message })
        })

    });

  })
  .post(function (req, res, next) {
    const Scraper = require('../module/scraper')
    console.log(":id/chapters post")
    console.log(req.body)
    console.log(req.params.id)
    console.log("----------------------------")

    //Scraper.Init(req.params.id, req.body.chapterId)



    res.json({im: "back"})
    return true
    mongoose.connect(global.ServerConf.database, global.ServerConf.db_options)
    const db = mongoose.connection;


    db.once('open', function () {
      console.log("Connection Successful!", mongoose.connection.readyState);


    });

    db.once('disconnected', function () {
      console.log(disconnected("Mongoose connection is disconnected"),
        mongoose.connection.readyState);
      if (!res.headersSent)
        res.json({ error: "Database disconnected" })

    });



  });







module.exports = router;

