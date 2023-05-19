

let test  = document.querySelector('.testt');
console.log(test);


let notyf = new Notyf({
    types: [
        {
            type: 'success',
            background: 'orange',
            icon: {
                className: 'fas fa-check',
            },
            position: {
                y: 'top',
            },
            duration: 10000,
            dismissible: true,
        },
        {
            type: 'error',
            background: 'red',
            icon: {
                className: 'fas fa-times',
            },
            position: {
                y: 'top',
            },
            duration: 5000,
            dismissible: true,
        }

    ]

});

let employeAdd = notyf.open({
    type: 'success',
    message: test.firstChild.data > 0 ? "Vous avez " + test.firstChild.data + "employés à votre charge": 'Ajoutez un employé ',
    duration: 10000,
    dismissible: true,
    position: {
        y: 'top',
        x: 'center',
    }
});






