const { employeQueries } = require('../requests/EmployeQueries');
const bcrypt = require('bcryptjs');

exports.emconnexion = async (req, res) => {
  try {
    console.log(req.session);
    if (req.session.user) {
      res.redirect('/emdashboard');
    } else {
      res.render('emconnexion');
    }
  } catch (e) {
    console.log('err', e);
    res.redirect(e);
  }
};
exports.emconnexionPost = async (req, res) => {
  try {
    const body = req.body;

    const data = await employeQueries.getEmployeByEmail(body.email);
    console.log(await employeQueries.getAllEmploye(body.email));
    const errorData = {
      error: 'Email ou mot de passe incorrect',
      email: body.email,
    };

    if (data.result?.role === 'Barman') {
      const isPasswordCorrect = bcrypt.compareSync(
        body.password,
        data.result.password
      );

      if (isPasswordCorrect) {
        req.session.user = data.result;

        // console.log(data.result);
        req.session.isAuth = true;

        res.render('emconnexion', {
          success: true,
        });
      } else {
        res.render('emconnexion', errorData);
      }
    } else {
      res.render('emconnexion', errorData);
    }
  } catch (e) {
    console.log('err', e);
    res.redirect(e);
  }
};
