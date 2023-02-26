const { categorieQueries } = require('../requests/categorieQueries');

exports.addcat = async (req, res) => {
  if (req.session.user) {
    try {
      sess = req.session.user;

      //console.log(sess.id,"sqddsddqs")
      res.render('ajoutercategorie', {
        user: sess,
        categorie: null,
      });
    } catch (error) {
      console.log('👉 👉 👉  ~ file: ajoutercategorie.js:21 ~ error:', error);
      res.redirect(error);
    }
  } else {
    res.redirect('/');
  }
};

exports.editCat = async (req, res) => {
  if (req.session.user) {
    try {
      sess = req.session.user;
      const catId = req.query.catId;
      let categorie = null;

      if (catId) {
        categorie = await categorieQueries.getCategorieById(catId);
      }

      //console.log(sess.id,"sqddsddqs")
      res.render('ajoutercategorie', {
        user: sess,
        categorie: categorie?.result,
      });
    } catch (error) {
      res.redirect(error);
    }
  } else {
    res.redirect('/');
  }
};

exports.deleteCat = async (req, res) => {
  if (req.session.user) {
    const catId = req.params.catId;

    const cat = await categorieQueries.deleteCategorie(catId);

    if (cat.result) {
      res.status(200).json({
        message: 'Categorie supprimée avec succès',
      });
    } else {
      res.status(500).json({
        message: 'Erreur lors de la suppression de la categorie',
      });
    }
  } else {
    res.redirect('/');
  }
};

exports.addcatPost = async (req, res) => {
  if (req.session.user) {
    try {
      res.render('ajoutercategorie');
    } catch (error) {
      res.redirect(error);
    }
  } else {
    res.redirect('/');
  }
};
