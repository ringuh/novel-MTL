const Scraper = require('../module/scraper')
const router = require('express').Router()
const chalk = require('chalk'); // colors
const slugify = require('slugify')

router.use(require('express').json())



const { cyan, yellow, red, blue } = chalk.bold;
const { Novel, Chapter, Sequelize } = require('../models')


router.get("/", (req, res) => {

  Novel.findAll({
    attributes: ["id", "name", "image_url", "description"],
    order: ['name']
  }).then(novels => {
    res.json(novels)
  }).catch(err => {
    console.log(red(err.message))
    res.json({ error: err.message })
  })
})

router.route(["/create", "/:id"])
  .get(function (req, res, next) {
    Novel.findOne({ where: { id: req.params.id } })
      .then(novel => res.json(novel))
      .catch(err => {
        console.log(red(err.message))
        res.json({ error: err.message })
      })
  }).post(function (req, res, next) {

    if (req.body.id !== req.params.id)
      return res.json({ error: "/:id the path doesn't match '_id' of post" })
    console.log("create POST", req.params, req.body)

    if (req.params.id)
      Novel.findByPk(req.params.id).then((novel) => {
        if (!novel)
          return res.json({ error: `Novel by ID ${req.params.id} not found` })
        novel.name = req.body.name
        novel.decription = req.body.decription
        novel.raw_directory = req.body.raw_directory
        novel.raw_url = req.body.raw_url
        novel.save().then(novel => res.json(novel))
      }).catch(err => {
        console.log(red(err.message))
        res.json({ error: err.message })
      });
    else
      Novel.create({
        name: req.body.name,
        decription: req.body.decription,
        raw_directory: req.body.raw_directory,
        raw_url: req.body.raw_url,
      }).then(novel =>
        res.json({ message: `Novel ${novel.name} created succesfully`, id: novel.id })
      ).catch(err => {
        console.log(red(err.message))
        res.json({ error: err.message })
      });
  });



router.route("/:id/chapter")
  .get(function (req, res, next) {
    console.log("/chapter/", req.body, req.params)

    Chapter.findAll({
      where: { novel_id: req.params.id },
      attributes: ["id", "novel_id", "order", "url", "title", "updatedAt", "createdAt"],
      order: [["order"], ['id']]
    }).then((chapters) => {
      return res.json(chapters)
    })
      .catch((err) => {
        return res.json({ error: err.message })
      })
  }).post(function (req, res, next) {
    console.log("/chapter post/", req.body, req.params)

    let query = {
      where: {
        novel_id: req.params.id
      },
      attributes: ["id", "novel_id", "order", "url", "title", "updatedAt", "createdAt"],
      order: [["order"], ['id']]
    }
    if (req.body.translator) {
      //if (!req.body.force) query.where[req.body.translator] = null
      query.where.raw = { [Sequelize.Op.ne]: null }
    }
    if (req.body.chapter_id > 0) query.where.id = req.body.chapter_id
    else if (req.body.limit) query.limit = req.body.limit
    
    Chapter.findAll(query).then((chapters) => {
      return res.json(chapters)
    })
      .catch((err) => {
        return res.json({ error: err.message })
      })

  });


router.route(["/:novel_id/chapter/:chapter_id"])
  .get(function (req, res, next) {
    console.log("chapter get", req.body, req.params)
    let queryStr = {
      where: { id: parseInt(req.params.chapter_id) },
    }
    if (req.body.attributes)
      queryStr.attributes = req.body.attributes
    
    Chapter.findOne(queryStr).then((chapter) => {
      return res.json(chapter)
    }).catch((err) => {
      console.log(red(err))
      return res.json({ error: err.message })
    })

  }).post(function (req, res, next) {
    console.log("post req", req.body, req.params)
    Chapter.findOne({
      where: { id: parseInt(req.params.chapter_id) },
    }).then((chapter) => {
      if (req.body.translator) {
        chapter[req.body.translator] = req.body.content
        chapter.save().then((chap) => res.json({
          msg: `Saved ${chapter.id} at ${chapter.url}`, chapter_id: chapter.id
        }))
      }
      else throw { message: "Did nothing" }
    }).catch((err) => {
      console.log(red(err))
      return res.json({ error: err.message })
    })
  });





module.exports = router;

