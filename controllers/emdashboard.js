
const { venteQueries } = require("../requests/venteQueries");
exports.emdashboard = async (req, res) => {
  
    try {
       
        const Vente = await venteQueries.getVentes({status_commande:"En attente"});
        //    if( Vente.result !== null){
        //     console.log("try",Vente.result)
        //    }
        //    res.render('emdashboard')
        res.json(Vente.result)
        

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



