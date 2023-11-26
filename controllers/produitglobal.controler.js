const { MARQUES, PAYS } = require("../constants");
const { categorieQueries } = require("../requests/categorieQueries");
const { produitQueries } = require("../requests/produitQueries");
const { uploadFile } = require("../utils/uploadFile");

exports.listeProduitGlobal = async (req, res) => {
    if (req.session.user) {
  
      try {
        const {result:productsGlobal} = await produitQueries.getGlobalProduit();
        
  
        res.render('listeproduitglobal', {
          productsGlobal: productsGlobal.map((product) => ({
            ...product._doc,
            country: PAYS.find((pays) => pays.code === product.country)?.nom || '',
          })),
          user: req.session.user,
        });
      } catch (e) {
        console.log('err', e);
        res.redirect(e);
      }
    } else {
      res.redirect('/');
    }
  };

exports.getProduitGlobal = async (req, res) => {
    const user = req.session.user;
    if (user) {
        try {
          const productId = req.query.productId;
          const {result:categories} = await categorieQueries.getCategorie();
          const {result:product} = productId ? await produitQueries.getGlobalProduitById(productId) : {result: null};

          if (categories) {
            res.render('ajouter_produit_global', {
              categories,
              user,
              product,
              brands: MARQUES,
              pays: PAYS,
            });
          }
        } catch (error) {
         
          res.status(500).send('Erreur serveur');
        }
      } else {
        res.redirect('/');
      }
  }
  
exports.postProduitGlobal = async (req, res) => {
    const file = req.file;
    const productId = req.body.productId;
   
   try{
 

        let result = null;

        let data = {
            nom_produit: req.body.nom_produit.trim(),
            categorie: req.body.categorie,
            country: req.body.country,
            brand: req.body.brand
          };


        if(productId){
            const {result:product} = await produitQueries.getGlobalProduitById(productId);

            if(!product){
                throw new Error('product not found');
            }

            result = file ? await uploadFile(file) : {Location:product.image};

            data = {
                nom_produit: (req.body.nom_produit || product.nom_produit).trim(),
                categorie: req.body.categorie || product.categorie,
                image: result?.Location || product.image,
                country: req.body.country || product.country,
                brand: req.body.brand || product.brand,
            }
        }

        if(!result && file){
            result = await uploadFile(file);
        }

        if(result){
            data.image = result.Location;
        }


    if(productId){
        await produitQueries.updateGlobalProduit(productId, data);

    }else{ 
     await produitQueries.setGlobalProduit(data);
    }
    //   //  res.send(200)
      res.redirect(productId ? 'listeproduitglobal':'/ajouter-produit-global');

   
   }catch(error){
    res.status(500).send({
        success:false,
        message: error.message || 'Something went wrong'
    })
   }
  }