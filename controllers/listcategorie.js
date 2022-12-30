const { categorieQueries } = require('../requests/categorieQueries');
exports.seecat = async (req, res) => {
  if (req.session.user) {
    const session = req.session.user;
    try {
      const Categorie = await categorieQueries.getCategorie();
      const Categorieid = await categorieQueries.getCategorieById(req.query.id);
      if (Categorie.result !== null) {
        const categorie = await categorieQueries.getCategorie();
        let categories = categorie.result;

        res.render('listecategories', {
          categories: categories,
          user: req.session.user,
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

exports.seecatPost = async (req, res) => {
  if (req.session.user) {
    try {
      res.render('listecategories');
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};
