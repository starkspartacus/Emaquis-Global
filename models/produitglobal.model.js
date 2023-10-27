const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProduitSchema = new Schema(
  {
    nom_produit: { type: String, required: true },
    categorie: {
      type: Schema.Types.ObjectId,
      ref: 'categorie',
      required: true,
    },
    image: { type: String, default: '01.jpg' },
    marque: { type: String, required: false },
    pays: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = produitGlobal = mongoose.model(
  'produit-global',
  ProduitSchema
);
