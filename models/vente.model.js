const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VenteSchema = new Schema(
  {
    produit: [{ type: Schema.Types.ObjectId, ref: "produit", required: true }],
    quantite: [{ type: Number, required: true }],
    status_commande: { type: String, default: "En attente" },
    monnaie: { type: Number },
    prix: { type: Number, required: true },
    somme_encaisse: { type: Number },
    employe: { type: Schema.Types.ObjectId, ref: "employe", required: true },
    travail_pour: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("vente", VenteSchema);
