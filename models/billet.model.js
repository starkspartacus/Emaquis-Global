const mongoose = require('mongoose');

const billetSchema = new mongoose.Schema({
  open_hour: {
    type: Date,
  },
  close_hour: {
    type: Date,
  },
  open_amount: {
    type: Number,
  },
  close_amount: {
    type: Number,
  },
  total_amount: {
    type: Number,
  },
  total_order: {
    type: Number,
  },
  total_order_validated: {
    type: Number,
  },
  total_order_canceled: {
    type: Number,
  },
  is_closed: {
    type: Boolean,
    default: false,
  },
  employe_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employe',
    required: true,
  },
  travail_pour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  created_at: {
    type: Date,
  },
});

billetSchema.pre('save', function (next) {
  const billet = this;

  billet.created_at = new Date();

  next();
});

module.exports = mongoose.model('Billet', billetSchema);
