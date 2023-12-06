const { generatorTicket } = require('../services/generator.service');

const generateTicket = (data) => {
	const ticket = `
${generatorTicket.centerText('E-Maquis')}
${generatorTicket.centerText(data.nom_etablissement)}
${generatorTicket.centerText('Facture N° : ' + data.id_vente)}
${generatorTicket.centerText('Employe: ' + data.barman)}
${generatorTicket.centerText('Heure: ' + moment().format('DD/MM/YYYY à HH:mm'))}
  
${generatorTicket.generateHeadersBasedOnTemplateText()}
${data.vente.produit
	.map((p, index) =>
		generatorTicket.generateLineBasedOnTemplateText([
			data.vente.quantite[index],
			(p.promo ? '(F) ' : '') + p.produit.nom_produit,
			'',
			p.prix_vente,
			p.total_price,
		])
	)
	.join('\n')}
${'-'.repeat(32)}
${generatorTicket.spaceBetweenTexts('Total', data.total + ' FCFA')}
${generatorTicket.spaceBetweenTexts('TVA(%)', '0')}
${'-'.repeat(32)}
${generatorTicket.spaceBetweenTexts(
	'Somme encaissee',
	'' + data.vente.somme_encaisse
)}
${generatorTicket.spaceBetweenTexts(
	'Monnaie rendue: ',
	'' + data.vente.monnaie
)}
${generatorTicket.centerText('Merci de votre visite ')}
${generatorTicket.centerText('A bientot')}
  
${generatorTicket.rightText('https://www.e-maquis.com/')}
${generatorTicket.centerText('Conseiller E-maquis :')}
${generatorTicket.centerText('+33 0760484911')}
${generatorTicket.centerText('+225 0709454685')}
${generatorTicket.rightText('HNM\n')}
`;

	return ticket;
};

module.exports = {
	generateTicket,
};
