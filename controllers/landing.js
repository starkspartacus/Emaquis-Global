

exports.landing = async (req, res) => {
    try{
         res.render('landing')
    }catch (e) {
         console.log('err', e);
         res.redirect(e)
     }
 };
 exports.landingPost = async (req, res) => {
     try{
             res.render('landing')
        }catch (e) {
             console.log('err', e);
             res.redirect(e)
         }
     };
