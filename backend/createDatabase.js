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
		}, //https://www.zhaishuyuan.com/book/20452/
		// https://www.xbiqugexsw.com/book/245723/ "presidents ex wife"
		// https://www.ptwxz.com/modules/article/search.php
	}]



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
			name: "gandiehenaxieganerzi",
			raw_url: "https://www.lewenxiaoshuo.com/books/gandiehenaxieganerzi/",
			description: "Zheng Xian's greatest achievement in his life was to build a castle and keep his dry sons in it properly."
		}, {
			name: "Forced Marriage VIP Front-Seat: My Superstar Ex-wife is very Popular",
			raw_url: "https://www.lewenxiaoshuo.com/books/bihunshouxi_yinghouqianqihenqiangshou/",
			description: `Three years ago, President Qiao did not hesitate to sign the papers when Xia Ning placed the divorce papers in front of him.

			Three years later, she is an up-and-coming star in show biz; watched by the public but knee-deep in scandals.
			
			He is a resolute emperor in the business world; powerful and omnipotent.
			
			Their paths were supposed to be separate and independent, but—
			
			Standing at her door, the legendary ruthless and unyielding diamond bachelor asks for a remarriage. A cute bun appears from behind and gazes at Xia Ning with his big, starry eyes. “Mummy, Daddy will cook, I will warm the bed, please take us in.”`,
		},
		{
			name: "Lady Su's Revenge",
			raw_url: "https://www.kenshu.cc/xiaoshuo/111171/",
			description: "Reborn poison girl who can cook",

		}, {
			name: "妃要上天",
			alias: "china B",
			raw_url: "https://www.kenshu.cc/xiaoshuo/43495/",
			description: null,
		},

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