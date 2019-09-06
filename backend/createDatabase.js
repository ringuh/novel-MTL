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
		}
	}]



	const userList = [{
		googleId: "113424763475073319026",
		name: "pienirinkula",
		role: "admin",
	}]

	const novelList = [{
		name: "gandiehenaxieganerzi",
		raw_url: "https://www.lewenxiaoshuo.com/books/gandiehenaxieganerzi/",
		description: "Zheng Xian's greatest achievement in his life was to build a castle and keep his dry sons in it properly."
	}, {
		name: "weilaizhidangmabuyi",
		raw_url: "https://www.lewenxiaoshuo.com/books/weilaizhidangmabuyi/",
		description: null,
	},
	{
		name: "农女要翻天：夫君，求压倒",
		raw_url: "https://www.kenshu.cc/xiaoshuo/37805/",
		description: null,

	}, {
		name: "妃要上天",
		raw_url: "https://www.kenshu.cc/xiaoshuo/43495/",
		description: null,
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

	novelList.forEach((i) => {
		var n = Novel.create((i)).then((nov) => {
			Chapter.create(
				{
					novel_id: nov.id,
					url: "https://google.com",
				}
			).then(chap => {
				//return true
				Content.create({
					type: "RAW",
					title: "titteli",
					chapter_id: chap.id,
					content: "lorem                ipsum \n\n\n kolme väliä \n\n\n\n neljä väliä"
				}).then()
			})
		})

	});

	termList.forEach((i) => {
		Term.create((i)).then((term) => {
			//console.log("term created")
		})
	});

	setTimeout(() => {
		
		Chapter.findByPk(1, { include: ['contents', 'novel']}).then(chap => {
			//console.log("chapter:", chap.id)
			console.log(chap.contents[0].id)
			console.log(chap.novel.id)
			
		}).then(()=>{
			Content.findByPk(1, { include: ['chapter']}).then(chap => {
				//console.log("chapter:", chap.id)
				console.log(chap.chapter.id)
			})
		})
	}, 2000)
	
};

module.exports = createDB