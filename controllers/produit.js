const { produitQueries } = require('../requests/produitQueries');

exports.produitsList = async (req, res) => {
  const user = req.session.user;
  if (user) {
    const result = await produitQueries.getProduitBySession(
      user.id || user._id
    );

    res.send({ data: result.result, success: result.etat });
  } else {
    res.send({ data: [], success: false });
  }
};

exports.produits = async (req, res) => {
  if (req.session.user) {
    try {
      sess = req.session.user;
      const Produit = await produitQueries.getProduit();
      const ProduitbyID = await produitQueries.getProduitById(req.query.id);
      if (Produit.result !== null) {
        const Produit = await produitQueries.getProduit(ProduitbyID);
        res.render('ajouterproduit', { data: Produit.result, sess });
      }

      //
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};

exports.produitsPost = async (req, res) => {
  if (req.session.user) {
    try {
      res.render('ajouterproduit');
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};
