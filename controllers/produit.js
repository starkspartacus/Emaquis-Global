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


  exports.produitBySession = async (req, res) => {
    // if (req.session.user) {
      try {
        const { id } = req.params;
        const produitBySession = await produitQueries.getProduitBySession(id);
        console.log(produitBySession)
        if (produitBySession.result.length===0 ) {
           return res.status(404).json({
            error: false,
            messageCode: "NotFound",
            message: "aucun produit trouvé.",
          });
        }
    
       return res.status(200).json({
          error: false,
          messageCode: "Success",
          message: "Succès",
          produitBySession,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: true,
          messageCode: "Error",
          message: "internal error",
        });
      }
    // } else {
    //   res.redirect('/');
    // }
  };
  

};
