let tab = [];
let tab1 = [];
let tab2 = [];
let tab3 = [];
let tab4 = [];
let tab5 = [];
let tab6 = [];
let tab7 = [];
let tab8 = [];
let tab9 = [];
let tab10 = [];
let tab11 = [];
let tab12 = [];
let tab13 = [];
let tab14 = [];
let tab15 = [];
let tab16 = [];
let tab17 = [];
let tab18 = [];
let tab19 = [];
let tab20 = [];
let tab21 = [];
let tab22 = [];
let tab23 = [];
let sum_jan= 0;
let sum_fev= 0;
let sum_mar= 0;
let sum_avr= 0;
let sum_mai= 0;
let sum_jun= 0;
let sum_jul= 0;
let sum_aug= 0;
let sum_sept= 0;
let sum_oct= 0;
let sum_nov= 0;
let sum_dec= 0;
let retour_jan= 0;
let retour_fev= 0;
let retour_mar= 0;
let retour_avr= 0;
let retour_mai= 0;
let retour_jun= 0;
let retour_jul= 0;
let retour_aug= 0;
let retour_sept= 0;
let retour_oct= 0;
let retour_nov= 0;
let retour_dec= 0;
const Result = await saleQueries.getSaleespece();
const ret_turn = await returnQueries.getReturn();
const ret_turn_bon = await returnQueries.getReturnbon();
const ret_turn_ass = await returnQueries.getReturnass();
const saleespece = Result.result;
const ret_jan = ret_turn.result;

// somme des ventes   et retour en espece du mois de janvier
let jan = saleespece.filter(el =>{
const mois = el.date.getMonth()+1;
return el.date.getFullYear()==data && mois == 1  ? el : null;
})
for(let i = 0; i <jan.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab.push(jan[i].total)
sum_jan =tab.reduce(reducer)
}

let ret_vet_jan = ret_jan.filter( ok=>{
const mois_retour = ok.date.getMonth()+1;
return ok.date.getFullYear()==data && mois_retour == 1  ? ok : null;
})
for(let i = 0; i <ret_vet_jan.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab1.push(ret_vet_jan[i].total)
retour_jan = tab1.reduce(reducer)
}



// somme des ventes   et retour en espece du mois de fevrier
let fev = saleespece.filter(el =>{
const mois = el.date.getMonth()+1;
return el.date.getFullYear()==data && mois == 2  ? el : null;
})
for(let i = 0; i <fev.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab2.push(fev[i].total)
sum_fev = tab2.reduce(reducer)
}

let ret_vet_fev = ret_jan.filter( ok=>{
const mois_retour = ok.date.getMonth()+1;
return ok.date.getFullYear()==data && mois_retour == 2  ? ok : null;
})
for(let i = 0; i <ret_vet_fev.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab3.push(ret_vet_fev[i].total)
retour_fev = tab3.reduce(reducer)
}
// console.log(retour_fev)


// somme des ventes   et retour en espece du mois de mars
let mar = saleespece.filter(el =>{
const mois = el.date.getMonth()+1;
return el.date.getFullYear()==data && mois == 3  ? el : null;
})
for(let i = 0; i <mar.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab4.push(mar[i].total)
sum_mar = tab4.reduce(reducer)
}
//console.log(sum_mar)
//retour de mars
let ret_vet_mar = ret_jan.filter( ok=>{
const mois_retour = ok.date.getMonth()+1;
return ok.date.getFullYear()==data && mois_retour == 3  ? ok : null;
})
for(let i = 0; i <ret_vet_mar.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab5.push(ret_vet_mar[i].total)
retour_mar = tab5.reduce(reducer)
}
//console.log(retour_mar)

// somme des ventes   et retour en espece du mois de avril
let avr = saleespece.filter(el =>{
const mois = el.date.getMonth()+1;
return el.date.getFullYear()==data && mois == 4  ? el : null;
})
for(let i = 0; i <avr.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab6.push(avr[i].total)
sum_avr = tab6.reduce(reducer)
}
//console.log(sum_avr)
let ret_vet_avr = ret_jan.filter( ok=>{
const mois_retour = ok.date.getMonth()+1;
return ok.date.getFullYear()==data && mois_retour == 4  ? ok : null;
})
for(let i = 0; i <ret_vet_avr.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab7.push(ret_vet_avr[i].total)
retour_avr = tab7.reduce(reducer)
}
//console.log(retour_avr)


// somme des ventes   et retour en espece du mois de mai
let mai = saleespece.filter(el =>{
const mois = el.date.getMonth()+1;
return el.date.getFullYear()==data && mois == 5  ? el : null;
})
for(let i = 0; i <mai.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab8.push(mai[i].total)
sum_mai = tab8.reduce(reducer)
}
//console.log(sum_mai)
let ret_vet_mai = ret_jan.filter( ok=>{
const mois_retour = ok.date.getMonth()+1;
return ok.date.getFullYear()==data && mois_retour == 5  ? ok : null;
})
for(let i = 0; i <ret_vet_mai.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab9.push(ret_vet_mai[i].total)
retour_mai = tab9.reduce(reducer)
}
//console.log(retour_mai)


// somme des ventes   et retour en espece du mois de juin
let jun = saleespece.filter(el =>{
const mois = el.date.getMonth()+1;
return el.date.getFullYear()==data && mois == 6  ? el : null;
})
for(let i = 0; i <jun.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab10.push(jun[i].total)
sum_jun = tab10.reduce(reducer)
}
//console.log(sum_jun)
let ret_vet_jun = ret_jan.filter( ok=>{
const mois_retour = ok.date.getMonth()+1;
return ok.date.getFullYear()==data && mois_retour == 6  ? ok : null;
})
for(let i = 0; i <ret_vet_jun.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab11.push(ret_vet_jun[i].total)
retour_jun = tab11.reduce(reducer)
}
//console.log(retour_jun)

// somme des ventes   et retour en espece du moisde juillet
let jul = saleespece.filter(el =>{
const mois = el.date.getMonth()+1;
return el.date.getFullYear()==data && mois == 7  ? el : null;
})
for(let i = 0; i <jul.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab12.push(jul[i].total)
sum_jul = tab12.reduce(reducer)
}
// console.log(sum_jul)
let ret_vet_jul = ret_jan.filter( ok=>{
const mois_retour = ok.date.getMonth()+1;
return ok.date.getFullYear()==data && mois_retour == 7  ? ok : null;
})
for(let i = 0; i <ret_vet_jul.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab13.push(ret_vet_jul[i].total)
retour_jul = tab13.reduce(reducer)
}
//console.log(retour_jul)
// somme des ventes   et retour en espece du mois de août
let aug = saleespece.filter(el =>{
const mois = el.date.getMonth()+1;
return el.date.getFullYear()==data && mois == 8  ? el : null;
})
for(let i = 0; i <aug.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab14.push(aug[i].total)
sum_aug = tab14.reduce(reducer)
}
//console.log(sum_aug)
let ret_vet_aug = ret_jan.filter( ok=>{
const mois_retour = ok.date.getMonth()+1;
return ok.date.getFullYear()==data && mois_retour == 8  ? ok : null;
})
for(let i = 0; i <ret_vet_aug.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab15.push(ret_vet_aug[i].total)
retour_aug = tab15.reduce(reducer)
}
//console.log(retour_aug)
// somme des ventes   et retour en espece du mois de septembre
let sept = saleespece.filter(el =>{
const mois = el.date.getMonth()+1;
return el.date.getFullYear()==data && mois == 9  ? el : null;
})
for(let i = 0; i <sept.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab16.push(sept[i].total)
sum_sept = tab16.reduce(reducer)
}
// console.log(sum_sept)
let ret_vet_sept = ret_jan.filter( ok=>{
const mois_retour = ok.date.getMonth()+1;
return ok.date.getFullYear()==data && mois_retour == 9  ? ok : null;
})
for(let i = 0; i <ret_vet_sept.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab17.push(ret_vet_sept[i].total)
retour_sept = tab17.reduce(reducer)
}
// console.log(retour_sept)


// somme des ventes   et retour en espece du mois de octobre
let oct = saleespece.filter(el =>{
const mois = el.date.getMonth()+1;
return el.date.getFullYear()==data && mois == 10  ? el : null;
})
for(let i = 0; i <oct.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab18.push(oct[i].total)
sum_oct = tab18.reduce(reducer)
}
//console.log(sum_oct)
let ret_vet_oct = ret_jan.filter( ok=>{
const mois_retour = ok.date.getMonth()+1;
return ok.date.getFullYear()==data && mois_retour == 10  ? ok : null;
})
for(let i = 0; i <ret_vet_oct.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab19.push(ret_vet_oct[i].total)
retour_oct = tab19.reduce(reducer)
}
//console.log(retour_oct)

// somme des ventes   et retour en espece du mois de novembre
let nov = saleespece.filter(el =>{
const mois = el.date.getMonth()+1;
return el.date.getFullYear()==data && mois == 11  ? el : null;
})
for(let i = 0; i <nov.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab20.push(nov[i].total)
sum_nov = tab20.reduce(reducer)
}
//console.log(sum_nov)
let ret_vet_nov = ret_jan.filter( ok=>{
const mois_retour = ok.date.getMonth()+1;
return ok.date.getFullYear()==data && mois_retour == 11  ? ok : null;
})
for(let i = 0; i <ret_vet_nov.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab21.push(ret_vet_nov[i].total)
retour_nov = tab21.reduce(reducer)
}
// console.log(retour_nov)

// somme des ventes  et retour en espece du mois de decembre
let dec = saleespece.filter(el =>{
const mois = el.date.getMonth()+1;
return el.date.getFullYear()==data && mois == 12  ? el : null;
})
for(let i = 0; i <dec.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab22.push(dec[i].total)
sum_dec = tab22.reduce(reducer)
}
console.log(sum_dec)
let ret_vet_dec = ret_jan.filter( ok=>{
const mois_retour = ok.date.getMonth()+1;
return ok.date.getFullYear()==data && mois_retour == 12  ? ok : null;
})
for(let i = 0; i <ret_vet_dec.length; i++){
const reducer = (accumulator, currentValue) => accumulator + currentValue;
tab23.push(ret_vet_dec[i].total)
retour_dec = tab23.reduce(reducer)
}
console.log(retour_dec)


