const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorieSchema = new Schema(
	{
		nom: {
			type: String,
			required: true,
			unique: true,
		},
		image: {
			type: String,
			default: null,
		},
		color: {
			type: String,
			default: null,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('categorie', CategorieSchema);
