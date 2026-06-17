
async function init(){
const r=await fetch('dados.json');
const d=await r.json();

const ranking=[...d.classificacao].sort((a,b)=>b.pontos-a.pontos);

document.getElementById('lider').textContent=ranking[0]?.nome||'-';
document.getElementById('participantes').textContent=ranking.length;
document.getElementById('maxPontos').textContent=ranking[0]?.pontos||0;

const podio=document.getElementById('podio');
['🥇','🥈','🥉'].forEach((m,i)=>{
 if(ranking[i]){
   podio.innerHTML+=`<div class="card"><h2>${m}</h2><h3>${ranking[i].nome}</h3><p>${ranking[i].pontos} pts</p></div>`;
 }
});

const tbody=document.querySelector('#ranking tbody');
ranking.forEach((p,i)=>{
 tbody.innerHTML+=`<tr><td>${i+1}</td><td>${p.nome}</td><td>${p.pontos}</td></tr>`;
});

const labels=[];
const datasets=[];

const jogosRealizados = d.jogos_realizados || 0;

Object.entries(d.evolucao).forEach(([nome,valores])=>{

 const valoresValidos = valores.slice(0, jogosRealizados);

 if(labels.length===0){
   valoresValidos.forEach(v=>labels.push(v.jogo));
 }

 let acumulado=0;

 const serie = valoresValidos.map(v=>{
   acumulado += Number(v.pontos || 0);
   return acumulado;
 });

 datasets.push({
   label:nome,
   data:serie,
   tension:0.3
 });
});

new Chart(document.getElementById('grafico'),{
 type:'line',
 data:{labels,datasets},
 options:{responsive:true}
});

const grid=document.getElementById('participantesGrid');
ranking.forEach(p=>{
 grid.innerHTML += `<div class="player"><h3>${p.nome}</h3><p><strong>${p.pontos}</strong> pontos</p></div>`;
});
}
init();
