const { fournisseurQueries } = require('../requests/fournisseurQueries');
exports.fournisseur = async (req, res) => {
  if (req.session.user) {
    const session = req.session.user;
    try {
      const Fournisseur = await fournisseurQueries.getFournisseurs();
      const Fournisseurid = await fournisseurQueries.getFournisseursById(
        req.query.id
      );
      let Result = [];
      if (Fournisseur.result !== null) {
        const fournisseur = await fournisseurQueries.getFournisseurs(
          Fournisseurid
        );
        let four = fournisseur.result;
        four.forEach(async (el) => {
          if (session.id == el.travail_pour) {
            Result.push(el);
          }
        });
        console.log(Result, 'zoo');
        res.render('listefournisseur', { Result, user: req.session.user });
      }
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};

exports.fournisseurPost = async (req, res) => {
  if (req.session.user) {
    try {
      res.render('listefournisseur');
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};
