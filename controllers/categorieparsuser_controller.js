const { categorieQueries } = require('../requests/categorieQueries');

exports.usercategoriesPost = async (req, res) => {
  try {
    if (req.session.user) {
      user_sess = req.body._id;
      if (user_sess !== null) {
        const Categorie = await categorieQueries.getCategorie();
        let resultat = [];
        if (Categorie.result !== null) {
          let cat = Categorie.result;
          cat.forEach((el) => {
            if (el.categorie_pour == user_sess) {
              resultat.push(el);
              console.log(resultat, 'el');
            }
          });
          if (resultat.length <= 0) {
            res.status(400).send({ data: 'Categorie inconnu', success: false });
          } else {
            res.status(200).send({ data: { resultat }, success: true });
          }
        }
      }
    } else {
      res.status(400).send({ data: 'veuillez vous connecter', success: false });
    }
  } catch (e) {
    console.log('err', e);
  }
};
