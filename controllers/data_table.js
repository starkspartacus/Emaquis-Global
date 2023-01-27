const { venteQueries } = require('../requests/venteQueries');

exports.data_table = async (req, res) => {
  try {
    const user = req.session.user;
    if (user) {
      const ventes = await venteQueries.getVentes({
        travail_pour: user.id || user.travail_pour,
      });

      res.render('data_table', {
        ventes: ventes.result.map((el) => {
          return {
            ...el._doc,
            code: ('' + el._id).slice(-6).toUpperCase(),
            produit: el.produit.map((el) => el.produit.nom_produit).join(','),
            categories: [
              ...new Set(el.produit.map((el) => el.produit.categorie.nom)),
            ].join(','),
            employe: `${el.employe.nom} ${el.employe.prenom}`,
            createdAt: new Date(el.createdAt).toLocaleString(),
          };
        }),
      });
    } else {
      res.redirect('connexion');
    }
  } catch (e) {
    console.log('err', e);
    res.redirect('connexion');
  }
};
exports.data_tablePost = async (req, res) => {
  try {
    res.render('data_table');
  } catch (e) {
    console.log('err', e);
    res.redirect(e);
  }
};
