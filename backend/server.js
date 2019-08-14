const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path')
const ws = require('./module/webSocket')

const app = express();
app.use(cors());


ws.init()
const config = require('../mtl/src/config.json');
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
global.ServerConf = require('lodash').merge(config.development, environmentConfig);

app.listen(global.ServerConf.server_port, () => {
    console.log(`Server is running on port: ${global.ServerConf.server_port}`);
    
});
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use("/auth", require("./routes/login.api"))
app.use("/novel", require("./routes/novel.api"))
//app.use("/novel", require("./routes/novel"))

module.exports = app;