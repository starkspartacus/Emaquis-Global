const { commandeQueries } = require("../requests/commandeQueries");

exports.commande = async (req, res) => {
    try {
        sess = req.session.user;
        res.json(sess);
    } catch (e) {
        res.json({
            etat: false,
            data: "Error",
        });
    }
};
exports.commandePost = async (req, res) => {
    try {
        sess = req.session.user;
        const commande = req.body;
        let Commandes = {};
        if (commande !== null) {
            Commandes = await commandeQueries.setCommande(commande);
            if (Commandes.result !== null) {
                console.log(Commandes.result);
                res.json({
                    etat: true,
                    data: Commandes.result,
                });
            }
        } else {
            res.json({
                etat: false,
                data: "erreur",
            });
        }
       
    } catch (e) {
        res.json({
            etat: false,
            data: "Error",
        });
    }
};
