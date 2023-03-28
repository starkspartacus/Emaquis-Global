const { PAYS, TYPE_RETOUR_PRDUITS } = require('../constants');
const { settingQueries } = require('../requests/settingQueries');
const { userQueries } = require('../requests/UserQueries');
const bcrypt = require('bcryptjs');

exports.profile = async (req, res) => {
  try {
    if (!req.session.user) {
      res.redirect('/');
      return;
    }

    const { result: user } = await userQueries.getUserById(req.session.user.id);
    const userSetting = await settingQueries.getSettingByUserId(user._id);

    res.render('profile', {
      user: {
        ...req.session.user,
        ...user._doc,
        product_return_type: userSetting.result.product_return_type,
        objective: userSetting.result.objective,
        numberOfTables: userSetting.result.numberOfTables,
      },
      pays: PAYS,
      retour_produits_types: TYPE_RETOUR_PRDUITS,
    });
  } catch (error) {
    res.redirect(error);
  }
};

exports.editUserProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      res.redirect('/');
      return;
    }

    const user = req.session.user;

    const body = req.body;

    const data = {
      nom: body.nom,
      prenoms: body.prenoms,
      nom_etablissement: body.nom_etablissement,
      email: body.email,
      numero: body.numero,
      adresse: body.adresse,
      ville: body.ville,
      code_postal: body.code_postal,
      country: body.country,
      city: body.city,
    };

    if (body.newPassword && body.newPassword === body.confirmPassword) {
      const encryptedPassword = await bcrypt.hash(body.newPassword, 10);

      data.password = encryptedPassword;
    }

    const userUpdate = await userQueries.updateUser(user.id, data);

    if (req.body.product_return_type) {
      await settingQueries.updateSetting(user.id, {
        product_return_type: req.body.product_return_type,
        objective: req.body.objective || 0,
        numberOfTables: req.body.numberOfTables || 0,
      });
    }

    if (userUpdate.etat) {
      res.redirect('/profile');
    }
  } catch (error) {
    res.redirect('/connexion');
  }
};
