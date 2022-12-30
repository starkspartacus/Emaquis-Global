const { categorieQueries } = require('../requests/categorieQueries');
exports.addproduit = async (req, res) => {
  // if (req.session.user) {
  try {
    //   let sess= req.session.user;
    const Categorie = await categorieQueries.getCategorie();

    if (Categorie.result !== null) {
      const categories = Categorie.result;

      res.render('emajouterproduit', { categorie: categories, user: sess });
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
