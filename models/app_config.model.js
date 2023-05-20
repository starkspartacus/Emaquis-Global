const moongoose = require('mongoose');

const appConfigSchema = new moongoose.Schema(
  {
    name: {
      type: String,
    },
    version: {
      type: String,
    },
  },
  {
    collection: 'app_config',
  }
);

module.exports = moongoose.model('AppConfig', appConfigSchema);
