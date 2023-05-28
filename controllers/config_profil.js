const { PAYS } = require('../constants');

exports.config_profil = async (req, res) => {
  if (req.session.user) {
    try {
      const sess = req.session.user;
      res.render('config_profil', {
        user: sess,
        pays: PAYS,
      });
    } catch (error) {
      res.redirect(error);
    }
  } else {
    res.redirect('/');
  }
};

exports.config_profilPost = async (req, res) => {
  if (req.session.user) {
    try {
      res.render('config_profil');
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};
