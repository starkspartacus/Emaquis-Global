const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProduitSchema = new Schema(
	{
		produit: {
			type: Schema.Types.ObjectId,
			ref: 'produit-global',
		},
		prix_vente: { type: Number, required: true },
		prix_achat: { type: Number, required: true },
		taille: { type: String, required: true },
		quantite: { type: Number, required: true },
		session: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		promo: {
			type: Boolean,
			default: null,
		},
		promo_quantity: {
			type: Number,
			default: null,
		},
		promo_price: {
			type: Number,
			default: null,
		},
		is_cocktail: {
			type: Boolean,
			default: false,
		},

		historiques: {
			type: [Object],
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('produit', ProduitSchema);
