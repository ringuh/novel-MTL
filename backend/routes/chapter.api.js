const Scraper = require('../module/scraper')
const router = require('express').Router()
const chalk = require('chalk'); // colors
const slugify = require('slugify')

router.use(require('express').json())

const { Novel, Chapter } = require("../models")

var { cyan, yellow, red, blue } = chalk.bold;

router.get("/", (req, res) => {

});

router.route("/:id/chapter")
  .get(function (req, res, next) {


    Chapter.findAll({ 
        where: { novelId: req.params.id },
        attributes: [id, novel_id, url, title, timestamps]
      }).then((chapters) => {
        console.log(JSON.stringify(chapters))
        return res.json(chapters)
      })
      .catch((err) => {
        return res.json({ error: err.message })
      })
  })










module.exports = router;

