const { venteQueries } = require("../requests/venteQueries");
exports.emdashboard = async (req, res) => {
  try {
    const Vente = await venteQueries.getVentes({
      status_commande: "En attente",
    });

    const newSave = req.session.newSave;

    req.session.newSave = false;

    if (req.session.user) {
      res.render("emdashboard", {
        ventes: Vente.result,
        newSave: newSave,
        user: req.session.user,
      });
    } else {
      res.redirect("/emconnexion");
    }
  } catch (e) {
    console.log("err", e);
  }
};

exports.emdashboardPost = async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  try {
    res.render("emdashboard");
  } catch (e) {
    console.log("err", e);
    res.redirect(e);
  }
};
