exports.profile = async(req,res)=>{
 
    try {
        console.log("userrrrrr",req.session.user)
       
        res.render("profile",{
            nom:req.session.user.nom,
            prenom:req.session.user.prenom,
            telephone:req.session.user.numero,
            adresse:req.session.user.adresse,
            email:req.session.user.email,
           
        })

    } catch (error) {
        res.redirect(error)

}
}