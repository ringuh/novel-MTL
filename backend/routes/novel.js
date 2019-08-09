const router = require('express').Router()
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird'); // removes deprecated messages
var chalk = require('chalk'); // colors
const slugify = require('slugify')

router.use(require('express').json())

let Novel = require("../models/novel.model")

var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;

/*router.route('/').get((req, res) => {
  Exercise.find()
    .then(exercises => res.json(exercises))
    .catch(err => res.status(400).json('Error: ' + err));
});*/


router.get("/", (req, res) => {
    console.log("hei /novel pohja")
    

    mongoose.connect(global.ServerConf.database, global.ServerConf.db_options)
    const db = mongoose.connection;
    db.once('open', function() {
    	Novel.find({}, "id name image_url description", { sort: "name" }, function(err, novels) {
    		if (err) {
                console.log(termination(err.message))               
               	res.json({ error: err.message })
            } else {
            	
            	console.log(connected("SUCCESS"))       
                res.json(novels)
            }

           mongoose.disconnect() 
    	});
    });


    db.once('disconnected', function() {
        console.log(disconnected("Mongoose connection is disconnected"), 
        	mongoose.connection.readyState);
    	if(!res.headersSent)
    		res.json({ error: "Database disconnected"})
    });

});


router.get("/1", (req, res) => {
    console.log("hei /novel /1")
    res.send("hei 1")
    
});

/*router.put("/novel", (req, res) => {
    console.log("hei /novel /1")
    res.send("hei 1")
    
});*/


router.route(["/add", "/:id"])
    .get(function(req, res, next) {
        console.log("this one",)
        console.log(req.params)
        
        mongoose.connect(global.ServerConf.database, global.ServerConf.db_options)
        const db = mongoose.connection;

        db.once('open', function() {
            console.log("Connection Successful!", mongoose.connection.readyState);

            Novel.findOne({_id: req.params.id}, function(err, novel) {
    		if (err) {
                console.log(termination(err.message))               
               	res.json({ error: err.message })
            } else {
            	
            	console.log(connected("SUCCESS"))       
                res.json(novel)
            }

           mongoose.disconnect() 
    	});

        });

        db.once('disconnected', function() {
            console.log(disconnected("Mongoose connection is disconnected"), 
            	mongoose.connection.readyState);
        	if(!res.headersSent)
        		res.json({ error: "Database disconnected"})
        	
        });


    })
    .post(function(req, res, next) {
       
        console.log("/edit post")
        console.log(req.body)


        mongoose.connect(global.ServerConf.database, global.ServerConf.db_options)
        const db = mongoose.connection;
        
        


        db.once('open', function() {
            console.log("Connection Successful!", mongoose.connection.readyState);

            Novel.create(req.body, function(err, small) {
                if (err) {
                    console.log(termination(err.message))
                    
                    
                    console.log("first", res.headersSent)
                   
                   	res.json({ error: err.message })
                   	

                } else {
                	console.log(connected("SUCCESS"))       
                    res.json({ message: "Novel saved succesfully", id: small._id })
                }

               mongoose.disconnect() 
            });

        });

        db.once('disconnected', function() {
            console.log(disconnected("Mongoose connection is disconnected"), 
            	mongoose.connection.readyState);
        	if(!res.headersSent)
        		res.json({ error: "Database disconnected"})
        	
        });

        

    });


/*
app.route(["/events", "/events/:id"])

app.route('/events')
  .all(function (req, res, next) {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
  })
  .get(function (req, res, next) {
    res.json({})
  })
  .post(function (req, res, next) {
    // maybe add a new event...
  })

UserRouter.route('/create').post(function (req, res) {
  const user = new User(req.body);
  user.save()
    .then(user => {
      res.json('User added successfully');
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});


  */

module.exports = router;


/*router.post('/api/get_data', async (req, res, next) => {
try {
MongoClient.connect(connectionStr, mongoOptions, function(err, client) {
   assert.equal(null, err);
   const db = client.db('db');
      
   //Step 1: declare promise
      
    var myPromise = () => {
       return new Promise((resolve, reject) => {
        
          db
          .collection('your_collection')
          .find({id: 123})
          .limit(1)
          .toArray(function(err, data) {
             err 
                ? reject(err) 
                : resolve(data[0]);
           });
       });
    };
   //await myPromise
   var result = await myPromise();
   //continue execution
   client.close();
   res.json(result);
}); //end mongo client
} catch (e) {
   next(e)
}
});*/