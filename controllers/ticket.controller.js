const puppeteer = require('puppeteer');
const path = require('path');
const ejs = require('ejs');
const { venteQueries } = require('../requests/venteQueries');
const { userQueries } = require('../requests/UserQueries');
const { employeQueries } = require('../requests/EmployeQueries');
const { calculPromoTotal } = require('../utils/calculPromoTotal');

exports.generateTicket = async (req, res) => {
  try {
    const user = req.session.user;
    if (user) {
      const adminId = user.travail_pour || user.id || user._id;
      const orderId = req.params.orderId;

      const admin = await userQueries.getUserById(adminId);
      const venteRes = await venteQueries.getVentesById(orderId);
      const vente = venteRes.result;
      const barman = await employeQueries.getEmployeById(vente.employe);

      if (vente) {
        const browser = await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const data = {
          vente: {
            ...vente._doc,
            produit: vente.produit.map((p, index) => ({
              ...p._doc,
              total_price: p.promo
                ? parseInt(vente.quantite[index] / p.promo_quantity) *
                    p.promo_price +
                  (vente.quantite[index] % p.promo_quantity) * p.prix_vente
                : p.prix_vente * vente.quantite[index],
            })),
          },
          barman: barman.result.nom,
          nom_etablissement: admin.result.nom_etablissement,
          adresse: admin.result.adresse,
          telephone: admin.result.telephone,
          email: admin.result.email,
          country: admin.result.country,
          city: admin.result.city,
          total: vente.produit.reduce((acc, curr, index) => {
            let prix_vente = curr.prix_vente;

            if (curr.promo) {
              prix_vente = calculPromoTotal(curr, vente.quantite[index]);
            }

            return acc + prix_vente * (curr.promo ? 1 : vente.quantite[index]);
          }, 0),
          id_vente: vente._id.toString().slice(-8),
        };

        const htmlContent = await ejs.renderFile(
          path.join(__dirname, '../templates/orderTicket.ejs'),
          data
        );

        await page.setContent(htmlContent);

        const pdf = await page.pdf();

        browser.close();

        res.contentType('application/pdf');
        res.send(pdf);
      } else {
        res.send("La commande n'existe pas");
      }
    } else {
      res.send('Vous devez être connecté pour accéder à cette page');
    }
  } catch (err) {
    console.log('👉 👉 👉  ~ file: ticket.controller.js:62 ~ err:', err);
    res.send("Une erreur s'est produite, veuillez réessayer plus tard");
  }
};
