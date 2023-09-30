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
    adresse: { type: String },
    country: { type: String },
    city: { type: String },
    square: { type: String },
    othersquare: { type: String },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    timings: {
      type: [
        {
          day: { type: Number },
          name: { type: String },
          start: { type: String },
          end: { type: String },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', UserSchema);
