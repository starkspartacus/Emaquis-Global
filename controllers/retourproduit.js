const { produitQueries } = require("../requests/produitQueries");

exports.addback = async (req, res) => {
  try {
    const { result: products } = await produitQueries.getProduit();

    res.render("retour", {
      user: req.session.user,
      products,
    });
  } catch (error) {
    res.redirect(error);
  }
};

exports.addbackPost = async (req, res) => {
  try {
    console.log(req.body, "body");
    res.render("retour");
  } catch (error) {
    res.redirect(error);
  }
};
