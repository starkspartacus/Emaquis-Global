exports.copyright = async(req,res)=>{
 
    try {
        res.render("copyright",)

    } catch (error) {
        res.redirect(error)

}
}