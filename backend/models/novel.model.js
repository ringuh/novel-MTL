module.exports = function (seq, type) {

	const Novel = seq.define('Novel', {
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
			//slugify: true
		},
		alias: { // slugified version of the name
			type: type.STRING,
			unique: { args: true, msg: "Novel alias needs to be unique" },
			trim: true,
			slugify: true
		},
		image_url: {
			type: type.STRING,
			defaultValue: "/static/dist/default.jpg"
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
	},
		{
			timestamps: true,
		});

	Novel.associate = models => {
		Novel.belongsTo(models.User, {
			//onDelete: "CASCADE",
			foreignKey: 'user_id',
		})
	};
	
	return Novel
}

