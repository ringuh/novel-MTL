const mongoose = require('mongoose');
mongoose.Promise = require('bluebird'); // removes deprecated messages
var chalk = require('chalk'); // colors




const config = require('../mtl/src/config.json');
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const ServerConf = require('lodash').merge(config.development, environmentConfig);

//require database URL from properties file
//var dbURL = require('./property').db;

var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;




mongoose.connect(ServerConf.database, ServerConf.db_options);

mongoose.connection.on('connected', function () {
	console.log(connected("Mongoose default connection is open to ", ServerConf.database));
	createDB();
});

mongoose.connection.on('error', function (err) {
	console.log(error("Mongoose default connection has occured " + err + " error"));
});

mongoose.connection.on('disconnected', function () {
	console.log(disconnected("Mongoose default connection is disconnected"));
});

// program exit
process.on('SIGINT', function () {
	mongoose.connection.close(function () {
		console.log(termination("Mongoose default connection is disconnected due to application termination"));
		process.exit(0)
	});
});

var createDB = () => {
	console.log("creating db")
	let Raw = require('./models/raw.model')
	let Novel = require("./models/novel.model")
	let User = require('./models/user.model')
	let Chapter = require('./models/chapter.model')
	let Term = require('./models/term.model')

	Raw.collection.drop()
	Novel.collection.drop();
	User.collection.drop();
	Chapter.collection.drop();
	Term.collection.drop();
	console.log("dropped tables")

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
	},{
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
		user_class: "admin",
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
	}]

	const termList = [{
		string: "robbed",
		prompt: true,
		terms: [{ value: "killed" }, { value: "attacked" }]
	}]

	raws.forEach((i) => {
		Raw.create((i)).then((raw) => console.log("raw created"))
	});

	userList.forEach((i) => {
		console.log(i.name)
	});

	novelList.forEach((i) => {
		var n = Novel.create((i)).then((nov) => {
			console.log(nov.name)
		})

	});

	termList.forEach((i) => {
		Term.create((i)).then((term) => console.log("term created"))
	});


	setTimeout(() => {
		mongoose.disconnect();
	}, 10000);
};

