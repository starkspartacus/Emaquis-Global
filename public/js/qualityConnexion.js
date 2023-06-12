const qualityConnexion = document.getElementById('qualityConnexion');

function checkInternetConnection() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const timeout = 5000; // Temps d'attente en millisecondes

        xhr.open('GET', 'http://localhost:3000/', true); // URL pour le test de connexion

        xhr.onload = function() {
            if (xhr.status === 200 && xhr.timeout <= 5000) {
                resolve({ isConnected: true, timeout: xhr.timeout }); // La connexion a réussi
            } else {
                resolve({ isConnected: true, timeout: xhr.timeout > 5000 }); // La connexion a échoué ou est lente
            }
        };



        xhr.onerror = function() {
            resolve({ isConnected: false, timeout: xhr.timeout }); // La connexion a échoué
        };

        xhr.timeout = timeout;
        xhr.ontimeout = function() {
            resolve({ isConnected: false, timeout: xhr.timeout }); // La connexion a expiré
        };

        xhr.send();
    });
}

//  d'utilisation
document.addEventListener('DOMContentLoaded', function() {
    checkInternetConnection()
        .then((result) => {

            if (result.isConnected) {
                qualityConnexion.classList.add('quality_Connexion');
                qualityConnexion.classList.remove('quality_Connexion_lente');
            } else  {
                qualityConnexion.classList.remove('quality_Connexion');
                qualityConnexion.classList.add('quality_Connexion_lente');

            }
        })
        .catch((error) => {
            console.error("Une erreur s'est produite :", error);
        });
});



