exports.deconnexion = async (req, res) => {
  if (req.session.user) {
    await req.session.destroy();

    res.redirect('/');
  } else {
    res.redirect('/');
  }
};
