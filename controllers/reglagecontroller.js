const { PAYS, TYPE_RETOUR_PRDUITS } = require('../constants');
const { settingQueries } = require('../requests/settingQueries');
const { userQueries } = require('../requests/UserQueries');
const bcrypt = require('bcryptjs');

exports.reglage = async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/');
            return;
        }

        const { result: user } = await userQueries.getUserById(req.session.user.id);
        const userSetting = await settingQueries.getSettingByUserId(user._id);

        res.render('reglage', {
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



exports.editUserReglage = async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/');
            return;
        }

       
    } catch (error) {
        res.redirect('/connexion');
    }
};
