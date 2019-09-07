'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const slugify = require('slugify')
const sequelizeTransforms = require('sequelize-transforms');
let db = {};

const sequelize = new Sequelize(
    global.config.db.database,
    global.config.db.user,
    global.config.db.pass,
    global.config.db.options)
sequelizeTransforms(sequelize, {
    slugify: (val, def) => def.slugify ? slugify(val): val,
    cut: (val, def) => {
        return val ? val.toString().slice(0, def.cut): val
    },
    singlespace: (val, def) => {
        if(!def.singlespace || !val) return val
        
        val = val.replace(/ {2,}/g, ' ')
                .replace(/\n{2,}/g, '\n')
        val = val.split("\n").filter(p => p.trim().length > 0)
        val = val.map(p => p.trim().replace(/\s+/g, ' ')).join("\n")
        return val
            
    }
});

// how to custom transform
/* sequelizeTransforms(sequelize, {
    trim: function(val, defintion) {
      return val.toString().replace(/ /g, '*');
    },
    append: function(val, definition) {
      return val.toString() + definition['append'];
    }
  }); */

sequelize
    .authenticate()
    .then(function (err) {
        console.log(`Connected to ${global.config.db.database} -database.`);
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

fs.readdirSync(__dirname, { withFileTypes: true })
    .filter(file => file.name.endsWith('.model.js'))
    .forEach(function (file) {
        const model = sequelize['import'](path.join(__dirname, file.name));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
const initDB = require('../createDatabase')

db.sequelize = sequelize;
db.Sequelize = Sequelize;
const force = false
db.sequelize.sync({ force: force, logging: false }).then(() => force ? initDB(): '')





module.exports = db;