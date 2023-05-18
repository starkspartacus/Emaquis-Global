const defaultNumber = document.querySelector('.form-focus-warning').value;
const btnVerif = document.querySelector('.btn_1_Verif');


// recupérer la valeur du input


// si la valeur est inférieur à 10 caractères

btnVerif.addEventListener('submit', function() {
    if (defaultNumber.length < 10 ) {
        console.log(defaultNumber.length);
    }
    else {
        console.log('ok');
    }
} );




