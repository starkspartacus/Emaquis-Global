const { produitQueries } = require('../requests/produitQueries');

exports.produit = async (req, res) => {
  if (req.session.user) {
    const session = req.session.user;

    try {
      const products = await produitQueries.getProduitBySession(
        session.id || session.travail_pour
      );

      res.render('listeproduit', {
        Result: products.result,
        user: req.session.user,
      });
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};

exports.produitPost = async (req, res) => {
  if (req.session.user) {
    try {
      res.render('listeproduit');
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};
