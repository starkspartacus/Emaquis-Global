const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorieSchema = new Schema(
  {
    nom: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('categorie', CategorieSchema);
