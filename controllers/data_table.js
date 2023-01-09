
const { venteQueries } = require("../requests/venteQueries");

exports.data_table = async (req, res) => {
    try{
        const vente = await  venteQueries.getVentesById("62b444adad125d386cd0e17d");
        //  res.render('data_table')
         res.json(vente.result);

    }catch (e) {
         console.log('err', e);
         res.redirect(e)
     }
 };
 exports.data_tablePost = async (req, res) => {
     try{
             res.render('data_table')
        }catch (e) {
             console.log('err', e);
             res.redirect(e)
         }
     };
