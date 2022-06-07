var express = require("express");
const generalcontroller = require("../controllers/general");
const userlistcontroller = require("../controllers/userlist");
const fournisseurcontroller = require("../controllers/fournisseur");
const ajouterusercontroller = require("../controllers/ajouteruser");
const data_tablecontroller = require("../controllers/data_table");
const inscriptioncontroller = require("../controllers/inscription");
const landingcontroller = require("../controllers/landing");
const connexioncontroller = require("../controllers/connexion");
const dashboardcontroller = require("../controllers/dashboard");
const deconnexioncontroller = require("../controllers/deconnexion");
const ajoutercategoriecontroller = require("../controllers/ajoutercategorie");
const listcategoriecontroller = require("../controllers/listcategorie");
const listefournisseurcontroller = require("../controllers/listefournisseur");
const ajouterproduitcontroller = require("../controllers/ajouterproduitcontroller");
const listeproduitcontroller = require("../controllers/listeproduit");
const ventecontroller = require("../controllers/vente");
const commandecontroller = require("../controllers/commandecontroller");
const produitparcategorie_controller = require("../controllers/produitparcategorie_controller");
const usercategoriecontroller = require("../controllers/categorieparsuser_controller");
const allemployecontroller = require("../controllers/allemploye");
const barmanparusercontroller = require("../controllers/barmanparuser");
const employelogincontroller = require("../controllers/employelogin");

var router = express.Router();

/* GET home page. */

router.get("/", generalcontroller.index);
router.post("/", generalcontroller.index);

router.get("/utilisateur", userlistcontroller.userlist);
router.post("/utilisateur", userlistcontroller.userlistPost);

router.get("/fournisseur", fournisseurcontroller.fournisseur);
router.post("/fournisseur", fournisseurcontroller.fournisseurPost);
router.get("/listefournisseur", listefournisseurcontroller.fournisseur);
router.post("/listefournisseur", listefournisseurcontroller.fournisseurPost);

router.get("/ajouteruser", ajouterusercontroller.ajouteruser);
router.post("/ajouteruser", ajouterusercontroller.ajouteruserPost);

router.get("/data_table", data_tablecontroller.data_table);
router.post("/data_table", data_tablecontroller.data_tablePost);

router.get("/inscription", inscriptioncontroller.inscription);
router.post("/inscription", inscriptioncontroller.inscriptionPost);

router.get("/connexion", connexioncontroller.connexion);
router.post("/connexion", connexioncontroller.connexionPost);

router.get("/dashboard", dashboardcontroller.dashboard);
router.post("/dashboard", dashboardcontroller.dashboardPost);

router.get("/deconnexion", deconnexioncontroller.deconnexion);
router.post("/deconnexion", deconnexioncontroller.deconnexion);

router.get("/ajoutercategorie", ajoutercategoriecontroller.addcat);
router.post("/ajoutercategorie", ajoutercategoriecontroller.addcatPost);
router.get("/listcategorie", listcategoriecontroller.seecat);
router.post("/listcategorie", listcategoriecontroller.seecatPost);

router.get("/ajouterproduit", ajouterproduitcontroller.addproduit);
router.post("/ajouterproduit", ajouterproduitcontroller.addproduitPost);
router.get("/listeproduit", listeproduitcontroller.produit);
router.post("/listeproduit", listeproduitcontroller.produitPost);

router.get("/vente", ventecontroller.vente);
router.post("/vente", ventecontroller.ventePost);

router.get("/commande", commandecontroller.commande);
router.post("/commande", commandecontroller.commandePost);

router.get("/produit_par_categorie", produitparcategorie_controller.categorieProduct);
router.post("/produit_par_categorie", produitparcategorie_controller.categorieProductPost);

router.post(
  "/categorie_par_client",
  usercategoriecontroller.usercategoriesPost
);

router.get("/allemploye", allemployecontroller.allemploye);
router.get("/barmanparuser", barmanparusercontroller.barmanparuser);


router.post("/employelogin", employelogincontroller.employeloginPost);

module.exports = router;
