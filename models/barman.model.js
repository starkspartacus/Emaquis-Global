const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BarmanSchema = new Schema({

    nom:{type:String, required:true },
    prenom:{type:String, required:true },
    adresse:{ type:String, required:true  },
    numero:{ type:String, required:true  },
    email:{ type:String,},
    travail_pour:{ type:Schema.Types.ObjectId, ref: 'user', required:true  },
    isAdmin: {
        type: Boolean,
        default: false,
      },
},
    { timestamps: true },
)

module.exports = mongoose.model('barman', BarmanSchema);