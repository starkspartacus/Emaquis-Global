const { employeQueries } = require('../requests/EmployeQueries');

exports.ajouteruser = async (req, res) => {
  if (req.session.user) {
    try {
      sess = req.session.user;
      res.render('add_new_user', { user: sess });
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};
exports.ajouteruserPost = async (req, res) => {
  if (req.session.user) {
    try {
      res.render('add_new_user');
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};

exports.edituser = async (req, res) => {
  if (req.session.user) {
    try {
      const id = req.query.user_id;
      const user = await employeQueries.getEmployeById(id);
      console.log('👉 👉 👉  ~ file: ajouteruser.js:34 ~ user', user);
      if (user) {
        sess = req.session.user;
        res.render('add_new_user', {
          employe: user.result,
          user: sess,
          update: true,
        });
      } else {
        res.redirect('/utilisateur');
      }
    } catch (e) {
      console.log('err', e);
      res.redirect('/');
    }
  }
};
