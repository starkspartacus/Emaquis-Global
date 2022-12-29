const { employeQueries } = require('../requests/EmployeQueries');
exports.userlist = async (req, res) => {
  if (req.session.user) {
    const session = req.session.user;
    console.log(session.id);
    try {
      const Employe = await employeQueries.getAllEmploye();
      let Result = [];
      if (Employe.result !== null) {
        let employe = Employe.result;
        employe.forEach(async (el) => {
          if (session.id == el.travail_pour) {
            Result.push(el);
          }
        });
        console.log(Result, 'zo');
        res.render('user_list', {
          Result: Result,
        });
      }
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};
exports.userlistPost = async (req, res) => {
  if (req.session.user) {
    try {
      const body = req.body;

      if (body.userId) {
        const Result = await employeQueries.deleteEmploye(body.userId);
        console.log(Result);
      }

      res.redirect('/utilisateur');
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};
