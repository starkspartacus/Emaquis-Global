exports.deconnexion = (req, res) => {
    if (req.session.user) {
        delete req.session.user;
        res.redirect('/');
    } else {
        res.redirect('/');
    }

};

