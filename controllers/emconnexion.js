const { employeQueries } = require("../requests/EmployeQueries");
const bcrypt = require("bcryptjs");

exports.emconnexion = async (req, res) => {
  try {
    console.log(req.session);
    if (req.session.user) {
      res.redirect("/emdashboard");
    } else {
      res.render("emconnexion");
    }
  } catch (e) {
    console.log("err", e);
    res.redirect(e);
  }
};
exports.emconnexionPost = async (req, res) => {
  try {
    const body = req.body;

    const data = await employeQueries.getEmployeByEmail(body.email);

    if (data.result) {
      const isPasswordCorrect = true;

      if (isPasswordCorrect) {
        req.session.user = data.result;
        req.session.isAuth = true;

        res.render("emconnexion", {
          success: true,
        });
      } else {
        res.render("emconnexion", {
          error: "Email ou mot de passe incorrect",
        });
      }
    } else {
      res.render("emconnexion", {
        error: "Email ou mot de passe incorrect",
      });
    }
  } catch (e) {
    console.log("err", e);
    res.redirect(e);
  }
};
