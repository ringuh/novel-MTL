const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
app.use(cors());



const config = require('../mtl/src/config.json');
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
global.ServerConf = require('lodash').merge(config.development, environmentConfig);

app.listen(global.ServerConf.server_port, () => {
    console.log(`Server is running on port: ${global.ServerConf.server_port}`);
    
});


app.use("/novel", require("./routes/novel"))
//app.use("/novel", require("./routes/novel"))

module.exports = app;