const mongoose = require('mongoose');

const SettingModel = new mongoose.Schema({
  product_return_type: {
    type: String,
    default: 'full', //full | halt | tip
  },
  objective: {
    type: Number,
    default: 0,
  },
  travail_pour: {
    type: String,
  },
});

module.exports = mongoose.model('Setting', SettingModel);
