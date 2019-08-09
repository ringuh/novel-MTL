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

mongoose.connection.on('connected', function(){
	console.log(connected("Mongoose default connection is open to ", uri));

	createDB();

});

mongoose.connection.on('error', function(err){
	console.log(error("Mongoose default connection has occured "+err+" error"));
});

mongoose.connection.on('disconnected', function(){
	console.log(disconnected("Mongoose default connection is disconnected"));
});

// program exit
process.on('SIGINT', function(){
	mongoose.connection.close(function(){
		console.log(termination("Mongoose default connection is disconnected due to application termination"));
		process.exit(0)
	});
});

var createDB = () =>{
	console.log("creating db")
	let Novel = require("./models/novel.model")
	let User = require('./models/user.model')

	const userList = [{
		googleId: "113424763475073319026",
		name: "pienirinkula",
		user_class: "admin",
	}]

	const novelList = [{
		
	}]

	Novel.create({ name: 'small' }, function (err, small) {
		console.log(err)
	});

	Novel.find((err, todos) => {
		console.log(err)
		console.log(todos)
	})

	//mongoose.disconnect();
};

