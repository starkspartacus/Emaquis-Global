exports.faq = async(req,res)=>{
 
    try {
        res.render("faq",)

    } catch (error) {
        res.redirect(error)

}
}