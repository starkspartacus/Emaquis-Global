
const { venteQueries } = require("../requests/venteQueries");
exports.emdashboard = async (req, res) => {
  
    try {
       
        // const Vente = await produitQueries.getProduit();
     
            res.render('emdashboard')
        

    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }
 
};

exports.emdashboardPost = async (req, res) => {
        res.setHeader('Content-Type', 'text/html')
    try {
        res.render('emdashboard')

    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }
  
};



