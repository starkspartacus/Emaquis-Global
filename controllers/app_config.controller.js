const app_configModel = require('../models/app_config.model');

exports.getAppConfig = async (req, res) => {
  try {
    const appConfig = await app_configModel.findOne();
    res.status(200).json({
      data: appConfig,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la récupération de la configuration de l'application",
    });
  }
};
