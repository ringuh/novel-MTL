module.exports = function (seq, type) {
  //const { Op } = require('sequelize');
  const Model = seq.define('User', {
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: type.STRING,
      unique: true,
      allowNull: false,
    },
    googleId: {
      type: type.STRING,
      allowNull: false,
      unique: true
    },
    icon: {
      type: type.STRING,
      defaultValue: "/static/dist/default.jpg"
    },
    role: { type: type.STRING },
    last_login: { type: type.DATE },
  }, { timestamps: true });






  Model.associate = function (models) {
    Model.hasMany(models.Novel, {
      as: 'novels',
      foreignKey: 'user_id',
    })

    Model.hasMany(models.Term, {
      as: 'terms',
      foreignKey: 'user_id',
    })

    Model.hasMany(models.Cookie, {
      as: 'cookies',
      foreignKey: 'user_id',
    })
  };

  

  return Model
}

