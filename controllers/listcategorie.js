const { categorieQueries } = require('../requests/categorieQueries');

exports.categoriesList = async (req, res) => {
  const user = req.session.user;
  if (user) {
    const result = await categorieQueries.getCategorie();
    res.send({ data: result.result, success: result.etat });
  } else {
    res.send({ data: [], success: false });
  }
};

exports.seecat = async (req, res) => {
  if (req.session.user) {
    try {
      const Categorie = await categorieQueries.getCategorie();

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
