exports.profile = async(req,res)=>{
 
    try {
        res.render("profile",)

    } catch (error) {
        res.redirect(error)

}
}