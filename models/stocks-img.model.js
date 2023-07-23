const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StocksImgSchema = new Schema(
  {
    produit: { type: Schema.Types.ObjectId, ref: 'produit-global' },
    categorie: { type: Schema.Types.ObjectId, ref: 'categorie' },
    image: { type: String },
    size: { type: String },
    stockType: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('stocks-img', StocksImgSchema);
