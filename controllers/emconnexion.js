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

    const data = await employeQueries.getEmployeByNumber(body.numero);

    const errorData = {
      error: 'Numero ou mot de passe incorrect ',
      numero: body.numero,
    };

    if (data.result?.role === 'Barman') {
      const isPasswordCorrect = bcrypt.compareSync(
        body.password,
        data.result.password
      );

      if (isPasswordCorrect) {
        req.session.user = data.result;

        console.log(JSON.stringify(data.result, null, 2));
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
