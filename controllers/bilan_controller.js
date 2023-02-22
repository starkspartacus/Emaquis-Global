exports.bilan = async (req, res) => {
    if (req.session.user) {
        try {
            let sess = req.session.user;
            //console.log(sess.id,"sqddsddqs")
            res.render('bilan', {   user: sess, });
        } catch (error) {
            res.redirect(error);
        }
    } else {
        res.redirect('/');
    }
};

exports.bilanPost = async (req, res) => {
    if (req.session.user) {
        try {
            res.render('bilan');
        } catch (error) {
            res.redirect(error);
        }
    } else {
        res.redirect('/');
    }
};