const settingsModel = require("../models/settings.model");

exports.settingQueries = class {
  static setSetting(data) {
    return new Promise(async (next) => {
      const setting = new settingsModel({
        product_return_type: data.product_return_type,
        travail_pour: data.travail_pour,
      });

      await setting
        .save()
        .then((res) => {
          next({
            etat: true,
            result: res,
          });
        })
        .catch((err) => {
          next({
            etat: false,
            err: err,
          });
        });
    });
  }

  static getSettingByUserId(travail_pour) {
    try {
      return new Promise(async (next) => {
        settingsModel
          .findOne({
            travail_pour,
          })
          .then((data) => {
            next({
              etat: true,
              result: data,
            });
          })
          .catch((err) => {
            next({
              etat: false,
              err: err,
            });
          });
      });
    } catch (error) {
      console.log(error);
    }
  }
};
