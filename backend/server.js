const express = require('express');
const cors = require('cors');
const path = require('path')
const ws = require('./module/webSocket')

const app = express();
app.use(cors());

const config = require('../mtl/src/config.json');
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
global.config = require('lodash').merge(config.development, environmentConfig);

app.listen(global.config.server.port, () => {
    console.log(`Server is running on port: ${global.config.server.port}`);
    ws.init()
});
app.use('/static', express.static(path.join(__dirname, 'static')))
//app.use("/auth", require("./routes/login.api"))
app.use("/novel", require("./routes/novel.api"))
//app.use("/chapter", require("./routes/chapter.api"))

module.exports = app;