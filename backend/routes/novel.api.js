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
		attributes: ["id", "name", "image_url", "description", 'alias'],
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
		let query = { alias: req.params.id }
		if (parseInt(req.params.id)) query = { id: parseInt(req.params.id) }


		Novel.findOne({ where: query })
			.then(novel => res.json(novel))
			.catch(err => {
				console.log(red(err.message))
				res.json({ error: err.message })
			})
	}).post(function (req, res, next) {
		console.log(req.method, req.url, req.body, req.params, req.query)
		if (req.params.id && req.body.id !== parseInt(req.params.id))
			return res.json({ error: "/:id the path doesn't match '_id' of post" })

		if (req.params.id) {
			Novel.findOrCreate({
				where: { id: req.params.id },
				defaults: {
					name: req.body.name,
					description: req.body.description,
					raw_url: req.body.raw_url,
				}
			}
			).then(([novel, created]) => {
				if (created) return res.json({ message: `Novel ${novel.name} created succesfully`, id: novel.id })

				return novel.update({
					name: req.body.name,
					raw_url: req.body.raw_url,
					description: req.body.description,
				}).then(nov => res.json({ message: `Novel ${nov.name} updated`, id: nov.id }))
			}).catch(err => {
				console.log(cyan(err.message))
				res.json({ error: err.message })
			});
		}

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

		if (req.query.order && req.query.order != -1) {
			query.where.order = req.query.order
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
			console.log("saving")
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
				if (!created) {
					content.content = req.body.content.content
					content.title = req.body.content.title
					content.save().then(() => res.json({
						msg: `Saved ${chapter.id} at ${chapter.url}`, chapter_id: chapter.id
					}))
				}
				else
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

