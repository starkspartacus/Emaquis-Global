
let googlePlay = document.querySelector(".google-play");
let infoBullet = document.querySelector(".infoBull");
let paragraph = document.querySelector(".infoBull p");

 /* masquer paragraph au chargement de la page*/

paragraph.style.display = "none";




googlePlay.addEventListener("mouseover", function(){
    infoBullet.classList.add("bull");
    paragraph.style.display = "block";
});

googlePlay.addEventListener("mouseout", function(){
    infoBullet.classList.remove("bull");
    paragraph.style.display = "none";
} );


// faire apparaitre le paragraphe au click sur le bouton

