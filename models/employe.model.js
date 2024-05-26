const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeSchema = new Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    role: { type: String, required: true },
    travail_pour: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    statut: { type: String, required: true },
    numero: { type: String, required: true },
    image: { type: String },
    adresse: { type: String, required: true },
    password: { type: String, required: true },
    deleted: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('employe', EmployeSchema);
