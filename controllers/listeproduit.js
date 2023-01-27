const { produitQueries } = require('../requests/produitQueries');

exports.produit = async (req, res) => {
  if (req.session.user) {
    const session = req.session.user;

    try {
      const Produit = await produitQueries.getProduit();

      const Produitid = await produitQueries.getProduitById(req.query.id);
      let Result = [];
      if (Produit.result !== null) {
        const produit = await produitQueries.getProduit(Produitid);
        let prod = produit.result;
        prod.forEach(async (el) => {
          if (session.id == el.session || session.travail_pour == el.session) {
            Result.push(el);
          }
        });
      }

      res.render('listeproduit', { Result, user: req.session.user });
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
