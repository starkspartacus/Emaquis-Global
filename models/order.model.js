const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    produit: [
      {
        produit: {
          type: Schema.Types.ObjectId,
          ref: 'produit-global',
        },
        prix_vente: { type: Number },
        prix_achat: { type: Number },
        taille: { type: String },
        quantite: { type: Number },
        session: { type: Schema.Types.ObjectId, ref: 'user' },
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

        historiques: {
          type: [Object],
        },
        productId: { type: String },
      },
    ],
    quantite: [{ type: Number }],
    status_commande: { type: String, default: 'En attente' },
    monnaie: { type: Number },
    prix: { type: Number },
    somme_encaisse: { type: Number },
    employe: { type: Schema.Types.ObjectId, ref: 'employe' },
    employe_validate_id: { type: Schema.Types.ObjectId, ref: 'employe' },
    travail_pour: { type: Schema.Types.ObjectId, ref: 'user' },
    formules: {
      type: [
        {
          produit_name: { type: String },
          quantite: { type: Number },
          prix: { type: Number },
          prix_hors_promo: { type: Number },
          promo: { type: Boolean },
          promo_quantity: { type: Number },
          promo_price: { type: Number },
          taille: { type: String },
        },
      ],
    },
    table_number: { type: Number, default: null },
    amount_collected: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('order', OrderSchema);
