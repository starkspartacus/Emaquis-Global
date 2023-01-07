const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    nom: { type: String },
    prenoms: { type: String },
    nom_etablissement: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    numero: { type: String, required: true },
    adresse: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', UserSchema);
