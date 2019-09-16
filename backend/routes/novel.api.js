const Scraper = require('../module/scraper')
const router = require('express').Router()
const chalk = require('chalk'); // colors
const slugify = require('slugify')

router.use(require('express').json())



const { cyan, yellow, red, blue } = chalk.bold;
const { Term, Novel, Chapter, Content, Sequelize } = require('../models')

const capitalize = (s) => {
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
}

router.get("/", (req, res) => {
	//console.log(req.method, req.url, req.body, req.params, req.query)
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
		//console.log(req.method, req.url, req.body, req.params, req.query)
		Novel.findOne({ where: { id: req.params.id } })
			.then(novel => res.json(novel))
			.catch(err => {
				console.log(red(err.message))
				res.json({ error: err.message })
			})
	}).post(function (req, res, next) {
		console.log(req.method, req.url, req.body, req.params, req.query)
		if (req.params.id && req.body.id !== parseInt(req.params.id))
			return res.json({ error: "/:id the path doesn't match '_id' of post" })
		
		if (req.params.id)
			Novel.findByPk(req.params.id, { raw: false }).then((novel) => {
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
		//console.log(req.method, req.url, req.body, req.params, req.query)

		let query = {
			where: { novel_id: req.params.id },
			//attributes: ["id", "novel_id", "order", "title", "url", "updatedAt", "createdAt"],
			order: [["order"], ['id']],
			include: [ // dont offer RAWless chapters for translators
				{ model: Content, as: 'raw', required: req.query.translator ? true : false },
				{ model: Content, as: 'baidu', required: false },
				{ model: Content, as: 'sogou', required: false },
				{ model: Content, as: 'proofread', required: false },
			]
		}

		// if no chapter_id query next bunch of chapters from start
		if (req.query.chapter_id && req.query.chapter_id != -1) {
			query.where.id = req.query.chapter_id
		}

		// which children to include in JSON
		if (req.query.includes)
			query.include = query.include.filter(inc => req.query.includes.split(",").includes(inc.as))

		// if there is translator and not FORCE only pick the chapters missing translation
		if (req.query.translator && !req.query.force) {
			query.where[`${req.query.translator}_id`] = { [Sequelize.Op.is]: null }
		}
		
		Chapter.findAll(query).then((chapters) => {
			return res.json(chapters.map(chapter => chapter.toJson(req.query.content_length)))
		})
			.catch((err) => {
				return res.json({ error: err.message })
			})
	});


router.route(["/:novel_id/chapter/:chapter_id"])
	.get(function (req, res, next) {
		//console.log(req.method, req.url, req.body, req.params, req.query)
		let query = {
			where: { id: parseInt(req.params.chapter_id) },
			include: ['raw', 'baidu', 'proofread', 'sogou']
		}
		if (req.body.attributes)
			query.attributes = req.body.attributes.split(",")
		if (req.body.includes)
			query.includes = req.body.includes.split(",")

		Chapter.findOne(query).then((chapter) => {
			return res.json(chapter.toJson())
		}).catch((err) => {
			console.log(red(err))
			return res.json({ error: err.message })
		})

	}).post(function (req, res, next) {

		console.log(req.method, req.url, req.body, req.params, req.query)

		Chapter.findOne({
			where: { id: parseInt(req.params.chapter_id) },
		}).then((chapter) => {

			chapter.contentSave({
				where: {
					chapter_id: chapter.id,
					type: req.body.translator
				},
				defaults: {
					content: req.body.content.content,
					title: req.body.content.title
				}, raw: false
			}).then(([content, created]) => {
				chapter[`set${capitalize(req.body.translator)}`](content).then(done =>
					res.json({
						msg: `Saved ${chapter.id} at ${chapter.url}`, chapter_id: chapter.id
					})
				)

			})
		}).catch((err) => {
			console.log(red(err))
			return res.json({ error: err.message })
		})
	});

router.route(["/:novel_id/terms"])
	.get(function (req, res, next) {
		//console.log(req.method, req.url, req.body, req.params, req.query)
		let query = {
			where: { novel_id: parseInt(req.params.novel_id) },
		}


		Term.findAll(query).then((term) => {
			return res.json(term)
		}).catch((err) => {
			console.log(red(err))
			return res.json({ error: err.message })
		})
	}).post(function (req, res, next) {
		console.log(req.method, req.url, req.body, req.params, req.query)

		if (req.body.prompt === 'delete')
			Term.destroy({
				where: {
					id: req.body.id
				}
			}).then(t => res.json({ id: -1 }))
				.catch((err) => {
					console.log(red(err))
					return res.json({ error: err.message })
				})

		else
			Term.findOrCreate({
				where: {
					id: req.body.id || 0
				}, defaults: {
					from: req.body.from,
					to: req.body.to,
					prompt: req.body.prompt,
					novel_id: req.params.novel_id
				}, raw: false
			})
				.then(([term, created]) => {
					if (created) return term

					term.from = req.body.from
					term.to = req.body.to
					term.prompt = req.body.prompt
					return term.save()
				}).then(r => res.json(r))
				.catch((err) => {
					console.log(red(err))
					return res.json({ error: err.message })
				})
	});



module.exports = router;

