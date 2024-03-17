const Produit = require('../models/produit.model');
const produitGlobal = require('../models/produitglobal.model');

exports.produitQueries = class {
	static setProduit(data) {
		return new Promise(async (next) => {
			const produit = new Produit({
				produit: data.produit,
				prix_vente: data.prix_vente,
				prix_achat: data.prix_achat,
				quantite: data.quantite || 0,
				taille: data.taille,
				promo: data.promo,
				promo_quantity: data.promo_quantity,
				promo_price: data.promo_price,
				historiques: data.historiques,
				session: data.session,
				is_cocktail: data.is_cocktail,
			});

			await produit
				.save()
				.then((res) => {
					next({
						etat: true,
						result: res,
					});
				})
				.catch((err) => {
					next({
						etat: false,
						err: err,
					});
				});
		});
	}

	static setGlobalProduit(data) {
		return new Promise(async (next) => {
			const produit = new produitGlobal(data);

			await produit
				.save()
				.then((res) => {
					next({
						etat: true,
						result: res,
					});
				})
				.catch((err) => {
					next({
						etat: false,
						err: err,
					});
				});
		});
	}

	static updateGlobalProduit(id, data) {
		return new Promise(async (next, reject) => {
			produitGlobal
				.updateOne({ _id: id, isDeleted: false }, data)
				.then((res) => {
					next({
						etat: true,
						result: res,
					});
				})
				.catch(reject);
		});
	}

	static getGlobalProduit() {
		try {
			return new Promise(async (next) => {
				produitGlobal
					.find({ isDeleted: false })
					.populate({ path: 'categorie', select: '_id nom' })
					.then((data) => {
						next({
							etat: true,
							result: data,
						});
					})
					.catch((err) => {
						next({
							etat: false,
							err: err,
						});
					});
			});
		} catch (error) {
			console.log(error);
		}
	}

	static getGlobalProduitById(id) {
		try {
			return new Promise(async (next) => {
				produitGlobal
					.findOne({ _id: id, isDeleted: false })
					.populate('categorie')
					.then((data) => {
						next({
							etat: true,
							result: data,
						});
					})
					.catch((err) => {
						next({
							etat: false,
							err: err,
						});
					});
			});
		} catch (error) {
			console.log(error);
		}
	}

	static getGlobalProduitByCountry(country) {
		try {
			return new Promise(async (next) => {
				produitGlobal
					.find({
						$or: [
							{
								country,
							},
							{
								country: null,
							},
						],
						isDeleted: false,
					})
					.then((data) => {
						next({
							etat: true,
							result: data,
						});
					})
					.catch((err) => {
						console.log(err);
						next({
							etat: false,
							err: err,
						});
					});
			});
		} catch (error) {
			console.log(error);
		}
	}

	static getProduitBySession(sessionId) {
		try {
			return new Promise(async (next) => {
				Produit.find({
					session: sessionId,
					isDeleted: false,
				})
					.populate({
						path: 'produit',
						populate: {
							path: 'categorie',
						},
					})

					.then((data) => {
						next({
							etat: true,
							result: data,
						});
					})
					.catch((err) => {
						next({
							etat: false,
							err: err,
						});
					});
			});
		} catch (error) {
			console.log(error);
		}
	}

	static getProduit() {
		try {
			return new Promise(async (next) => {
				Produit.find({ isDeleted: false })
					.populate({
						path: 'produit',
						populate: {
							path: 'categorie',
						},
					})

					.then((data) => {
						next({
							etat: true,
							result: data,
						});
					})
					.catch((err) => {
						next({
							etat: false,
							err: err,
						});
					});
			});
		} catch (error) {
			console.log(error);
		}
	}

	static getProduitBySession(sessionId) {
		try {
			return new Promise(async (next) => {
				Produit.find({
					session: sessionId,
					isDeleted: false,
				})
					.populate({
						path: 'produit',
						populate: {
							path: 'categorie',
						},
					})

					.then((data) => {
						next({
							etat: true,
							result: data,
						});
					})
					.catch((err) => {
						next({
							etat: false,
							err: err,
						});
					});
			});
		} catch (error) {
			console.log(error);
		}
	}

	static getProduitById(id) {
		try {
			return new Promise(async (next) => {
				Produit.findById({ _id: id, isDeleted: false })
					.populate({
						path: 'produit',
						populate: {
							path: 'categorie',
						},
					})
					.then((data) => {
						next({
							etat: true,
							result: data,
						});
					})
					.catch((err) => {
						next({
							etat: false,
							err: err,
						});
					});
			});
		} catch (error) {
			console.log(error);
		}
	}

	static getProduitByData(data) {
		try {
			return new Promise(async (next) => {
				Produit.findOne(data)
					.then((data) => {
						next({
							etat: true,
							result: data,
						});
					})
					.catch((err) => {
						next({
							etat: false,
							err: err,
						});
					});
			});
		} catch (error) {
			console.log(error);
		}
	}

	static getProduitByUser(id) {
		try {
			return new Promise(async (next) => {
				Produit.findById({ session: id, isDeleted: false })
					.then((data) => {
						next({
							etat: true,
							result: data,
						});
					})
					.catch((err) => {
						next({
							etat: false,
							err: err,
						});
					});
			});
		} catch (error) {
			console.log(error);
		}
	}

	static deleteProduit(data) {
		try {
			return new Promise(async (next) => {
				Produit.updateOne(data, {
					$set: {
						isDeleted: true,
					},
				})
					.then((res) => {
						next({
							etat: true,
							result: res,
						});
					})
					.catch((err) => {
						next({
							etat: false,
							err: err,
						});
					});
			});
		} catch (error) {
			console.log(error);
		}
	}

	static updateProduit({ produitId, session }, data) {
		return new Promise(async (next) => {
			Produit.updateOne({ _id: produitId, session }, data)
				.then((data) => {
					next({ etat: true, result: data });
				})
				.catch((err) => {
					next({ etat: false, err: err });
				});
		});
	}

	static deleteProduitGlobal(id) {
		return new Promise((next, reject) => {
			produitGlobal
				.updateOne(
					{ _id: id },
					{
						$set: {
							isDeleted: true,
						},
					}
				)
				.then((res) => {
					next({
						etat: true,
						result: res,
					});
				})
				.catch(reject);
		});
	}
};
