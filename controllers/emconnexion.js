

exports.emconnexion = async (req, res) => {
    try{
         res.render('emconnexion')
    }catch (e) {
         console.log('err', e);
         res.redirect(e)
     }
 };
 exports.emconnexionPost = async (req, res) => {
     try{
             res.render('emconnexion')
        }catch (e) {
             console.log('err', e);
             res.redirect(e)
         }
     };
 