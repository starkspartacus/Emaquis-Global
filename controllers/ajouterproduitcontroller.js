const { PRODUCT_SIZE } = require('../constants');
const { categorieQueries } = require('../requests/categorieQueries');
const { produitQueries } = require('../requests/produitQueries');

exports.addproduit = async (req, res) => {
  if (req.session.user) {
    try {
      let categorie = [];
      let sess = req.session.user;
      const Categorie = await categorieQueries.getCategorie();
      const resProduits = await produitQueries.getGlobalProduit();

      if (Categorie.result !== null) {
        const categories = Categorie.result;

        res.render('ajouterproduit', {
          categories: categories,
          produits: resProduits.result,
          user: sess,
          product_sizes: PRODUCT_SIZE,
        });
      }
    } catch (error) {
      res.redirect(error);
    }
  } else {
    res.redirect('/');
  }
};

exports.addproduitGlobal = async (req, res) => {
  if (req.session.user) {
    try {
      let sess = req.session.user;
      const Categorie = await categorieQueries.getCategorie();

      if (Categorie.result !== null) {
        const categories = Categorie.result;

        res.render('ajouter_produit_global', {
          categories: categories,
          user: sess,
        });
      }
    } catch (error) {
      res.redirect(error);
    }
  } else {
    res.redirect('/');
  }
};

exports.addproduitPost = async (req, res) => {
  if (req.session.user) {
    const data = {
      produit_id: req.body.nom_produit_id,
      prix_vente: parseInt(req.body.prix_vente),
      prix_achat: parseInt(req.body.prix_achat),
      quantite: parseInt(req.body.quantite),
      taille: req.body.taille,
      session: req.body.session,
    };
    console.log(data);
    const Result = await produitQueries.setProduit(data);
    console.log(Result);
    //  res.send(200)
    res.redirect('/listeproduit');
  }

  const description = req.body.description;
};
