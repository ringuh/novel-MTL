module.exports = function (seq, type) {
	//const { Op } = require('sequelize');
	const Model = seq.define('Novel', {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: type.STRING,
			unique: { args: true, msg: "Novel name already in use" },
			allowNull: false,
			trim: true,
			validate: {
				len: [1,100]
			},
			set(val) {
				this.alias = val
				this.setDataValue('name', val)				
			}
			//slugify: true
		},
		alias: { // slugified version of the name
			type: type.STRING,
			unique: { args: true, msg: "Novel alias needs to be unique" },
			trim: true,
			slugify: true,
			allowNull: true,
		},
		image_url: {
			type: type.STRING,
			defaultValue: "/files/dist/default.jpg"
		}, // image of the book
		raw_url: {
			type: type.STRING,
			validate: {
				isUrl: true
			},
			trim: true
		}, // URL to the book
		description: {
			type: type.TEXT,
			validate: {
				len: [0,500]
			},
			cut: 500,
			trim: true
		},
		modify: {
			type: type.STRING,
			allowNull: false,
			defaultValue: 'owner',
			validate: {
				isIn: [['all', 'owner', 'group']]
			}
		}
	},
		{
			timestamps: true,
		});

	Model.associate = models => {
		Model.belongsTo(models.User, {
			//onDelete: "CASCADE",
			foreignKey: 'user_id',
		}),
		
		Model.hasMany(models.Chapter, {
			as: 'chapters',
            foreignKey: 'novel_id',
            allowNull: false
        })
	};
	
	return Model
}

