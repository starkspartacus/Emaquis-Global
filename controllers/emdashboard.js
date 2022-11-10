const { venteQueries } = require("../requests/venteQueries");
const { produitQueries } =  require("../requests/produitQueries")
const { employeQueries } = require("../requests/EmployeQueries")
exports.emdashboard = async (req, res) => {
  try {
    const Vente = await venteQueries.getVentes({
      status_commande: "En attente",
    });
    let employenum=[];
    let sum=[];
    const newSave = req.session.newSave;
   

    req.session.newSave = false;
 
     const produit = await produitQueries.getProduit({
      session :req.session.user.travail_pour
    })
    const  employenumber = await employeQueries.getAllEmploye({
      travail_pour :req.session.user.travail_pour
    })

    employenumber.result.forEach( async el=>{
      employenum.push(el);   
  })
  const sumvente = await   venteQueries.getVentes({
    status_commande :"Validée",
    travail_pour :req.session.user.travail_pour
  });

 
  sumvente.result.forEach( async el=>{
                

    sum.push(el);
        
    //   console.log(Tvente.produit.prix_vente,'Tvente')
    sum.forEach(element => {
      //   for(let i=0;i<sum.length;i++){
      //       sum.push(element.produit.prix_vente[i] *element.quantite[i])
      //   }
      //   const qt= element.quantite;
      //   const prix =element.produit.prix_vente;
      //   const values = object.values(element);
      //  console.log(values.reduce((prix, qte) => prix * qte)) 
        
    }); 
    

 })





    if (req.session.user.role === "Barman") {
      res.render("emdashboard", {
        ventes: Vente.result,
        newSave: newSave,
        user: req.session.user,
        Produit:produit.result,
        emplnum : employenum.length,
       
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
