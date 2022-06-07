

exports.data_table = async (req, res) => {
    try{
         res.render('data_table')
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
