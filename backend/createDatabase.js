var chalk = require('chalk'); // colors
const config = require('../mtl/src/config.json');
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const ServerConf = require('lodash').merge(config.development, environmentConfig);

//require database URL from properties file
//var dbURL = require('./property').db;

var { cyan, yellow, red, blue } = chalk.bold;


var createDB = async () => {

	const { Raw, User, Novel, Term, Chapter, Content } = require('./models')



	const raws = [{
		url: "https://www.lewenxiaoshuo.com/books/xinhunwuai_tizuiqianqi/34622958.html",
		next: ".bottem1>a:last",
		title: ".bookname > h1",
		content: "#content",
		regex: "lewenxiaoshuo\.com\/books\/.*\/(?!0).*\.html",
		root: {
			image_url: "#fmimg > img",
			description: "#intro",
			catalog: null,
			chapters: "#list > dl > dd > a"
		}
	}, {
		url: "https://www.kenshu.cc/xiaoshuo/30192/75481194/",
		next: ".articlebtn>a:eq(3)",
		title: ".article-title",
		content: ".article-con",
		regex: "kenshu\.cc\/xiaoshuo\/.*\/(?!0).*\/",
		root: {
			image_url: ".bigpic > img",
			description: ".book-intro > div:eq(0)",
			catalog: "a.catalogbtn",
			chapters: "ul.chapter-list > li > span > a"
		},
	}, {
		url: "https://www.zhaishuyuan.com/book/20452/",
		next: "#center > div.jumptop > a:last",
		title: "#center > .title > h1",
		content: "#content",
		regex: "zhaishuyuan\.com\/chapter\/(\\d).*\/(\\d).*($|\/$)",
		root: {
			image_url: "#bookimg > img",
			description: "#bookintro",
			catalog: "#bookinfo > div.bookright > div.motion > a:nth-child(1)",
			chapters: "#readerlists > ul > li:nth-child(3) > a"
		},
	}, {
		url: "https://www.101novel.net/txt/194209.html",
		next: "#thumb > a:nth-child(3)",
		title: "#bgdiv > table > tbody > tr:nth-child(1) > td > div > h1",
		content: "#content",
		regex: "101novel\.net\/ck101\/(\\d).*\/(\\d).*\.html",
		root: {
			image_url: "#detail-box > div > div.ui_bg6 > div.box_intro > div.pic > img",
			description: "div.intro",
			catalog: "#detail-box > div > div.ui_bg6 > div.box_intro > div.box_info > div > span.btopt > a",
			chapters: "#defaulthtml4 > table > tbody > tr:nth-child(1) > td:nth-child(1) > div > a"
		},
	},



		/* { ######### THIS IS AJAX PAGE
			url: "https://www.xbiqugexsw.com/book/245723/",
			next: ".bottem1>a:last",
			title: ".bookname > h1",
			content: "#content",
			regex: "xbiqugexsw\.com\/book\/.*\/.*\.html",
			root: {
				image_url: "#fmimg > img",
				description: "#intro",
				catalog: null,
				chapters: "#list > dl > dd > a"
			},
		}, */

		/* { #### AJAX PAGE, POSSIBLE THOUGH
			url: "https://www.ptwxz.com/bookinfo/3/3785.html",
			next: ".bottomlink>a:last",
			title: "#content > h1",
			content: "#content",
			regex: "ptwxz\.com\/html\/(\\d).*\/(\\d).*\/(\\d).*\.html",
			root: null 
		} */

		//https://www.zhaishuyuan.com/book/20452/
		// https://www.xbiqugexsw.com/book/245723/ "presidents ex wife"
		// https://www.ptwxz.com/modules/article/search.php
	]



	const userList = [{
		googleId: "113424763475073319026",
		name: "pienirinkula",
		role: "admin",
	}]

	const novelList = [
		{
			name: "The Devious First-Daughter",
			raw_url: "https://www.kenshu.cc/xiaoshuo/51204/",
			description: "Transmigrated to 14 year old from same family. Shitty family",
		}, {
			name: "Indominable Master of Elixirs",
			raw_url: "https://www.zhaishuyuan.com/book/21072",
		}, {
			name: "Forced Marriage VIP Front-Seat: My Superstar Ex-wife is very Popular",
			raw_url: "https://www.lewenxiaoshuo.com/books/bihunshouxi_yinghouqianqihenqiangshou/",
			description: `Three years ago, President Qiao did not hesitate to sign the papers when Xia Ning placed the divorce papers in front of him.

			Three years later, she is an up-and-coming star in show biz; watched by the public but knee-deep in scandals.
			
			He is a resolute emperor in the business world; powerful and omnipotent.
			
			Their paths were supposed to be separate and independent, but—
			
			Standing at her door, the legendary ruthless and unyielding diamond bachelor asks for a remarriage. A cute bun appears from behind and gazes at Xia Ning with his big, starry eyes. “Mummy, Daddy will cook, I will warm the bed, please take us in.”`,
		}, {
			name: "Lady Su's Revenge",
			raw_url: "https://www.kenshu.cc/xiaoshuo/111171/",
			description: "Reborn poison girl who can cook",

		}, {
			name: "Ultimate little village doctor",
			raw_url: "https://www.zhaishuyuan.com/book/20452/",
			description: null,
		}, {
			name: "General's Little Peasant Wife",
			raw_url: "https://www.101novel.net/txt/194209.html",
		}, {
			name: "Venerable Swordsman",
			raw_url: "https://www.kenshu.cc/xiaoshuo/135319/"
		},
		{
			name: "Fields of Gold",
			raw_url: "https://www.kenshu.cc/xiaoshuo/49172/"
		},{
			name: "Newly-married, husband playing tricks",
			raw_url: "https://www.kenshu.cc/xiaoshuo/37008/"
		},{
			name: "The Expensive Ex-wife",
			raw_url: "https://www.101novel.net/txt/35994.html"
		},{
			name: "Evil Consort in the Great Era",
			raw_url: "https://www.kenshu.cc/xiaoshuo/114073/",
			description: "Poison Qi girl from zombieworld as prime ministers abandoned daughter"
		}
		

	]

	const termList = [{
		from: "robbed",
		to: "killed | attacked"
	}]

	raws.forEach((i) => {
		Raw.create((i))
	});

	userList.forEach((i) => {
		User.create(i)
	});

	novelList.forEach((i, index) => {
		//if(index > 1) return
		var n = Novel.create((i)).then((nov) => {
			return true
			Chapter.create(
				{
					novel_id: nov.id,
					url: i.raw_url,
				}
			).then(chap => {

				Content.create({
					type: "RAW",
					title: `${i.name}`,
					chapter_id: chap.id,
					content: "lorem                ipsum \n\n\n kolme väliä \n\n\n\n neljä väliä"
				}).then(content => chap.setRaw(content));

				Content.create({
					type: "proofread",
					title: `${i.name}`,
					chapter_id: chap.id,
					content: "proof  kolme väliä \n\n\n\n neljä väliä"
				}).then(content => chap.setProofread(content));

				/* chap.setProofread({
					type: "proofread",
					title: "prof title",
					chapter_id: chap.id,
					content: "proofread content väliä"
				}) */
			})
		})
	});

	termList.forEach((i) => {
		Term.create((i)).then((term) => {
			//console.log("term created")
		})
	});

	setTimeout(() => {
		return true
		Chapter.findByPk(1, { include: ['proofread', 'novel'] }).then(chap => {

			//chap.getRaw().then(proof => console.log(proof.id))


			return true
			console.log("chapter:", chap.id)
			//console.log(chap.contents[0].id)
			console.log(chap.raw.id)
			console.log(chap.proofread.id)
			console.log(chap.novel.id)
			return true
			chap.contentSave({
				where: { type: "proofread" },
				defaults: {
					title: "Mummon päiväkirja",
					content: "mummon sisältö"
				}
			})

			console.log(chap.getContent('raw').content)

		}).then(() => {
			Content.findByPk(1, { include: ['chapter'] }).then(chap => {
				console.log("contents chapter:")
				console.log(chap.chapter.id)
			})


		})
	}, 2000)

};

module.exports = createDB