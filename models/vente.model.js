const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VenteSchema = new Schema(
  {
    produit: [{ type: Schema.Types.ObjectId, ref: 'produit', required: true }],
    quantite: [{ type: Number, required: true }],
    status_commande: { type: String, default: 'En attente' },
    monnaie: { type: Number },
    prix: { type: Number, required: true },
    somme_encaisse: { type: Number },
    employe: { type: Schema.Types.ObjectId, ref: 'employe', required: true },
    employe_validate_id: { type: Schema.Types.ObjectId, ref: 'employe' },
    travail_pour: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    formules: {
      type: [
        {
          produit_name: { type: String, required: true },
          quantite: { type: Number, required: true },
          prix: { type: Number, required: true },
          prix_hors_promo: { type: Number, required: true },
          promo: { type: Boolean, required: true },
          promo_quantity: { type: Number, required: true },
          promo_price: { type: Number, required: true },
          taille: { type: String, required: true },
        },
      ],
    },
    table_number: { type: Number, default: null },
    amount_collected: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('vente', VenteSchema);
