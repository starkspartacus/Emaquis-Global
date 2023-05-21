const mongoose = require('mongoose');

const SettingModel = new mongoose.Schema({
  product_return_type: {
    type: String,
    default: 'full', //full | halt | tip
  },
  objective: {
    type: Number,
    default: 20000,
  },
  travail_pour: {
    type: String,
  },
  numberOfTables: {
    type: Number,
    default: 100,

  },
});

module.exports = mongoose.model('Setting', SettingModel);
