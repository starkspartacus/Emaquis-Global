const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StocksSchema = new Schema(
  {
    quantity: { type: Number, required: true },
    produit: { type: Schema.Types.ObjectId, ref: 'produit' },
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    categorie: { type: Schema.Types.ObjectId, ref: 'categorie' },
    image: { type: String },
    size: { type: String },
    travail_pour: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('stocks', StocksSchema);
