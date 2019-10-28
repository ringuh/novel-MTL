const router = require('express').Router()
const chalk = require('chalk'); // colors
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
router.use(require('express').json())



const { cyan, red } = chalk.bold;
const { User, Term, Novel, Chapter, Content, Sequelize } = require('../models')

const capitalize = (s) => {
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
}

router.get("/", Authenticated, (req, res) => {

	//console.log(req.method, req.url, req.body, req.params, req.query)
	Novel.findAll({
		attributes: ["id", "name", "image_url", "description", 'alias'],
		order: ['name']
	}).then(novels => {
		res.json(novels)
	}).catch(err => {
		console.log(red(err.message))
		res.status(500).json({ message: err.message })
	})
})

router.route(["/auth"])
	.post(function (req, res) {
		//console.log(req.method, req.url, req.body, req.params, req.query)

		User.findOrCreate({
			where: {
				googleId: req.body.googleId
			}, defaults: {
				name: `${req.body.profileObj.givenName}-${Math.random().toString(36).substring(2, 15)}`,
				icon: req.body.profileObj.imageUrl
			}
		}).then(([user, created]) => {
			let token = jwt.sign({ id: user.id, icon: user.icon, name: user.name }, global.config.jwt, { algorithm: 'RS256', expiresIn: "30d" })
			res.json({ message: "Logged in", jwt: token })
		}).catch(err => {
			console.log(err);
			res.status(500).json({ message: err.message })
		})
	});

async function Authenticated(req, res, next) {
	if (!req.user) return res.status(520).json({ message: "Login required" })
	next()
}
const NovelEditor = [Authenticated, async (req, res, next) => {
	const novel = await Novel.findByPk(req.params.novel_id)

	if (req.user.role === "admin" || novel.user_id === req.user.id) {
		req.novel = novel
		return next()
	}


	return res.status(521).json({ message: "Access denied" })
}];

router.route(["/create", "/:novel_id"])
	.get(Authenticated, function (req, res) {

		let query = { alias: req.params.novel_id }
		if (parseInt(req.params.novel_id)) query = { id: parseInt(req.params.novel_id) }

		Novel.findOne({ where: query })
			.then(novel => res.json(novel.toJson(req.user)))
			.catch(err => {
				console.log(red(err.message))
				res.status(500).json({ message: err.message })
			})
	}).post(Authenticated, async function (req, res) {

		if (req.params.novel_id && req.body.id !== parseInt(req.params.novel_id))
			return res.status(500).json({ message: "/:novel_id the path doesn't match 'id' of post" })

		let novel = null
		if (req.params.novel_id) {
			novel = await Novel.findByPk(parseInt(req.params.novel_id))
			if (req.user.role !== "admin" && novel.user_id !== req.user.id)
				return res.status(521).json({ message: "Access denied" })
		}
		else
			novel = await Novel.create({ name: req.body.name, user_id: req.user.id }).catch(err => res.status(500).json({ message: err.message }))

		novel.update({
			name: req.body.name,
			raw_url: req.body.raw_url,
			description: req.body.description,
		}).then(nov =>
			res.json({ message: `Novel ${nov.name} updated`, id: nov.id })
		).catch(err => {
			console.log(cyan(err.message))
			res.status(500).json({ message: err.message })
		});

	});



router.route("/:novel_id/chapter")
	.get(Authenticated, async function (req, res) {

		let query = {
			where: { novel_id: req.params.novel_id },
			//attributes: ["id", "novel_id", "order", "title", "url", "updatedAt", "createdAt"],
			order: [["order", req.query.reverse ? "DESC" : "ASC"], ['id']],
			include: [ // dont offer RAWless chapters for translators
				{ model: Content, as: 'raw', required: false },
				{ model: Content, as: 'baidu', required: false },
				{ model: Content, as: 'sogou', required: false },
				{ model: Content, as: 'proofread', required: false },
			]
		}

		if (req.query.translator)
			query.include = [
				{ model: Content, as: 'raw', required: true },
				{ model: Content, as: req.query.translator, required: false },
			]

		if (req.query.limit)
			query.limit = parseInt(req.query.limit)

		// if no chapter_id query next bunch of chapters from start
		if (req.query.chapter_id)
			query.where.id = { [Sequelize.Op.in]: req.query.chapter_id.split(",") }

		if (req.query.order) {
			let rqo = req.query.order
			let [min, max] = rqo.split("-").map(n => parseInt(n))
			if (max) query.where.order = { [Sequelize.Op.between]: [min, max] };
			else query.where.order = { [Sequelize.Op.in]: req.query.order.split(",") };

		}

		// which children to include in JSON
		if (!req.query.translator && req.query.includes)
			query.include = query.include.filter(inc => req.query.includes.split(",").includes(inc.as))

		// if there is translator and not FORCE only pick the chapters missing translation
		if (req.query.translator && !req.query.force && !req.query.terms) {
			query.where[`${req.query.translator}_id`] = { [Sequelize.Op.is]: null }
		}

		let chapters = await Chapter.findAll(query).then(
			chapters => chapters.map(chapter => chapter.toJson(req.query.content_length))
		).catch((err) => {
			return res.status(500).json({ message: err.message })
		})

		if (req.query.terms) {
			let qr = {
				where: { novel_id: parseInt(req.params.novel_id), type: 'raw' },
				order: [[Sequelize.fn('length', Sequelize.col('to')), 'DESC']]
			}

			let terms = await Term.findAll(qr).map(n => n.dataValues)
			const hash = crypto.createHmac('sha256', "not_so_secret_key")
				.update(JSON.stringify(terms))
				.digest('hex');

			let chaps = chapters.map(chapter => {
				// ignore chapters that have the same hash
				// unless force cmd
				const contentHash = chapter[req.query.translator] ? chapter[req.query.translator].hash : null

				chapter.respond = req.query.force ? true : false
				if (contentHash === hash) return chapter

				let termsInChapter = []

				terms.forEach(term => {
					term.from.split("|").forEach(from => {
						// presume that all FROM is chinese, thus impossible to replace already replaced
						const match = new RegExp(`${from}`, "gi")
						if (chapter.raw.content.match(match)) {
							chapter.raw.content = chapter.raw.content.replace(match, term.to)
							//chapter.raw.hash = hash
							if (!termsInChapter.includes(term))
								termsInChapter.push(term)
						}
					})
				})

				if (termsInChapter) {
					const chapterHash = crypto.createHmac('sha256', "not_so_secret_key")
						.update(JSON.stringify(termsInChapter))
						.digest('hex');
					
					if(chapterHash !== contentHash){
						chapter.respond = true
						chapter.raw.hash = chapterHash
					}
				}

				return chapter
			}).filter(chapter => chapter.respond)

			res.json(chaps)
		}
		else res.json(chapters)
	});


router.route(["/:novel_id/chapter/:chapter_id"])
	.get(Authenticated, function (req, res) {

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
			return res.status(500).json({ message: err.message })
		})

	}).post(NovelEditor, async function (req, res) {
		//console.log(req.method, req.url, req.body, req.params, req.query)

		const chapter = await Chapter.findByPk(parseInt(req.params.chapter_id))
		if (!chapter) return res.status(500).json({ message: `Chapter id ${req.params.chapter_id} not found` })

		// update some other chapter info than translated content
		if (!req.body.translator) {
			if (req.body.hasOwnProperty('url'))
				chapter.url = req.body.url
			if (req.body.hasOwnProperty('order')) {
				chapter.order = req.body.order
				chapter.reOrder()
			}
			chapter.save().then(chapter =>
				res.json({ msg: `Saved ${chapter.id} at ${chapter.url}`, chapter_id: chapter.id })
			).catch(err => res.status(500).json({ message: err.message }))

		}

		// updating content
		if (req.body.translator) {
			Content.findOrCreate({
				where: {
					chapter_id: chapter.id,
					type: req.body.translator
				}, raw: false
			}).then(([content, created]) => {
				if (req.body.hasOwnProperty('content')) {
					content.content = req.body.content.content
					content.title = req.body.content.title
					content.hash = req.body.content.hash
				}

				if (created) chapter[`set${capitalize(req.body.translator)}`](content)

				content.save().then(() =>
					res.json({ msg: `Saved ${chapter.id} at ${chapter.url}`, chapter_id: chapter.id })
				)
			}).catch((err) => {
				console.log(red(err))
				return res.status(500).json({ message: err.message })
			})
		}
	});

router.route(["/:novel_id/terms"])
	.get(Authenticated, function (req, res) {
		//console.log(req.method, req.url, req.body, req.params, req.query)

		let query = {
			where: { novel_id: parseInt(req.params.novel_id) },
			//order: [["id", "ASC"]]
			order: [
				[Sequelize.fn('length', Sequelize.col('to')), 'DESC']
			]
		}


		Term.findAll(query).then((term) => {
			return res.json(term)
		}).catch((err) => {
			console.log(red(err))
			return res.status(500).json({ message: err.message })
		})
	}).post(Authenticated, function (req, res) {
		//console.log(req.method, req.url, req.body, req.params, req.query)

		if (req.body.delete)
			Term.destroy({
				where: {
					id: req.body.id
				}
			}).then(t => res.json({ id: -1 }))
				.catch((err) => {
					console.log(red(err))
					return res.status(500).json({ message: err.message })
				})

		else {
			let trm = {
				from: req.body.from,
				to: req.body.to,
				prompt: req.body.prompt,
				novel_id: req.params.novel_id,
				type: req.body.type
			}
			Term.findOrCreate({
				where: {
					id: req.body.id || 0
				}, defaults: trm, raw: false
			})
				.then(([term, created]) => {
					if (created) return term
					return term.update(trm)
				}).then(r => res.json(r))
				.catch((err) => {
					console.log(red(err))
					return res.status(500).json({ message: err.message })
				})
		}
	});



module.exports = router;

