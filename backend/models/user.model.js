module.exports = function (seq, type) {
  const User = seq.define('User', {
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: type.STRING,
      unique: true
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

  User.associate = function (models) {
    User.hasMany(models.Novel, {
      as: 'novels',
      foreignKey: 'user_id',
    })

    User.hasMany(models.Term, {
      as: 'terms',
      foreignKey: 'user_id',
    })
  };

  return User
}

