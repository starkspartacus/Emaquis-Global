const puppeteer = require('puppeteer');
const path = require('path');
const ejs = require('ejs');
const { venteQueries } = require('../requests/venteQueries');
const { userQueries } = require('../requests/UserQueries');
const { employeQueries } = require('../requests/EmployeQueries');

exports.generateTicket = async (req, res) => {
  try {
    const user = req.session.user;
    if (user) {
      const adminId = user.travail_pour || user.id || user._id;
      const orderId = req.params.orderId;

      const admin = await userQueries.getUserById(adminId);
      const vente = await venteQueries.getVentesById(orderId);
      const barman = await employeQueries.getEmployeById(vente.result.employe);

      if (vente.result) {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const htmlContent = await ejs.renderFile(
          path.join(__dirname, '../templates/orderTicket.ejs'),
          {
            vente: vente.result,
            barman: barman.result.nom,
            nom_etablissement: admin.result.nom_etablissement,
            adresse: admin.result.adresse,
            telephone: admin.result.telephone,
            email: admin.result.email,
            country: admin.result.country,
            city: admin.result.city,
            total: vente.result.produit.reduce((acc, curr, index) => {
              return acc + curr.prix_vente * vente.result.quantite[index];
            }, 0),
            id_vente: vente.result._id.toString().slice(-8),
          }
        );

        await page.setContent(htmlContent);

        const pdf = await page.pdf({
          path: 'page.pdf',
          format: 'A4',
          printBackground: false,
        });

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
    res.send("Une erreur s'est produite, veuillez réessayer plus tard");
  }
};
