const { employeQueries } = require('../requests/EmployeQueries');
const { produitQueries } = require('../requests/produitQueries');
const { venteQueries } = require('../requests/venteQueries');
exports.dashboard = async (req, res) => {
  if (req.session.user) {
    let totalemploye;
    res.setHeader('Content-Type', 'text/html');
    const session = req.session.user;
    try {
      const Employe = await employeQueries.getAllEmploye();
      const Produit = await produitQueries.getProduit();
      const Vente = await venteQueries.getVente();
      let Result = [];
      let Tab = [];
      let Tvente = [];
      let sum = [];
      if (
        Employe.result !== null &&
        Produit.result !== null &&
        Vente.result !== null
      ) {
        let employe = Employe.result;
        let prod = Produit.result;
        let vente = Vente.result;
        employe.forEach(async (el) => {
          if (session.id == el.travail_pour) {
            Result.push(el);
            // console.log(Result)
          }
        });
        prod.forEach(async (el) => {
          if (session.id == el.session) {
            Tab.push(el);
            // console.log(Tab,'tab')
          }
        });

        vente.forEach(async (el) => {
          if (session.id == el.travail_pour) {
            Tvente.push(el);

            //   console.log(Tvente.produit.prix_vente,'Tvente')
            Tvente.forEach((element) => {
              // for(let i=0;i<Tvente.length;i++){
              //     sum.push(element.produit.prix_vente[i] *element.quantite[i])
              // }
              //     const qt= element.quantite;
              //     const prix =element.produit.prix_vente;
              //     const values = object.values(element);
              //    console.log(values.reduce((prix, qte) => prix * qte))
            });
          }
        });
        //console.log(Tvente,'Tvente')
        totalemploye = Result.length;

        res.render('dashboard', { totalemploye, Tab, user: session });
      }
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};

exports.dashboardPost = async (req, res) => {
  if (req.session.user) {
    res.setHeader('Content-Type', 'text/html');
    try {
      res.render('dashboard', { user: req.session.user });
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};
