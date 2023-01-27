const { PRODUCT_SIZE } = require('../constants');
const { categorieQueries } = require('../requests/categorieQueries');
const { produitQueries } = require('../requests/produitQueries');
exports.addproduit = async (req, res) => {
  // if (req.session.user) {
  try {
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
  // }else{
  //     res.redirect("/")
  // }
};

exports.addproduitPost = async (req, res) => {
  // if (req.session.user) {
  try {
    res.render('emajouterproduit');
  } catch (error) {
    res.redirect(error);
  }
  // }else{
  //     res.redirect("/")
  // }
};
