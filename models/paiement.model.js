const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaiementSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    montant : {
        type: Number,
        required: true
      },
},
    { timestamps: true }
)

module.exports = mongoose.model('paiement', PaiementSchema);