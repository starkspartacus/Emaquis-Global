const billetModel = require('../models/billet.model');
const venteModel = require('../models/vente.model');

exports.getOneBillet = async (req, res) => {
  if (req.session.user) {
    try {
      const billet = await billetModel.findOne({
        employe_id: req.params.id,
        is_closed: false,
      });
      if (billet) {
        res.json({
          etat: true,
          data: billet,
        });
      } else {
        res.json({
          etat: false,
          message: 'billet not found',
        });
      }
    } catch (error) {
      res.json({
        etat: false,
        message: error.message,
      });
    }
  } else {
    res.status(401).send({
      error: 'error signature',
    });
  }
};

exports.openBillet = async (req, res) => {
  if (req.session.user) {
    try {
      const body = req.body;

      let billet = await billetModel.findOne({
        employe_id: body.employe_id,
        is_closed: false,
      });

      if (!billet) {
        billet = new billetModel({
          employe_id: body.employe_id,
          open_hour: new Date(),
          travail_pour: req.session.user.travail_pour,
        });

        await billet.save();
      }

      if (billet) {
        res.json({
          etat: true,
          data: billet,
        });
      }
    } catch (error) {
      res.json({
        etat: false,
        message: error.message,
      });
    }
  } else {
    res.status(401).send({
      error: 'error signature',
    });
  }
};

exports.closeBillet = async (req, res) => {
  if (req.session.user) {
    try {
      const body = req.body;

      let billet = await billetModel.findOne({
        employe_id: body.employe_id,
        is_closed: false,
      });

      if (billet) {
        const commonProperties = {
          for_employe: body.employe_id,
          createdAt: {
            $gte: new Date(new Date(billet.open_hour)),
            $lte: new Date(),
          },
        };
        const ventes = await venteModel.find({
          ...commonProperties,
          status_commande: 'En attente',
        });

        if (ventes && ventes?.length > 0) {
          res.status(400).send({
            message: `Vous avez ${ventes.length} commandes en attente, veuillez les valider avant de fermer la caisse. (Voir la liste des commandes en attente)`,
          });
        } else {
          billet.is_closed = true;
          billet.close_hour = new Date();

          const ventesConfirme = await venteModel.find({
            ...commonProperties,
            employe_validate_id: body.employe_id,
            status_commande: 'Validée',
          });
          const ventesAnnule = await venteModel.find({
            ...commonProperties,
            employe_validate_id: body.employe_id,
            status_commande: 'Annulée',
          });

          billet.total_order_validated = ventesConfirme.length;
          billet.total_order_canceled = ventesAnnule.length;
          billet.total_order = ventesConfirme.length + ventesAnnule.length;
          billet.total_amount = ventesConfirme.reduce(
            (acc, vente) => acc + vente.prix,
            0
          );

          await billet.save();
          res.json({
            etat: true,
            data: billet,
          });
        }
      } else {
        res.status(404).send({
          error: 'billet not found',
        });
      }
    } catch (error) {
      res.json({
        etat: false,
        message: error.message,
      });
    }
  } else {
    res.status(401).send({
      error: 'error signature',
    });
  }
};
