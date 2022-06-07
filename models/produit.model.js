const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProduitSchema = new Schema({
    nom_produit:{ type:String, required:true},
    categorie:{ type:Schema.Types.ObjectId, ref: 'categorie', required:true },
    prix_vente:{type:Number,required:true},
    prix_achat:{type:Number,required:true},
    quantite:{type:Number,required:true},
    image:{type:String, default: "01.jpg"},
    session:{ type:Schema.Types.ObjectId, ref: 'user', required:true  },

},
{ timestamps: true },)

module.exports = mongoose.model('produit', ProduitSchema);