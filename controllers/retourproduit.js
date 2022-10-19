exports.addback = async(req,res)=>{
    
    try {
       
       
        res.render("retour")

    } catch (error) {
        res.redirect(error)
    }

}

exports.addbackPost = async(req,res)=>{
   
    try {
        res.render("retour")

    } catch (error) {
        res.redirect(error)
    }  

}