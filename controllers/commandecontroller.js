const { venteQueries } = require('../requests/venteQueries');

exports.commande = async (req, res) => {
  try {
    const travail_pour = req.body.session || req.session.user.travail_pour;

    const employeId = req.body.employe || req.session.user._id;

    const vente = await venteQueries.getVentes({
      travail_pour: travail_pour,
      employe: employeId,
    });

    if (vente) {
      res.json(vente.result);
    }
  } catch (e) {
    res.json({
      etat: false,
      data: 'Error',
    });
  }
};
exports.commandePost = async (req, res) => {
  try {
    sess = req.session.user;
    const commande = req.body;
    let Commandes = {};
    if (commande !== null) {
      Commandes = await commandeQueries.setCommande(commande);
      if (Commandes.result !== null) {
        console.log(Commandes.result);
        res.json({
          etat: true,
          data: Commandes.result,
        });
      }
    } else {
      res.json({
        etat: false,
        data: 'erreur',
      });
    }
  } catch (e) {
    res.json({
      etat: false,
      data: 'Error',
    });
  }
};
