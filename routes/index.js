var express = require("express");
const generalcontroller = require("../controllers/general");
const userlistcontroller = require("../controllers/userlist");
const fournisseurcontroller = require("../controllers/fournisseur");
const ajouterusercontroller = require("../controllers/ajouteruser");
const data_tablecontroller = require("../controllers/data_table");
const inscriptioncontroller = require("../controllers/inscription");
const landingcontroller = require("../controllers/landing");
const connexioncontroller = require("../controllers/connexion");
const emconnexioncontroller = require("../controllers/emconnexion");
const dashboardcontroller = require("../controllers/dashboard");
const emdashboardcontroller = require("../controllers/emdashboard");
const deconnexioncontroller = require("../controllers/deconnexion");
const ajoutercategoriecontroller = require("../controllers/ajoutercategorie");
const listcategoriecontroller = require("../controllers/listcategorie");
const listefournisseurcontroller = require("../controllers/listefournisseur");
const emajouterproduitcontroller = require("../controllers/emajouterproduitcontroller");
const ajouterproduitcontroller = require("../controllers/ajouterproduitcontroller");
const listeproduitcontroller = require("../controllers/listeproduit");
const ventecontroller = require("../controllers/vente");
const commandecontroller = require("../controllers/commandecontroller");
const produitparcategorie_controller = require("../controllers/produitparcategorie_controller");
const usercategoriecontroller = require("../controllers/categorieparsuser_controller");
const allemployecontroller = require("../controllers/allemploye");
const barmanparusercontroller = require("../controllers/barmanparuser");
const employelogincontroller = require("../controllers/employelogin");
const retourcontroller = require("../controllers/retourproduit");
const contactcontroller = require("../controllers/contact");
const multer = require("multer");
const { produitQueries } = require("../requests/produitQueries");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    console.log(file);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

require("dotenv").config();
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");

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

router.get("/emconnexion", emconnexioncontroller.emconnexion);
router.post("/emconnexion", emconnexioncontroller.emconnexionPost);

router.get("/dashboard", dashboardcontroller.dashboard);
router.post("/dashboard", dashboardcontroller.dashboardPost);

router.get("/emdashboard", emdashboardcontroller.emdashboard);
router.post("/emdashboard", emdashboardcontroller.emdashboardPost);

router.get("/deconnexion", deconnexioncontroller.deconnexion);
router.post("/deconnexion", deconnexioncontroller.deconnexion);

router.get("/ajoutercategorie", ajoutercategoriecontroller.addcat);
router.post("/ajoutercategorie", ajoutercategoriecontroller.addcatPost);
router.get("/listcategorie", listcategoriecontroller.seecat);
router.post("/listcategorie", listcategoriecontroller.seecatPost);

router.get("/listeproduit", listeproduitcontroller.produit);
router.post("/listeproduit", listeproduitcontroller.produitPost);

router.get("/vente", ventecontroller.vente);
router.post("/vente", ventecontroller.ventePost);
router.post("/vente/status/:venteId", ventecontroller.editStatusVente);

router.post("/retournerproduit", retourcontroller.addbackPost);
router.get("/retournerproduit", retourcontroller.addback);
router.get("/listeRetour", retourcontroller.listeRetour);
router.post("/historiquevente", ventecontroller.venteListe);

router.get("/commande", commandecontroller.commande);
router.post("/commande", commandecontroller.commandePost);

router.get("/contact", contactcontroller.contact);
router.post("/contact", contactcontroller.contactPost);

router.get(
  "/produit_par_categorie",
  produitparcategorie_controller.categorieProduct
);
router.post(
  "/produit_par_categorie",
  produitparcategorie_controller.categorieProductPost
);

router.post(
  "/categorie_par_client",
  usercategoriecontroller.usercategoriesPost
);

router.get("/allemploye", allemployecontroller.allemploye);
router.get("/barmanparuser", barmanparusercontroller.barmanparuser);

router.post("/employelogin", employelogincontroller.employeloginPost);

router.get("/ajouterproduit", ajouterproduitcontroller.addproduit);
router.get("/emajouterproduit", emajouterproduitcontroller.addproduit);
// router.post("/ajouterproduit", ajouterproduitcontroller.addproduitPost);

router.post("/ajouterproduit", upload.single("image"), async (req, res) => {
  const file = req.file;
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_BUCKET_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SECRET_KEY;

  const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
  });

  // uploads a file to AWS Cloud s3
  function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.originalname,
      acl: "public-read",
    };
    return s3.upload(uploadParams).promise();
  }

  const result = await uploadFile(file);
  if (result) {
    const data = {
      nom_produit: req.body.nom_produit,
      categorie: req.body.categorie,
      prix_vente: parseInt(req.body.prix_vente),
      prix_achat: parseInt(req.body.prix_achat),
      quantite: parseInt(req.body.quantite),
      image: result.Location,
      session: req.body.session,
    };
    console.log(data);
    const Result = await produitQueries.setProduit(data);
    console.log(Result);
    //  res.send(200)
    res.redirect("/listeproduit");
  }

  const description = req.body.description;
});

router.post("/emajouterproduit", upload.single("image"), async (req, res) => {
  const file = req.file;
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_BUCKET_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SECRET_KEY;

  const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
  });

  // uploads a file to s3
  function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.originalname,
      acl: "public-read",
    };
    return s3.upload(uploadParams).promise();
  }

  const result = await uploadFile(file);
  if (result) {
    const data = {
      nom_produit: req.body.nom_produit,
      categorie: req.body.categorie,
      prix_vente: parseInt(req.body.prix_vente),
      prix_achat: parseInt(req.body.prix_achat),
      quantite: parseInt(req.body.quantite),
      image: result.Location,
      session: req.body.session,
    };
    console.log(data);
    console.log("okokokok");
    const Result = await produitQueries.setProduit(data);
    console.log(Result);
    res.send(200);
    res.redirect("/listeproduit");
  }

  const description = req.body.description;
});

module.exports = router;
