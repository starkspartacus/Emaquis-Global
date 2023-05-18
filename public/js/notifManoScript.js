
let notyf = new Notyf({
    duration: 5000, // Set your global Notyf configuration here
    position: {
        y: 'top',
    }
});

document.getElementById('btnNotifMano')
    .addEventListener('click', function() {
        notyf.error('Attention votre stock est de moins de 5 articles !');
    });

if (onload) {
    notyf.success('Bienvenue sur le site de Mano !');
}
