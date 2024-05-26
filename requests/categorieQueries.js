const Categorie = require('../models/categorie.model');

exports.categorieQueries = class {
	static setCategorie(data) {
		return new Promise(async (next) => {
			const categorie = await new Categorie({
				nom: data.nom,
				categorie_pour: data.categorie_pour,
				image: data.image,
				color: data.color,
			});
			await categorie
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

	static getCategorie(data) {
		try {
			return new Promise(async (next) => {
				Categorie.find({
					isDeleted: false,
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

	static getCategorieById(id) {
		try {
			return new Promise(async (next) => {
				Categorie.findById({ _id: id, isDeleted: false })
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

	static updateCategorie(id, data) {
		return new Promise(async (next) => {
			await Categorie.updateOne(
				{
					_id: id,
				},
				{
					$set: {
						nom: data.nom,
						categorie_pour: data.categorie_pour,
						image: data.image,
						color: data.color,
					},
				}
			)
				.then((data) => {
					next({
						etat: true,
						result: data,
					});
				})
				.catch((rr) => {
					next({
						etat: false,
						err: rr,
					});
				});
		});
	}

	static deleteCategorie(id) {
		return new Promise(async (next) => {
			await Categorie.updateOne(
				{
					_id: id,
				},
				{
					$set: {
						isDeleted: true,
					},
				}
			)
				.then((data) => {
					next({
						etat: true,
						result: data,
					});
				})
				.catch((rr) => {
					next({
						etat: false,
						err: rr,
					});
				});
		});
	}
};
