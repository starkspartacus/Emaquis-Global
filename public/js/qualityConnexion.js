function checkInternetConnection() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const timeout = 5000; // Temps d'attente en millisecondes

        xhr.open('GET', 'http://localhost:3000/', true); // URL pour le test de connexion

        xhr.onload = function() {
            if (xhr.status === 200 && timeout <= 5000) {
                resolve(true); // La connexion a réussi
            } else {
                resolve(false); // La connexion a échoué
            }
        };

        xhr.onerror = function() {
            resolve(false); // La connexion a échoué
        };

        xhr.timeout = timeout;
        xhr.ontimeout = function() {
            resolve(false); // La connexion a expiré
        };

        xhr.send();
    });
}

// Exemple d'utilisation
checkInternetConnection()
    .then((isConnected) => {
        if (isConnected) {
            console.log("Vous êtes connecté à Internet.");
        } else {
            console.log("Vous n'êtes pas connecté à Internet.");
        }
    })
    .catch((error) => {
        console.error("Une erreur s'est produite :", error);
    });
