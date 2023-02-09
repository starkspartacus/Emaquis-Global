const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RetourSchema = new Schema(
  {
    produit: [
      {
        type: Schema.Types.ObjectId,
        ref: 'produit',
        required: true,
      },
    ],

    remboursement: {
      type: Number,
      required: true,
    },
    quantite: {
      type: Array,
      required: true,
    },
    employe: { type: Schema.Types.ObjectId, ref: 'employe', required: true },
    travail_pour: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    client_name: {
      type: String,
    },
    product_return_type: {
      type: String,
      default: 'full', //full | halt | tip
    },
    confirm: {
      type: Boolean,
      default: false,
    },
    confirm_by: {
      type: Schema.Types.ObjectId,
      ref: 'employe',
    },
    stock_return: {
      type: Boolean,
      default: false,
    },
    dateline: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('remboursement', RetourSchema);
