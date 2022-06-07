const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommandeSchema = new Schema({
    produit:{ type:Schema.Types.ObjectId, ref: 'produit', required:true },
    employe:{ type:Schema.Types.ObjectId, ref: 'employe', required:true  },
    travail_pour:{type:Schema.Types.ObjectId, ref: 'user', required:true},
    quantite:{type:Number,required:true},
    statut_commande:{type:Number, default:0, required:true},
    barman:{type:Schema.Types.ObjectId, ref: 'barman', required:true},

},
{ timestamps: true },)

module.exports = mongoose.model('commande', CommandeSchema);