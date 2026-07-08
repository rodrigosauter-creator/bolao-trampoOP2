// =====================================================
// BANDEIRAS
// =====================================================

const bandeiras = {

    "México":"mx",
    "África do Sul":"za",
    "Coreia do Sul":"kr",
    "Tchéquia":"cz",
    "Canadá":"ca",
    "Bósnia":"ba",
    "Bosnia":"ba",
    "Qatar":"qa",
    "Catar":"qa",
    "Suíça":"ch",
    "Suiça":"ch",
    "Brasil":"br",
    "Marrocos":"ma",
    "Haiti":"ht",
    "EUA":"us",
    "Paraguai":"py",
    "Austrália":"au",
    "Turquia":"tr",
    "Alemanha":"de",
    "Curaçao":"cw",
    "Costa do Marfim":"ci",
    "Equador":"ec",
    "Holanda":"nl",
    "Japão":"jp",
    "Suécia":"se",
    "Tunísia":"tn",
    "Bélgica":"be",
    "Egito":"eg",
    "Irã":"ir",
    "Nova Zelândia":"nz",
    "Espanha":"es",
    "Cabo Verde":"cv",
    "Arábia Saudita":"sa",
    "Uruguai":"uy",
    "França":"fr",
    "Senegal":"sn",
    "Iraque":"iq",
    "Noruega":"no",
    "Argentina":"ar",
    "Argélia":"dz",
    "Áustria":"at",
    "Jordânia":"jo",
    "Portugal":"pt",
    "RD Congo":"cd",
    "Uzbequistão":"uz",
    "Colômbia":"co",
    "Croácia":"hr",
    "Gana":"gh",
    "Panamá":"pa",
    "Inglaterra":"gb-eng",
    "Escócia":"gb-sct"

};

function flag(pais){

    const codigo = bandeiras[pais];

    if(!codigo) return "";

    return `
        <img
            src="https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/${codigo}.svg"
            class="bandeira-img"
            alt="${pais}">
    `;
}


// =====================================================
// NAVEGAÇÃO
// =====================================================

function inicializarAbas() {

    const tabs = document.querySelectorAll(".tab");

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            document
                .querySelectorAll(".tab")
                .forEach(t => t.classList.remove("active"));

            document
                .querySelectorAll(".pagina")
                .forEach(p => p.classList.remove("ativa"));

            tab.classList.add("active");

            const destino = tab.dataset.tab;

            document
                .getElementById(destino)
                .classList.add("ativa");
        });

    });
}


// =====================================================
// DASHBOARD
// =====================================================

function montarPodio(classificacao) {

    const podio = document.getElementById("podio");

    if (!podio) return;

    const top3 = classificacao.slice(0, 3);

    const medalhas = [
        "🥇",
        "🥈",
        "🥉"
    ];

    podio.innerHTML = "";

    top3.forEach((pessoa, i) => {

        podio.innerHTML += `
            <div class="podio-card posicao-${i+1}">
                <div class="medalha">
                    ${medalhas[i]}
                </div>

                <h3>${pessoa.nome}</h3>

                <div class="pontuacao">
                    ${pessoa.pontos} pts
                </div>

                <div class="acertos">
                    ${pessoa.acertos} acerto(s)
                </div>
            </div>
        `;
    });
}


function montarClassificacao(classificacao) {

    const tbody =
        document.querySelector("#ranking tbody");

    tbody.innerHTML = "";

    classificacao.forEach((participante) => {

        tbody.innerHTML += `
            <tr>
                <td>${participante.posicao}</td>
                <td>${participante.nome}</td>
                <td>${participante.pontos}</td>
                <td>${participante.acertos}</td>
            </tr>
        `;
    });
}

// =====================================================
// GRÁFICO DE EVOLUÇÃO
// =====================================================

let graficoPontuacao = null;
let evolucaoGlobal = null;

function montarFiltroGrafico(evolucao) {

    const container =
        document.getElementById("filtroGrafico");

    if (!container) return;

    const nomes =
        Object.keys(evolucao);

    container.innerHTML = `
        <div class="filtro-grafico-titulo">
            Filtrar apostadores:
        </div>

        <div class="filtro-grafico-opcoes">

            <label class="filtro-check todos">
                <input
                    type="checkbox"
                    id="selecionarTodosGrafico"
                    checked>
                Todos
            </label>

            ${nomes.map(nome => `
                <label class="filtro-check">
                    <input
                        type="checkbox"
                        class="check-apostador-grafico"
                        value="${nome}"
                        checked>
                    ${nome}
                </label>
            `).join("")}

        </div>
    `;

    const checkTodos =
        document.getElementById("selecionarTodosGrafico");

    const checks =
        document.querySelectorAll(".check-apostador-grafico");

    checkTodos.addEventListener("change", () => {

        checks.forEach(check => {
            check.checked = checkTodos.checked;
        });

        atualizarGrafico();
    });

    checks.forEach(check => {

        check.addEventListener("change", () => {

            const todosMarcados =
                [...checks].every(c => c.checked);

            checkTodos.checked = todosMarcados;

            atualizarGrafico();

        });

    });
}

function obterApostadoresSelecionados() {

    const checks =
        document.querySelectorAll(".check-apostador-grafico:checked");

    return [...checks].map(check => check.value);
}

function montarGrafico(evolucao) {

    evolucaoGlobal = evolucao;

    montarFiltroGrafico(evolucao);

    atualizarGrafico();
}

function atualizarGrafico() {

    const canvas =
        document.getElementById("grafico");

    if (!canvas || !evolucaoGlobal) return;

    const limite =
        dadosGlobais.jogos_realizados + 1;

    const nomesSelecionados =
        obterApostadoresSelecionados();

    const nomes =
        nomesSelecionados.length > 0
            ? nomesSelecionados
            : Object.keys(evolucaoGlobal);

    const labels =
        evolucaoGlobal[Object.keys(evolucaoGlobal)[0]]
            .slice(0, limite)
            .map(item =>
                item.jogo === 0
                    ? "Início"
                    : `J${item.jogo}`
            );

    const datasets =
        nomes.map(nome => {

            return {
                label: nome,

                data:
                    evolucaoGlobal[nome]
                        .slice(0, limite)
                        .map(item => item.pontos),

                tension: 0.25,

                fill: false
            };
        });

    if (graficoPontuacao) {
        graficoPontuacao.destroy();
    }

    graficoPontuacao =
        new Chart(canvas, {

            type: "line",

            data: {
                labels,
                datasets
            },

            options: {

                responsive: true,

                interaction: {
                    mode: "index",
                    intersect: false
                },

                plugins: {

                    legend: {
                        position: "bottom"
                    }
                },

                scales: {

                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
}

// =====================================================
// CARREGAMENTO PRINCIPAL
// =====================================================

let dadosGlobais = null;

async function carregarDados() {

    try {

        const response =
            await fetch("dados.json");

        if (!response.ok) {

            throw new Error(
                `Erro ao carregar dados.json (${response.status})`
            );

        }

        const dados =
            await response.json();

        dadosGlobais = dados;

        montarPodio(
            dados.classificacao
        );

        montarClassificacao(
            dados.classificacao
        );

        montarHallDaFama(
            dados.apostadores
        );

        montarGrafico(
            dados.evolucao
        );

        montarJogos(
            dados.jogos
        );
        
        montarChaveamento(dados.jogos);
        
        const filtroJogos =
            document.getElementById("filtroJogos");
        
        if (filtroJogos) {
        
            filtroJogos.addEventListener(
                "change",
                e => {
        
                    montarJogos(
                        dados.jogos,
                        e.target.value
                    );
        
                }
            );
        
        }
        
        montarListaApostadores(
            dados.apostadores
        );
        
        renderizarEstatisticas(
            dados.apostadores
        );   

        inicializarAbas();

        console.log(
            "Dados carregados com sucesso."
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar dados:",
            erro
        );

    }
}

console.log("script.js carregado");

document.addEventListener(
    "DOMContentLoaded",
    carregarDados
);

// =====================================================
// JOGOS
// =====================================================

function montarJogos(jogos, fase = "todos") {
    
    const jogosFiltrados =
        filtrarJogosPorFase(jogos, fase);
    
    const container =
        document.getElementById("listaJogos");

    if (!container) return;

    container.innerHTML = "";

    let faseAtualLista = "";
    
    jogosFiltrados.forEach(jogo => {

        const nomeFase =
    obterNomeFase(jogo.jogo);

if (nomeFase !== faseAtualLista) {

    faseAtualLista = nomeFase;

    adicionarTituloFase(
        container,
        nomeFase
    );
}
        
        const confrontoDefinido =
        jogo.selecao_a || jogo.selecao_b;

        const selecaoA =
        jogo.selecao_a || "Aguardando oponente";

        const selecaoB =
        jogo.selecao_b || "Aguardando oponente";

        const bandeiraA =
            jogo.selecao_a
                ? flag(jogo.selecao_a)
                : "⏳";

        const bandeiraB =
            jogo.selecao_b
                ? flag(jogo.selecao_b)
                : "⏳";
        
        const status =
            jogo.realizado
                ? "realizado"
                : "pendente";

        const placar =
            jogo.realizado
                ? `${jogo.gols_a} x ${jogo.gols_b}`
                : "vs";

        const vencedorA =
            jogo.vencedor === jogo.selecao_a;

        const vencedorB =
            jogo.vencedor === jogo.selecao_b;

        container.innerHTML += `

        <div class="jogo-card ${status}">

            <div class="jogo-numero">
                Jogo ${jogo.jogo}
            </div>

<div class="jogo-times">

    ${
        !confrontoDefinido
        ? `
            <div class="jogo-confronto-indefinido">
                ⏳ Aguardando definição do confronto
            </div>
        `
        : `
            <div class="time ${vencedorA ? "vencedor" : ""}">
                <span class="bandeira">
                    ${bandeiraA}
                </span>

                <span>
                    ${selecaoA}
                </span>
            </div>

            <div class="placar">
                ${placar}
            </div>

            <div class="time ${vencedorB ? "vencedor" : ""}">
                <span class="bandeira">
                    ${bandeiraB}
                </span>

                <span>
                    ${selecaoB}
                </span>
            </div>
        `
    }

</div>

           <div class="jogo-status">

    ${
        confrontoDefinido
            ? (
                jogo.realizado
                    ? "✅ Finalizado"
                    : "⏳ Aguardando"
              )
            : ""
    }

    ${
        jogo.jogo >= 73 && jogo.penaltis && jogo.penaltis !== "x"
        ? `
            <div class="jogo-penaltis">
                <strong>🥅 Pênaltis:</strong> ${jogo.penaltis}
            </div>
        `
        : ""
    }

</div>

        </div>
        `;
    });
}

function obterFaixaRodada(fase) {

    switch (fase) {

        case "1":
            return [1, 24];

        case "2":
            return [25, 48];

        case "3":
            return [49, 72];

        case "16":
            return [73, 88];

        case "8":
            return [89, 96];

        case "4":
            return [97, 100];

        case "semi":
            return [101, 102];

        case "terceiro":
            return [103, 103];

        case "final":
            return [104, 104];

        case "todos":
        default:
            return [0, 999];
    }
}

function filtrarJogosPorFase(jogos, fase) {

    const [inicio, fim] = obterFaixaRodada(fase);

    return jogos.filter(jogo =>
        jogo.jogo >= inicio &&
        jogo.jogo <= fim
    );
}

function obterNomeFase(jogo) {

    const numero = Number(jogo);

    if (numero >= 1 && numero <= 24) return "1ª Rodada";
    if (numero >= 25 && numero <= 48) return "2ª Rodada";
    if (numero >= 49 && numero <= 72) return "3ª Rodada";
    if (numero >= 73 && numero <= 88) return "16-Avos";
    if (numero >= 89 && numero <= 96) return "Oitavas de Final";
    if (numero >= 97 && numero <= 100) return "Quartas de Final";
    if (numero >= 101 && numero <= 102) return "Semifinais";
    if (numero === 103) return "Disputa de 3º Lugar";
    if (numero === 104) return "Final";

    return "Outros";
}

// =====================================================
// UTILITÁRIOS DE JOGOS REALIZADOS
// =====================================================

function jogoFoiRealizado(numeroJogo) {

    const jogo =
        dadosGlobais.jogos.find(
            j => Number(j.jogo) === Number(numeroJogo)
        );

    return jogo ? jogo.realizado === true : false;
}

function obterPalpitesRealizados(apostador) {

    return apostador.palpites.filter(
        palpite => jogoFoiRealizado(palpite.jogo)
    );
}

function obterNumerosJogosRealizados() {

    return dadosGlobais.jogos
        .filter(jogo => jogo.realizado === true)
        .map(jogo => Number(jogo.jogo));
}

function obterPalpiteDoJogo(apostador, numeroJogo) {

    return apostador.palpites.find(
        palpite => Number(palpite.jogo) === Number(numeroJogo)
    );
}

function adicionarTituloFase(container, nomeFase) {

    container.innerHTML += `
        <div class="titulo-fase-lista">
            ${nomeFase}
        </div>
    `;
}

// =====================================================
// APOSTADORES
// =====================================================

function criarCardApostador(apostador, aoClicar) {

    const infoRanking =
        dadosGlobais.classificacao.find(
            p => p.nome === apostador.nome
        );

    const pontos =
        infoRanking ? infoRanking.pontos : 0;

    const acertos =
        infoRanking ? infoRanking.acertos : 0;

    const card =
        document.createElement("div");

    card.className = "participante-card";

    card.innerHTML = `
        <div class="card-apostador">

            <img
                src="imagens/cards/${apostador.nome}.png"
                alt="${apostador.nome}"
                class="imagem-card">

            <div class="faixa-card">

                <div class="pontos-card">
                    🏆 ${pontos} pts
                </div>

                <div class="acertos-card">
                    🎯 ${acertos} acerto(s)
                </div>

            </div>

        </div>
    `;

    card.addEventListener("click", () => {
        aoClicar(apostador);
    });

    return card;
}

function montarListaApostadores(apostadores) {

    const grid =
        document.getElementById("participantesGrid");

    if (!grid) return;

    grid.innerHTML = "";

    Object.values(apostadores)
        .forEach(apostador => {

            const card =
                criarCardApostador(
                    apostador,
                    apostadorSelecionado => {
                        mostrarApostador(
                            {
                                ...apostadorSelecionado,
                                palpitesOriginais:
                                    apostadorSelecionado.palpites
                            }
                        );
                    }
                );

            grid.appendChild(card);

        });
}

function mostrarApostador(apostador, faseAtual = "todos", selecaoAtual = "todas") {

    const detalhes =
        document.getElementById("detalhesApostador");

    if (!detalhes) return;

    const classificacao =
        dadosGlobais.classificacao;

    const infoRanking =
        classificacao.find(
            p => p.nome === apostador.nome
        );

    const posicao =
        infoRanking ? infoRanking.posicao : "-";
  
    const pontosRanking =
    infoRanking ? infoRanking.pontos : apostador.total;

    const acertosRanking =
        infoRanking ? infoRanking.acertos : apostador.acertos;
    
    const todosPalpites =
        apostador.palpitesOriginais ||
        apostador.palpites;

    const [inicio, fim] =
        obterFaixaRodada(faseAtual);

let palpitesFiltrados = todosPalpites;

if (faseAtual === "placar-exato") {

    palpitesFiltrados =
        palpitesFiltrados.filter(
            p => Number(p.palpite_certo) === 1
        );

} else if (faseAtual !== "todos") {

    const [inicio, fim] =
        obterFaixaRodada(faseAtual);

    palpitesFiltrados =
        palpitesFiltrados.filter(
            p =>
                Number(p.jogo) >= inicio &&
                Number(p.jogo) <= fim
        );
}

if (selecaoAtual !== "todas") {

    palpitesFiltrados =
        palpitesFiltrados.filter(
            p =>
                p.selecao_a === selecaoAtual ||
                p.selecao_b === selecaoAtual
        );
}

    const filtroHTML = `
        <select id="filtroPalpites" class="filtro-rodada">
            <option value="todos" ${faseAtual === "todos" ? "selected" : ""}>Todas as fases</option>
            <option value="placar-exato" ${faseAtual === "placar-exato" ? "selected" : ""}>Palpites Certos</option>
            <option value="argentina" ${faseAtual === "argentina" ? "selected" : ""}>Argentina</option>
            <option value="1" ${faseAtual === "1" ? "selected" : ""}>1ª Rodada (1-24)</option>
            <option value="2" ${faseAtual === "2" ? "selected" : ""}>2ª Rodada (25-48)</option>
            <option value="3" ${faseAtual === "3" ? "selected" : ""}>3ª Rodada (49-72)</option>
            <option value="16" ${faseAtual === "16" ? "selected" : ""}>16-Avos (73-88)</option>
            <option value="8" ${faseAtual === "8" ? "selected" : ""}>Oitavas (89-96)</option>
            <option value="4" ${faseAtual === "4" ? "selected" : ""}>Quartas (97-100)</option>
            <option value="semi" ${faseAtual === "semi" ? "selected" : ""}>Semifinais (101-102)</option>
            <option value="terceiro" ${faseAtual === "terceiro" ? "selected" : ""}>3º Lugar (103)</option>
            <option value="final" ${faseAtual === "final" ? "selected" : ""}>Final (104)</option>
        </select>

<select id="filtroSelecao" class="filtro-rodada">
    <option value="todas" ${selecaoAtual === "todas" ? "selected" : ""}>
        Todas as seleções
    </option>
    ${montarOptionsSelecoes(todosPalpites, selecaoAtual)}
</select>

    `;

    let html = `
        <h2>${apostador.nome}</h2>

        ${filtroHTML}

        <div class="apostador-resumo">

            <div class="resumo-card">
                📊 ${posicao}º lugar
            </div>

            <div class="resumo-card">
                🏆 ${pontosRanking} pts
            </div>

            <div class="resumo-card">
                🎯 ${acertosRanking} acerto(s)
            </div>

        </div>

        <div class="lista-palpites-card">
    `;

    let faseAtualLista = "";
    
    palpitesFiltrados.forEach(palpite => {


        const nomeFase =
    obterNomeFase(palpite.jogo);

if (nomeFase !== faseAtualLista) {

    faseAtualLista = nomeFase;

    html += `
        <div class="titulo-fase-lista">
            ${nomeFase}
        </div>
    `;
}
        
        const jogoReal =
    dadosGlobais.jogos.find(
        j => j.jogo === palpite.jogo
    );

const jogoRealizado =
    jogoReal?.realizado ?? false;

const acertouEmCheio =
    Number(palpite.palpite_certo) === 1;

const confrontoDefinido =
    palpite.selecao_a || palpite.selecao_b;

const selecaoA =
    palpite.selecao_a || "Aguardando oponente";

const selecaoB =
    palpite.selecao_b || "Aguardando oponente";

const bandeiraA =
    palpite.selecao_a ? flag(palpite.selecao_a) : "⏳";

const bandeiraB =
    palpite.selecao_b ? flag(palpite.selecao_b) : "⏳";

const temPalpite =
    palpite.gols_a !== null &&
    palpite.gols_a !== undefined &&
    palpite.gols_a !== "" &&
    palpite.gols_b !== null &&
    palpite.gols_b !== undefined &&
    palpite.gols_b !== "";

const palpiteNaoRealizado =
    jogoRealizado && !temPalpite;
let placarPalpite;

if (temPalpite) {

    placarPalpite =
        `${palpite.gols_a} x ${palpite.gols_b}`;

} else if (confrontoDefinido) {

    placarPalpite = "vs";

} else {

    placarPalpite = "";

}

        html += `
            <div class="palpite-card
    ${
        acertouEmCheio
            ? "palpite-card-certo"
            : palpiteNaoRealizado
                ? "palpite-card-sem-palpite"
                : ""
    }">
                
<div class="palpite-topo ${
    acertouEmCheio || palpiteNaoRealizado
        ? "com-selo"
        : "sem-selo"
}">

    <span>
        ${
            acertouEmCheio
                ? "🏆"
                : palpiteNaoRealizado
                    ? "🚫"
                    : "⚽"
        }
        Jogo ${palpite.jogo}
    </span>

    ${
        acertouEmCheio
            ? `<div class="selo-palpite">
                    PLACAR EXATO
               </div>`

        : palpiteNaoRealizado

            ? `<div class="selo-sem-palpite">
                    PALPITE NÃO REALIZADO
               </div>`

        : ""
    }

    ${
        jogoRealizado && !palpiteNaoRealizado
            ? `
                <strong class="pontos-jogo">
                    ${palpite.pontos} pts
                </strong>
            `
            : ""
    }

</div>

                <div class="palpite-confronto">

    ${
        !confrontoDefinido
            ? `
                <div class="palpite-confronto-indefinido">
                    ⏳ Aguardando definição do confronto
                </div>
            `
            : `
                <span>
                    ${bandeiraA}
                    ${selecaoA}
                </span>

                <strong>
                    ${placarPalpite}
                </strong>

                <span>
                    ${bandeiraB}
                    ${selecaoB}
                </span>
            `
    }

</div>

                ${
                    palpite.jogo >= 73 && palpite.penaltis && palpite.penaltis !== "x"
    ? `
        <div class="palpite-penaltis">
            <strong>🥅 Pênaltis:</strong> ${palpite.penaltis}
        </div>
    `
    : ""
                }

            </div>
        `;
    });

    html += `
        </div>
    `;

    detalhes.innerHTML = html;

const selectFase =
    document.getElementById("filtroPalpites");

const selectSelecao =
    document.getElementById("filtroSelecao");

selectFase.addEventListener("change", e => {

    mostrarApostador(
        {
            ...apostador,
            palpitesOriginais: todosPalpites
        },
        e.target.value,
        selectSelecao.value
    );

});

selectSelecao.addEventListener("change", e => {

    mostrarApostador(
        {
            ...apostador,
            palpitesOriginais: todosPalpites
        },
        selectFase.value,
        e.target.value
    );

});

    setTimeout(() => {

    const y =
        detalhes.getBoundingClientRect().top +
        window.pageYOffset -
        80; // ajuste conforme a altura do cabeçalho

    window.scrollTo({
        top: y,
        behavior: "smooth"
    });

}, 50);
    
}

// =====================================================
// MATA-MATA
// =====================================================

function buscarJogo(numero) {
    return dadosGlobais.jogos.find(j => Number(j.jogo) === numero);
}

function nomeTime(jogo, lado) {
    const nome = lado === "a" ? jogo?.selecao_a : jogo?.selecao_b;
    return nome || "Aguardando oponente";
}

function linhaTime(jogo, lado) {
    const nome = nomeTime(jogo, lado);
    const gols = lado === "a" ? jogo?.gols_a : jogo?.gols_b;

    return `
        <div class="chave-time">
            <span>${nome !== "Aguardando oponente" ? flag(nome) : "⏳"}</span>
            <span>${nome}</span>
            <strong>${gols ?? ""}</strong>
        </div>
    `;
}

function vencedorJogo(jogo) {
    if (!jogo || !jogo.realizado) return "";

    if (jogo.penaltis && jogo.penaltis !== "x") {
        return jogo.penaltis;
    }

    return jogo.vencedor;
}

function cardChave(numero) {
    const jogo = buscarJogo(numero);

    if (!jogo || (!jogo.selecao_a && !jogo.selecao_b)) {
        return `
            <div class="chave-card">
                <div class="chave-numero">Jogo ${numero}</div>
                <div class="chave-indefinido">
                    ⏳ Aguardando definição do confronto
                </div>
            </div>
        `;
    }

    const vencedor = vencedorJogo(jogo);

    return `
        <div class="chave-card">
            <div class="chave-numero">Jogo ${numero}</div>

            <div class="${vencedor === jogo.selecao_a ? "chave-vencedor" : ""}">
                ${linhaTime(jogo, "a")}
            </div>

            <div class="${vencedor === jogo.selecao_b ? "chave-vencedor" : ""}">
                ${linhaTime(jogo, "b")}
            </div>

            ${
                jogo.penaltis && jogo.penaltis !== "x"
                ? `<div class="chave-penaltis">🥅 Pênaltis: ${jogo.penaltis}</div>`
                : ""
            }
        </div>
    `;
}

function montarChaveamento() {
    const container = document.getElementById("chaveamento");
    if (!container) return;

    container.innerHTML = `
        <div class="chave-grid">

            <div class="chave-coluna">
                <h3>16-Avos</h3>
                ${[75, 78, 73, 76, 84, 83, 82, 81].map(cardChave).join("")}
            </div>

            <div class="chave-coluna">
                <h3>Oitavas</h3>
                ${[90, 89, 93, 94].map(cardChave).join("")}
            </div>

            <div class="chave-coluna">
                <h3>Quartas</h3>
                ${[97, 98].map(cardChave).join("")}
            </div>

            <div class="chave-coluna">
                <h3>Semifinais</h3>
                ${[101].map(cardChave).join("")}
            </div>

<div class="chave-coluna chave-centro">

    ${cardCampeao()}

    <div class="titulo-final">
        🏆 Final
    </div>

    ${cardChave(104)}

                <div class="titulo-final">🥉 3º Lugar</div>
                ${cardChave(103)}
            </div>

            <div class="chave-coluna">
                <h3>Semifinais</h3>
                ${[102].map(cardChave).join("")}
            </div>

            <div class="chave-coluna">
                <h3>Quartas</h3>
                ${[99, 100].map(cardChave).join("")}
            </div>

            <div class="chave-coluna">
                <h3>Oitavas</h3>
                ${[91, 92, 95, 96].map(cardChave).join("")}
            </div>

            <div class="chave-coluna">
                <h3>16-Avos</h3>
                ${[74, 77, 79, 80, 87, 86, 85, 88].map(cardChave).join("")}
            </div>

        </div>
    `;
}

function cardCampeao(){

    const final = buscarJogo(104);

    let nome = "?";
    let bandeira = "❓";

    if(final && final.realizado){

        nome = final.penaltis && final.penaltis !== "x"
            ? final.penaltis
            : final.vencedor;

        bandeira = flag(nome);

    }

    return `
        <div class="card-campeao">

            <div class="titulo-campeao">
                🏆 CAMPEÃO
            </div>

            <div class="bandeira-campeao">
                ${bandeira}
            </div>

            <div class="nome-campeao">
                ${nome}
            </div>

        </div>
    `;
}

function contarPalpitesCertos(apostador) {

    return apostador.palpites.filter(
        p => Number(p.palpite_certo) === 1
    ).length;
}

function contarPalpitesEmpate(apostador) {

    return obterPalpitesRealizados(apostador).filter(p => {

        const golsA =
            Number(p.gols_a);

        const golsB =
            Number(p.gols_b);

        return !isNaN(golsA) &&
               !isNaN(golsB) &&
               golsA === golsB;

    }).length;
}

function calcularPosicoesPorRodada() {

    const nomes =
        Object.keys(dadosGlobais.evolucao);

    const jogos =
        obterNumerosJogosRealizados();

    const posicoes = {};

    nomes.forEach(nome => {
        posicoes[nome] = {
            segundo: 0,
            ultimo: 0
        };
    });

    jogos.forEach(jogo => {

        const tabela =
            nomes.map(nome => {

                const registro =
                    dadosGlobais.evolucao[nome].find(
                        item => item.jogo === jogo
                    );

                return {
                    nome,
                    pontos: registro ? registro.pontos : 0
                };

            }).sort((a, b) => b.pontos - a.pontos);

        let posicaoAtual = 1;

        tabela.forEach((item, index) => {

            if (
                index > 0 &&
                item.pontos < tabela[index - 1].pontos
            ) {
                posicaoAtual = index + 1;
            }

            if (posicaoAtual === 2) {
                posicoes[item.nome].segundo++;
            }

            if (posicaoAtual === tabela.length) {
                posicoes[item.nome].ultimo++;
            }

        });
    });

    return posicoes;
}



function calcularPontosPorFase(apostador) {

    const ordemFases = [
        "1ª Rodada",
        "2ª Rodada",
        "3ª Rodada",
        "16-Avos",
        "Oitavas de Final",
        "Quartas de Final",
        "Semifinais",
        "Disputa de 3º Lugar",
        "Final"
    ];

    const fases = {};

    apostador.palpites.forEach(palpite => {

        const fase =
            obterNomeFase(palpite.jogo);

        const pontos =
            Number(palpite.pontos) || 0;

        if (!fases[fase]) {
            fases[fase] = {
                fase,
                pontos: 0,
                jogos: 0
            };
        }

        fases[fase].pontos += pontos;
        fases[fase].jogos += 1;
    });

    return ordemFases
        .filter(fase => fases[fase])
        .map(fase => ({
            fase,
            pontos: fases[fase].pontos,
            jogos: fases[fase].jogos,
            media: fases[fase].jogos > 0
                ? fases[fase].pontos / fases[fase].jogos
                : 0
        }));
}

function calcularPontosPorSelecao(apostador) {

    const rankingSelecoes = {};

    apostador.palpites.forEach(palpite => {

        const pontos =
            Number(palpite.pontos) || 0;

        if (palpite.selecao_a) {
            rankingSelecoes[palpite.selecao_a] =
                (rankingSelecoes[palpite.selecao_a] || 0) + pontos;
        }

        if (palpite.selecao_b) {
            rankingSelecoes[palpite.selecao_b] =
                (rankingSelecoes[palpite.selecao_b] || 0) + pontos;
        }

    });

    return Object.entries(rankingSelecoes)
        .map(([selecao, pontos]) => ({
            selecao,
            pontos
        }))
        .sort((a, b) => b.pontos - a.pontos);
}

function calcularDistribuicaoPontos(apostador) {

    const distribuicao = {};

   obterPalpitesRealizados(apostador).forEach(palpite => {

        const pontos =
            Number(palpite.pontos) || 0;

        distribuicao[pontos] =
            (distribuicao[pontos] || 0) + 1;

    });

    return Object.entries(distribuicao)
        .map(([pontos, quantidade]) => ({
            pontos: Number(pontos),
            quantidade
        }))
        .sort((a, b) => b.pontos - a.pontos);
}

function calcularAproveitamento(apostador) {

    const jogosValidos =
        obterPalpitesRealizados(apostador).filter(
            p => p.pontos !== null &&
                 p.pontos !== undefined &&
                 p.pontos !== ""
        );

    const jogosPontuando =
        jogosValidos.filter(
            p => Number(p.pontos) > 0
        );

    const percentual =
        jogosValidos.length > 0
            ? (jogosPontuando.length / jogosValidos.length) * 100
            : 0;

    return {
        percentual,
        jogosPontuando: jogosPontuando.length,
        jogosValidos: jogosValidos.length
    };
}

function calcularSequencias(apostador) {

    let maiorPontuando = 0;
    let maiorZerando = 0;

    let atualPontuando = 0;
    let atualZerando = 0;

    obterPalpitesRealizados(apostador).forEach(palpite => {

        const pontos =
            Number(palpite.pontos) || 0;

        if (pontos > 0) {

            atualPontuando++;
            atualZerando = 0;

        } else {

            atualZerando++;
            atualPontuando = 0;

        }

        maiorPontuando =
            Math.max(maiorPontuando, atualPontuando);

        maiorZerando =
            Math.max(maiorZerando, atualZerando);
    });

    return {
        maiorPontuando,
        maiorZerando
    };
}

function calcularMaiorArrancada(apostador) {

    let melhorPontuacao = 0;
    let melhorSequencia = 0;

    let pontosAtuais = 0;
    let sequenciaAtual = 0;

    apostador.palpites.forEach(palpite => {

        const pontos =
            Number(palpite.pontos) || 0;

        if (pontos > 0) {

            pontosAtuais += pontos;
            sequenciaAtual++;

            if (pontosAtuais > melhorPontuacao) {
                melhorPontuacao = pontosAtuais;
                melhorSequencia = sequenciaAtual;
            }

        } else {

            pontosAtuais = 0;
            sequenciaAtual = 0;

        }
    });

    return {
        pontos: melhorPontuacao,
        jogos: melhorSequencia
    };
}

function classeCorPontuacao(pontos) {

    if (pontos >= 12) return "barra-verde";
    if (pontos >= 6) return "barra-amarela";
    if (pontos >= 3) return "barra-laranja";

    return "barra-vermelha";
}

function renderizarDistribuicaoPontos(distribuicao) {

    if (distribuicao.length === 0) {
        return `
            <div class="card-estatistica">
                <h3>📊 Distribuição dos Pontos</h3>
                <p>Nenhum palpite encontrado.</p>
            </div>
        `;
    }

    const maiorQuantidade =
        Math.max(...distribuicao.map(item => item.quantidade));

    return `
        <div class="card-estatistica">
            <h3>📊 Distribuição dos Pontos</h3>

            <div class="histograma-pontos">

                ${distribuicao.map(item => {

                    const largura =
                        (item.quantidade / maiorQuantidade) * 100;

                    return `
                        <div class="linha-histograma">

                            <div class="label-pontos">
                                ${item.pontos} pts
                            </div>

                            <div class="barra-histograma-fundo">
                                <div
                                    class="barra-histograma ${classeCorPontuacao(item.pontos)}"
                                    style="width:${largura}%">
                                </div>
                            </div>

                            <div class="quantidade-pontos">
                                ${item.quantidade}
                                ${item.quantidade === 1 ? "jogo" : "jogos"}
                            </div>

                        </div>
                    `;
                }).join("")}

            </div>
        </div>
    `;
}

function montarOptionsSelecoes(palpites, selecaoAtual = "todas") {

    const selecoes = new Set();

    palpites.forEach(p => {
        if (p.selecao_a) selecoes.add(p.selecao_a);
        if (p.selecao_b) selecoes.add(p.selecao_b);
    });

    return [...selecoes]
        .sort()
        .map(selecao => `
            <option
                value="${selecao}"
                ${selecaoAtual === selecao ? "selected" : ""}>
                ${selecao}
            </option>
        `)
        .join("");
}

function renderizarEstatisticas(apostadores) {

    const container =
        document.getElementById("estatisticasApostadores");

    if (!container) return;

    container.innerHTML = `
        <div id="participantesGridEstatisticas" class="participantes-grid"></div>
        <div id="detalhesEstatisticas"></div>
    `;

    const grid =
        document.getElementById("participantesGridEstatisticas");

    Object.values(apostadores)
        .forEach(apostador => {

            const card =
                criarCardApostador(
                    apostador,
                    apostadorSelecionado => {
                        mostrarEstatisticasApostador(
                            apostadorSelecionado
                        );
                    }
                );

            grid.appendChild(card);

        });
}

function renderizarDistribuicaoFases(fases) {

    if (fases.length === 0) {
        return "";
    }

    const maiorMedia =
        Math.max(...fases.map(item => item.media));

    return `
        <div class="card-estatistica">
            <h3>🏆 Pontuação por Fase</h3>

            <div class="histograma-pontos">

                ${fases.map(item => {

                    const largura =
                        maiorMedia > 0
                            ? (item.media / maiorMedia) * 100
                            : 0;

                    return `
                        <div class="linha-histograma">

                            <div class="label-fase">
                                ${item.fase}
                            </div>

                            <div class="barra-histograma-fundo">
                                <div
                                    class="barra-histograma ${classeCorFase(item.fase)}"
                                    style="width:${largura}%">
                                </div>
                            </div>

                            <div class="quantidade-pontos">
                                ${item.media.toFixed(2)} pts/jogo
                                <br>
                                <small>${item.pontos} pts</small>
                            </div>

                        </div>
                    `;
                }).join("")}

            </div>
        </div>
    `;
}

function generoApostador(nome) {

    const garotas = ["Ana", "Isa", "Carol", "Trops"];

    return garotas.includes(nome)
        ? "feminino"
        : "masculino";
}

function tituloReiRainha(lista, tituloMasculino, tituloFeminino, tituloPlural) {

    if (!lista || lista.length === 0) {
        return tituloMasculino;
    }

    if (lista.length > 1) {
        return tituloPlural;
    }

    const nome =
        lista[0].nome;

    return generoApostador(nome) === "feminino"
        ? tituloFeminino
        : tituloMasculino;
}

function classeCorFase(fase) {

    if (fase.includes("1ª")) return "fase-azul";
    if (fase.includes("2ª")) return "fase-roxa";
    if (fase.includes("3ª")) return "fase-verde";
    if (fase.includes("16")) return "fase-ciano";
    if (fase.includes("Oitavas")) return "fase-amarela";
    if (fase.includes("Quartas")) return "fase-laranja";
    if (fase.includes("Semifinais")) return "fase-vermelha";
    if (fase.includes("3º")) return "fase-cinza";
    if (fase.includes("Final")) return "fase-dourada";

    return "fase-azul";
}

function mostrarEstatisticasApostador(apostador) {

    const container =
        document.getElementById("detalhesEstatisticas");

    if (!container) return;

    const ranking =
        calcularPontosPorSelecao(apostador);

    const distribuicao =
        calcularDistribuicaoPontos(apostador);

    const fases =
        calcularPontosPorFase(apostador);

    const aproveitamento =
    calcularAproveitamento(apostador);

    const sequencias =
        calcularSequencias(apostador);
    
    const melhorFase =
    [...fases].sort((a, b) => b.media - a.media)[0];
    
    const infoRanking =
        dadosGlobais.classificacao.find(
            p => p.nome === apostador.nome
        );

    const pontos =
        infoRanking ? infoRanking.pontos : 0;

    const posicao =
        infoRanking ? infoRanking.posicao : "-";

    const acertos =
        infoRanking ? infoRanking.acertos : 0;

    const jogosValidos =
        obterPalpitesRealizados(apostador).filter(
            p => p.pontos !== null &&
                 p.pontos !== undefined &&
                 p.pontos !== ""
        );

    const media =
        jogosValidos.length > 0
            ? (pontos / jogosValidos.length).toFixed(2)
            : "0.00";

    const melhorSelecao =
        ranking[0];

    const piorSelecao =
        ranking[ranking.length - 1];

    container.innerHTML = `
    <h2>📋 Scout OP2 - ${apostador.nome}</h2>

    <h3 class="titulo-bloco-estatistica">📊 Resumo</h3>

    <div class="apostador-resumo">

        <div class="resumo-card">
            📊 ${posicao}º lugar
        </div>

        <div class="resumo-card">
            🏆 ${pontos} pts
        </div>

        <div class="resumo-card">
            🎯 ${acertos} acerto(s)
        </div>

        <div class="resumo-card">
            📈 ${media} pts/jogo
        </div>

    </div>

    <h3 class="titulo-bloco-estatistica">⭐ Destaques</h3>

    <div class="apostador-resumo">

        <div class="resumo-card">
            ⭐ Melhor seleção:
            ${melhorSelecao ? flag(melhorSelecao.selecao) : ""}
            ${melhorSelecao ? melhorSelecao.selecao : "-"}
            ${melhorSelecao ? `(${melhorSelecao.pontos} pts)` : ""}
        </div>

        <div class="resumo-card">
            💀 Pior seleção:
            ${piorSelecao ? flag(piorSelecao.selecao) : ""}
            ${piorSelecao ? piorSelecao.selecao : "-"}
            ${piorSelecao ? `(${piorSelecao.pontos} pts)` : ""}
        </div>

        <div class="resumo-card">
            🏅 Melhor fase:
            ${melhorFase ? melhorFase.fase : "-"}
            ${melhorFase ? `(${melhorFase.media.toFixed(2)} pts/jogo)` : ""}
        </div>

        <div class="resumo-card">
            ✅ Aproveitamento:
            ${aproveitamento.percentual.toFixed(1)}%
            (${aproveitamento.jogosPontuando}/${aproveitamento.jogosValidos})
        </div>

    </div>

    <h3 class="titulo-bloco-estatistica">🔥 Consistência</h3>

    <div class="apostador-resumo">

        <div class="resumo-card">
            🔥 Maior sequência pontuando:
            ${sequencias.maiorPontuando} jogo(s)
        </div>

        <div class="resumo-card">
            💀 Maior sequência sem pontuar:
            ${sequencias.maiorZerando} jogo(s)
        </div>

    </div>

    ${renderizarDistribuicaoPontos(distribuicao)}

    ${renderizarDistribuicaoFases(fases)}

    <div class="card-estatistica">
        <h3>🌍 Pontos por Seleção</h3>

        ${ranking.map(item => `
            <div class="linha-ranking-selecao">
                <span>
                    ${flag(item.selecao)}
                    ${item.selecao}
                </span>

                <strong>
                    ${item.pontos} pts
                </strong>
            </div>
        `).join("")}
    </div>
`;

    container.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function criarRecorde(titulo, valor, detalhe = "") {
    return {
        titulo,
        valor,
        detalhe
    };
}

function obterEmpatados(lista, campoValor) {
    const maior =
        Math.max(...lista.map(item => item[campoValor]));

    return lista.filter(
        item => item[campoValor] === maior
    );
}

function calcularMaiorRecuperacao() {

    const nomes =
        Object.keys(dadosGlobais.evolucao);

    const jogos =
        dadosGlobais.evolucao[nomes[0]]
            .filter(item => item.jogo !== 0)
            .map(item => item.jogo);

    const pioresPosicoes = {};

    nomes.forEach(nome => {
        pioresPosicoes[nome] = 1;
    });

    jogos.forEach(jogo => {

        const tabela =
            nomes.map(nome => {
                const registro =
                    dadosGlobais.evolucao[nome].find(
                        item => item.jogo === jogo
                    );

                return {
                    nome,
                    pontos: registro ? registro.pontos : 0
                };
            }).sort((a, b) => b.pontos - a.pontos);

        let posicaoAtual = 1;

        tabela.forEach((item, index) => {

            if (
                index > 0 &&
                item.pontos < tabela[index - 1].pontos
            ) {
                posicaoAtual = index + 1;
            }

            pioresPosicoes[item.nome] =
                Math.max(
                    pioresPosicoes[item.nome],
                    posicaoAtual
                );
        });
    });

    const recuperacoes =
        dadosGlobais.classificacao.map(p => ({
            nome: p.nome,
            valor: pioresPosicoes[p.nome] - p.posicao,
            detalhe: `${pioresPosicoes[p.nome]}º → ${p.posicao}º`
        }));

    return obterEmpatados(recuperacoes, "valor");
}

function calcularRankingJogosEmPrimeiro() {

    const nomes =
        Object.keys(dadosGlobais.evolucao);

    const contagem = {};

    nomes.forEach(nome => {
        contagem[nome] = 0;
    });

    const jogos =
        obterNumerosJogosRealizados();

    jogos.forEach(jogo => {

        const pontosNaRodada =
            nomes.map(nome => {

                const registro =
                    dadosGlobais.evolucao[nome].find(
                        item => Number(item.jogo) === Number(jogo)
                    );

                return {
                    nome,
                    pontos: registro ? registro.pontos : 0
                };
            });

        const maiorPontuacao =
            Math.max(...pontosNaRodada.map(p => p.pontos));

        pontosNaRodada
            .filter(p => p.pontos === maiorPontuacao)
            .forEach(p => {
                contagem[p.nome]++;
            });
    });

    return Object.entries(contagem).map(([nome, valor]) => ({
        nome,
        valor
    }));
}

function calcularMaisJogosEmPrimeiro() {

    return obterEmpatados(
        calcularRankingJogosEmPrimeiro(),
        "valor"
    );
}

function calcularPipocou() {

    const rankingPrimeiro =
        calcularRankingJogosEmPrimeiro();

    const liderAtual =
        dadosGlobais.classificacao[0].nome;

    const candidatos =
        rankingPrimeiro.filter(
            item => item.nome !== liderAtual
        );

    return obterEmpatados(
        candidatos,
        "valor"
    );
}



function calcularHallDaFama(apostadores) {

    const lista =
        Object.values(apostadores);

    const maiorSequencia =
        obterEmpatados(
            lista.map(apostador => {
                const seq = calcularSequencias(apostador);

                return {
                    nome: apostador.nome,
                    valor: seq.maiorPontuando
                };
            }),
            "valor"
        );

    const melhorAproveitamento =
        obterEmpatados(
            lista.map(apostador => {
                const ap = calcularAproveitamento(apostador);

                return {
                    nome: apostador.nome,
                    valor: Number(ap.percentual.toFixed(1))
                };
            }),
            "valor"
        );

    const maiorPontuacaoSelecao =
        obterEmpatados(
            lista.map(apostador => {
                const ranking =
                    calcularPontosPorSelecao(apostador);

                const melhor =
                    ranking[0];

                
                return {
                    nome: apostador.nome,
                    valor: melhor ? melhor.pontos : 0,
                    detalhe: melhor ? melhor.selecao : "-"
                };
            }),
            "valor"
        );

    const melhorMediaFase =
        obterEmpatados(
            lista.map(apostador => {
                const fases =
                    calcularPontosPorFase(apostador);

                const melhor =
                    [...fases].sort(
                        (a, b) => b.media - a.media
                    )[0];

                return {
                    nome: apostador.nome,
                    valor: melhor ? Number(melhor.media.toFixed(2)) : 0,
                    detalhe: melhor ? melhor.fase : "-"
                };
            }),
            "valor"
        );

    const melhorMediaGeral =
        obterEmpatados(
            lista.map(apostador => {

                const info =
                    dadosGlobais.classificacao.find(
                        p => p.nome === apostador.nome
                    );

                const pontos =
                    info ? info.pontos : 0;

                const jogosValidos =
                    obterPalpitesRealizados(apostador).filter(
                        p => p.pontos !== null &&
                             p.pontos !== undefined &&
                             p.pontos !== ""
                    );

                const media =
                    jogosValidos.length > 0
                        ? pontos / jogosValidos.length
                        : 0;

                return {
                    nome: apostador.nome,
                    valor: Number(media.toFixed(2))
                };
            }),
            "valor"
        );
    
const maiorArrancada =
    obterEmpatados(
        lista.map(apostador => {

            const arrancada =
                calcularMaiorArrancada(apostador);

            return {
                nome: apostador.nome,
                valor: arrancada.pontos,
                detalhe: `${arrancada.jogos} jogos`
            };
        }),
        "valor"
    );

    const nostradamus =
    obterEmpatados(
        lista.map(apostador => ({
            nome: apostador.nome,
            valor: contarPalpitesCertos(apostador)
        })),
        "valor"
    );

    const unicosPontuadores =
    calcularUnicosPontuadores(apostadores);

const contraTudo =
    obterEmpatados(
        unicosPontuadores,
        "valor"
    );

const reiRainhaAllIn =
    obterEmpatados(
        lista.map(apostador => ({
            nome: apostador.nome,
            valor: contarAllInMataMata(apostador)
        })),
        "valor"
    );

    const palpitesUnicos =
    calcularPalpitesUnicos(apostadores);
    
    return {
        maiorSequencia,
        melhorAproveitamento,
        maiorPontuacaoSelecao,
        melhorMediaFase,
        melhorMediaGeral,
        maiorRecuperacao: calcularMaiorRecuperacao(),
        maisJogosPrimeiro: calcularMaisJogosEmPrimeiro(),
        maiorArrancada,
        nostradamus,
        contraTudo,
        reiRainhaAllIn,
        palpitesUnicos
    };
}

function nomesEmpatados(lista) {
    return lista.map(item => item.nome).join(", ");
}

function detalhesEmpatados(lista, sufixo = "") {

    if (!lista || lista.length === 0) {
        return "";
    }

    const todosDetalhesIguais =
        lista.every(item =>
            item.valor === lista[0].valor &&
            item.detalhe === lista[0].detalhe
        );

    if (todosDetalhesIguais) {

        const detalhe =
            lista[0].detalhe
                ? ` — ${lista[0].detalhe}`
                : "";

        return `${lista[0].valor}${sufixo}${detalhe}`;
    }

    return lista.map(item => {

        const detalhe =
            item.detalhe
                ? ` — ${item.detalhe}`
                : "";

        return `${item.valor}${sufixo}${detalhe}`;

    }).join("<br>");
}

function montarHallDaFama(apostadores) {

    const container =
        document.getElementById("hallDaFama");

    if (!container) return;

    const hall =
        calcularHallDaFama(apostadores);

    container.innerHTML = `
        <section class="hall-da-fama">
            <h2>🏆 Hall da Fama OP2</h2>

            <div class="hall-grid">

                <div class="hall-card">
                    <div class="hall-titulo">🔮 Nostradamus</div>
                    <div class="hall-nome">${nomesEmpatados(hall.nostradamus)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.nostradamus, " palpites certos")}</div>
                </div>

                <div class="hall-card">
                    <div class="hall-titulo">🔥 Orgulho do Duolingo</div>
                    <div class="hall-nome">${nomesEmpatados(hall.maiorSequencia)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.maiorSequencia, " jogos seguidos pontuando")}</div>
                </div>

                <div class="hall-card">
                    <div class="hall-titulo">⚡ Usain Bolt</div>
                    <div class="hall-nome">${nomesEmpatados(hall.maiorArrancada)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.maiorArrancada, " pts")}</div>
                </div>

                <div class="hall-card">
                    <div class="hall-titulo">✅ ${tituloReiRainha(
                        hall.melhorAproveitamento,
                        "Rei da bet",
                        "Rainha da bet",
                        "Reis da bet"
                    )}
                </div>
                    <div class="hall-nome">${nomesEmpatados(hall.melhorAproveitamento)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.melhorAproveitamento, "% dos jogos pontuando")}</div>
                </div>

                <div class="hall-card">
                    <div class="hall-titulo">🤞 ${tituloReiRainha(
                            hall.maiorPontuacaoSelecao,
                            "O verdadeiro patriota",
                            "A verdadeira patriota",
                            "Os verdadeiros patriotas"
                        )}
                    </div>
                    <div class="hall-nome">${nomesEmpatados(hall.maiorPontuacaoSelecao)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.maiorPontuacaoSelecao, " pts")}</div>
                </div>

                <div class="hall-card">
                    <div class="hall-titulo">🏅 Se fosse só essa fase...</div>
                    <div class="hall-nome">${nomesEmpatados(hall.melhorMediaFase)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.melhorMediaFase, " pts/jogo")}</div>
                </div>

                <div class="hall-card">
                    <div class="hall-titulo">📊 IRA 20000</div>
                    <div class="hall-nome">${nomesEmpatados(hall.melhorMediaGeral)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.melhorMediaGeral, " pts/jogo de média geral")}</div>
                </div>

                <div class="hall-card">
                    <div class="hall-titulo">🚀 Os humilhados serão exaltados</div>
                    <div class="hall-nome">${nomesEmpatados(hall.maiorRecuperacao)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.maiorRecuperacao, " posições")}</div>
                </div>

                <div class="hall-card">
                    <div class="hall-titulo">👑 São Paulo hipotético</div>
                    <div class="hall-nome">${nomesEmpatados(hall.maisJogosPrimeiro)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.maisJogosPrimeiro, " jogos em 1° lugar")}</div>
                </div>

                <div class="hall-card">
                    <div class="hall-titulo">⚔️ Contra tudo e contra todos</div>
                    <div class="hall-nome">${nomesEmpatados(hall.contraTudo)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.contraTudo, " jogos que pontuou sozinho(a)")}</div>
                </div>
                
                <div class="hall-card">
                    <div class="hall-titulo">
                        🎰 ${tituloReiRainha(
                            hall.reiRainhaAllIn,
                            "Rei do All-In",
                            "Rainha do All-In",
                            "Reis do All-In"
                        )}
                    </div>
                    <div class="hall-nome">${nomesEmpatados(hall.reiRainhaAllIn)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.reiRainhaAllIn, " all-ins")}</div>
                </div>

                <div class="hall-card">
                    <div class="hall-titulo">🧠 Diferentão</div>
                    <div class="hall-nome">${nomesEmpatados(hall.palpitesUnicos)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.palpitesUnicos, " palpites só seus")}</div>
                </div>
                

            </div>
        </section>

        ${renderizarHallDaVergonha(apostadores)}
        ${renderizarRankingArgentina(apostadores)}
        
    `;
}

function calcularRankingArgentina(apostadores) {

    return Object.values(apostadores)
        .map(apostador => {

            const rankingSelecoes =
                calcularPontosPorSelecao(apostador);

            const argentina =
                rankingSelecoes.find(
                    item => item.selecao === "Argentina"
                );

            return {
                nome: apostador.nome,
                pontos: argentina ? argentina.pontos : 0
            };
        })
        .sort((a, b) => b.pontos - a.pontos);
}

function obterMenorEmpatados(lista, campoValor) {

    const menor =
        Math.min(...lista.map(item => item[campoValor]));

    return lista.filter(
        item => item[campoValor] === menor
    );
}

function tituloHater(posicao) {

    switch (posicao) {

        case 1:
            return "👃 Nariz do Maradona";

        case 2:
            return "🐐 Fanboyzinho do Messi";

        case 3:
            return "💬 Maradona é melhor que o Pelé";

        case 4:
            return "🙄 Ain eu torço pra quem eu quiser";

        case 5:
            return "🤨 Argentina????";

        case 6:
            return "🥊 Todos acima merecem apanhar";

        case 7:
            return "🇧🇷🙅‍♀️ Aqui é Brasil porraaaaa! 🙅‍♀️🇧🇷";

        default:
            return `${posicao}º`;
    }
}

function renderizarRankingArgentina(apostadores) {

    const ranking =
        calcularRankingArgentina(apostadores);

    return `
        <section class="ranking-argentina">
            <h2>Maiores haters do Brasil</h2>

            <p class="ranking-argentina-subtitulo">
                (aqueles que mais pontuaram com a Argentina)
            </p>

            <div class="ranking-argentina-lista">

                ${ranking.map((item, index) => `
                    <div class="ranking-argentina-linha">

                        <div class="ranking-argentina-posicao">
                            ${tituloHater(index + 1)}
                        </div>

                        <div class="ranking-argentina-nome">
                            ${item.nome}
                        </div>

                        <div class="ranking-argentina-pontos">
                            ${item.pontos} pts
                        </div>

                    </div>
                `).join("")}

            </div>
        </section>
    `;
}

function ehQuase(palpite) {

    const jogo =
        Number(palpite.jogo);

    const pontos =
        Number(palpite.pontos) || 0;

    const envolveBrasil =
        palpite.selecao_a === "Brasil" ||
        palpite.selecao_b === "Brasil";

    if (jogo >= 1 && jogo <= 72) {
        return envolveBrasil
            ? pontos === 8
            : pontos === 4;
    }

    if (jogo >= 73) {
        return envolveBrasil
            ? pontos === 12
            : pontos === 6;
    }

    return false;
}

function calcularHallDaVergonha(apostadores) {

    const lista =
        Object.values(apostadores);

    const maiorHaterBrasil =
        obterEmpatados(
            lista.map(apostador => {

                const rankingSelecoes =
                    calcularPontosPorSelecao(apostador);

                const argentina =
                    rankingSelecoes.find(
                        item => item.selecao === "Argentina"
                    );

                return {
                    nome: apostador.nome,
                    valor: argentina ? argentina.pontos : 0
                };
            }),
            "valor"
        );

    const reiDoQuase =
        obterEmpatados(
            lista.map(apostador => {

                const quantidade =
                    apostador.palpites.filter(ehQuase).length;

                return {
                    nome: apostador.nome,
                    valor: quantidade
                };
            }),
            "valor"
        );

    const especialistaEmZicar =
        obterEmpatados(
            lista.map(apostador => {

                const seq =
                    calcularSequencias(apostador);

                return {
                    nome: apostador.nome,
                    valor: seq.maiorZerando
                };
            }),
            "valor"
        );

    const peFrio =
        obterEmpatados(
            lista.map(apostador => {

const zerados =
    obterPalpitesRealizados(apostador).filter(
        p => Number(p.pontos) === 0
    ).length;

                return {
                    nome: apostador.nome,
                    valor: zerados
                };
            }),
            "valor"
        );

    const artilheiroGolsInuteis =
        obterEmpatados(
            lista.map(apostador => {

                const quantidade =
                    apostador.palpites.filter(ehGolInutil).length;

                return {
                    nome: apostador.nome,
                    valor: quantidade
                };
            }),
            "valor"
        );

    const amigoDoEmpate =
    obterEmpatados(
        lista.map(apostador => ({
            nome: apostador.nome,
            valor: contarPalpitesEmpate(apostador)
        })),
        "valor"
    );

const posicoesPorRodada =
    calcularPosicoesPorRodada();

const viceProfissional =
    obterEmpatados(
        Object.entries(posicoesPorRodada).map(([nome, dados]) => ({
            nome,
            valor: dados.segundo
        })),
        "valor"
    );

const tartaruga =
    obterEmpatados(
        Object.entries(posicoesPorRodada).map(([nome, dados]) => ({
            nome,
            valor: dados.ultimo
        })),
        "valor"
    );

const mariaVaiComAsOutras =
    calcularMariaVaiComAsOutras(apostadores);

    const cavaloParaguaio =
    calcularCavaloParaguaio();

    const elevador =
    calcularElevador();

    const pipocou =
    calcularPipocou();

    return {
        maiorHaterBrasil,
        reiDoQuase,
        especialistaEmZicar,
        peFrio,
        artilheiroGolsInuteis,
        tonhao: calcularTonhao(apostadores),
        amigoDoEmpate,
        viceProfissional,
        tartaruga,
        mariaVaiComAsOutras,
        pipocou,
        elevador
    };
}

function renderizarHallDaVergonha(apostadores) {

    const hall =
        calcularHallDaVergonha(apostadores);

    return `
        <section class="hall-da-vergonha">
            <h2>🚨 Hall da Vergonha OP2</h2>

            <div class="hall-grid">

                <div class="hall-card vergonha-card">
                    <div class="hall-titulo">🇦🇷 Maior hater do Brasil</div>
                    <div class="hall-nome">${nomesEmpatados(hall.maiorHaterBrasil)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.maiorHaterBrasil, " pts com Argentina")}</div>
                </div>

                <div class="hall-card vergonha-card">
                    <div class="hall-titulo">
                        😭 ${tituloReiRainha(
                            hall.reiDoQuase,
                            "Rei do quase",
                            "Rainha do quase",
                            "Reis do quase"
                        )}
                    </div>
                    <div class="hall-nome">${nomesEmpatados(hall.reiDoQuase)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.reiDoQuase, " quase cravadas")}</div>
                </div>

                <div class="hall-card vergonha-card">
                    <div class="hall-titulo">🤡 Professor Pardal</div>
                    <div class="hall-nome">${nomesEmpatados(hall.especialistaEmZicar)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.especialistaEmZicar, " jogos seguidos zerando")}</div>
                </div>

                <div class="hall-card vergonha-card">
                    <div class="hall-titulo">🥶 Pé frio</div>
                    <div class="hall-nome">${nomesEmpatados(hall.peFrio)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.peFrio, " jogos zerados")}</div>
                </div>

                <div class="hall-card vergonha-card">
                    <div class="hall-titulo">🚫 Inimigo do placar</div>
                    <div class="hall-nome">${nomesEmpatados(hall.artilheiroGolsInuteis)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.artilheiroGolsInuteis, " vezes que só acertou o vencedor")}</div>
                </div>

                <div class="hall-card vergonha-card">
                    <div class="hall-titulo">🦆 Empata foda</div>
                    <div class="hall-nome">${nomesEmpatados(hall.amigoDoEmpate)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.amigoDoEmpate, " empates apostados")}</div>
                </div>
                
                <div class="hall-card vergonha-card">
                    <div class="hall-titulo">🥈 Vasco da Gama</div>
                    <div class="hall-nome">${nomesEmpatados(hall.viceProfissional)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.viceProfissional, " rodadas em 2º")}</div>
                </div>
                
                <div class="hall-card vergonha-card">
                    <div class="hall-titulo">🔦 Lanterninha</div>
                    <div class="hall-nome">${nomesEmpatados(hall.tartaruga)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.tartaruga, " rodadas em último")}</div>
                </div>

                <div class="hall-card vergonha-card">
                    <div class="hall-titulo">🐑 Maria vai com as outras</div>
                    <div class="hall-nome">${nomesEmpatados(hall.mariaVaiComAsOutras)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.mariaVaiComAsOutras, " vezes que teve o palpite igual ao de alguém")}</div>
                </div>

                <div class="hall-card vergonha-card">
                    <div class="hall-titulo">🍿 Botafogo 2023</div>
                    <div class="hall-nome">${nomesEmpatados(hall.pipocou)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.pipocou, " jogos em 1º (e não tá mais kkkkk)")}</div>
                </div>
                
                <div class="hall-card vergonha-card">
                    <div class="hall-titulo">🛗 Elevador</div>
                    <div class="hall-nome">${nomesEmpatados(hall.elevador)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.elevador, " mudanças de posição")}</div>
                </div>

                <div class="hall-card vergonha-card">
                    <div class="hall-titulo">🧱 Tonhão</div>
                    <div class="hall-nome">${nomesEmpatados(hall.tonhao)}</div>
                    <div class="hall-valor">${detalhesEmpatados(hall.tonhao, " vezes que todo mundo pontuou menos você")}</div>
                </div>

            </div>
        </section>
    `;
}

function calcularUnicosPontuadores(apostadores) {

    const lista =
        Object.values(apostadores);

    const contagem = {};

    lista.forEach(apostador => {
        contagem[apostador.nome] = 0;
    });

    const totalJogos =
        Math.max(
            ...lista.map(apostador => apostador.palpites.length)
        );

    for (let i = 0; i < totalJogos; i++) {

        const pontuadores =
            lista
                .map(apostador => ({
                    nome: apostador.nome,
                    palpite: apostador.palpites[i]
                }))
                .filter(item =>
                    item.palpite &&
                    Number(item.palpite.pontos) > 0
                );

        if (pontuadores.length === 1) {
            contagem[pontuadores[0].nome]++;
        }
    }

    return Object.entries(contagem)
        .map(([nome, valor]) => ({
            nome,
            valor
        }));
}

function ehAllInMataMata(palpite) {

    const jogo =
        Number(palpite.jogo);

    if (jogo < 73) {
        return false;
    }

    const golsA =
        Number(palpite.gols_a);

    const golsB =
        Number(palpite.gols_b);

    const apostouEmpate =
        !isNaN(golsA) &&
        !isNaN(golsB) &&
        golsA === golsB;

    const pontuou =
        Number(palpite.pontos) > 0;

    return apostouEmpate && pontuou;
}

function contarAllInMataMata(apostador) {

    return apostador.palpites
        .filter(ehAllInMataMata)
        .length;
}



function ehGolInutil(palpite) {

    const jogo =
        Number(palpite.jogo);

    const pontos =
        Number(palpite.pontos) || 0;

    const envolveBrasil =
        palpite.selecao_a === "Brasil" ||
        palpite.selecao_b === "Brasil";

    if (jogo >= 1 && jogo <= 72) {
        return envolveBrasil
            ? pontos === 4
            : pontos === 2;
    }

    if (jogo >= 73) {
        return envolveBrasil
            ? pontos === 6
            : pontos === 3;
    }

    return false;
}

function calcularTonhao(apostadores) {

    const lista =
        Object.values(apostadores);

    const contagem = {};

    lista.forEach(apostador => {
        contagem[apostador.nome] = 0;
    });

    const totalJogos =
        Math.max(
            ...lista.map(apostador =>
                apostador.palpites.length
            )
        );

    for (let i = 0; i < totalJogos; i++) {

        const palpitesDoJogo =
            lista
                .map(apostador => ({
                    nome: apostador.nome,
                    palpite: apostador.palpites[i]
                }))
                .filter(item => item.palpite);

        const zerados =
            palpitesDoJogo.filter(item =>
                Number(item.palpite.pontos) === 0
            );

        const pontuaram =
            palpitesDoJogo.filter(item =>
                Number(item.palpite.pontos) > 0
            );

        if (
            zerados.length === 1 &&
            pontuaram.length === palpitesDoJogo.length - 1
        ) {
            contagem[zerados[0].nome]++;
        }
    }

    const ranking =
        Object.entries(contagem).map(([nome, valor]) => ({
            nome,
            valor
        }));

    return obterEmpatados(ranking, "valor");
}

function calcularHistoricoPosicoes() {

    const nomes =
        Object.keys(dadosGlobais.evolucao);

    const jogos =
        dadosGlobais.evolucao[nomes[0]]
            .filter(item => item.jogo !== 0)
            .map(item => item.jogo);

    const historico = {};

    nomes.forEach(nome => {
        historico[nome] = [];
    });

    jogos.forEach(jogo => {

        const tabela =
            nomes.map(nome => {

                const registro =
                    dadosGlobais.evolucao[nome].find(
                        item => item.jogo === jogo
                    );

                return {
                    nome,
                    pontos: registro ? registro.pontos : 0
                };

            }).sort((a, b) => b.pontos - a.pontos);

        let posicaoAtual = 1;

        tabela.forEach((item, index) => {

            if (
                index > 0 &&
                item.pontos < tabela[index - 1].pontos
            ) {
                posicaoAtual = index + 1;
            }

            historico[item.nome].push(posicaoAtual);
        });
    });

    return historico;
}

function calcularCavaloParaguaio() {

    const historico =
        calcularHistoricoPosicoes();

    const lista =
        dadosGlobais.classificacao.map(participante => {

            const posicoes =
                historico[participante.nome] || [];

            const melhorPosicao =
                posicoes.length > 0
                    ? Math.min(...posicoes)
                    : participante.posicao;

            const posicaoFinal =
                participante.posicao;

            return {
                nome: participante.nome,
                valor: posicaoFinal - melhorPosicao,
                detalhe: `${melhorPosicao}º → ${posicaoFinal}º`
            };
        });

    return obterEmpatados(lista, "valor");
}

function calcularElevador() {

    const historico =
        calcularHistoricoPosicoes();

    const lista =
        Object.entries(historico).map(([nome, posicoes]) => {

            let mudancas = 0;

            for (let i = 1; i < posicoes.length; i++) {

                if (posicoes[i] !== posicoes[i - 1]) {
                    mudancas++;
                }
            }

            return {
                nome,
                valor: mudancas
            };
        });

    return obterEmpatados(lista, "valor");
}

function calcularMariaVaiComAsOutras(apostadores) {

    const lista = Object.values(apostadores);

    const repeticoes = {};

    lista.forEach(a => {
        repeticoes[a.nome] = 0;
    });

    const jogos =
        obterNumerosJogosRealizados();

    jogos.forEach(numeroJogo => {

        const grupos = {};

        lista.forEach(apostador => {

            const palpite =
                obterPalpiteDoJogo(apostador, numeroJogo);

            if (!palpite) return;

            const chave =
                `${palpite.gols_a}x${palpite.gols_b}`;

            if (!grupos[chave]) {
                grupos[chave] = [];
            }

            grupos[chave].push(apostador.nome);
        });

        Object.values(grupos).forEach(grupo => {

            if (grupo.length >= 2) {

                grupo.forEach(nome => {
                    repeticoes[nome]++;
                });

            }

        });

    });

    const ranking =
        Object.entries(repeticoes)
            .map(([nome, valor]) => ({
                nome,
                valor
            }))
            .sort((a, b) => b.valor - a.valor);

    console.group("🐑 Maria Vai com as Outras");
    console.table(ranking);
    console.groupEnd();

    return obterEmpatados(ranking, "valor");
}


function calcularPalpitesUnicos(apostadores) {

    const lista =
        Object.values(apostadores);

    const unicos = {};

    lista.forEach(apostador => {
        unicos[apostador.nome] = 0;
    });

    const jogos =
        obterNumerosJogosRealizados();

    jogos.forEach(numeroJogo => {

        const grupos = {};

        lista.forEach(apostador => {

            const palpite =
                obterPalpiteDoJogo(apostador, numeroJogo);

            if (!palpite) return;

            const golsA =
                Number(palpite.gols_a);

            const golsB =
                Number(palpite.gols_b);

            if (isNaN(golsA) || isNaN(golsB)) return;

            const chave =
                `${golsA}x${golsB}`;

            if (!grupos[chave]) {
                grupos[chave] = [];
            }

            grupos[chave].push(apostador.nome);

        });

        Object.values(grupos).forEach(grupo => {

            if (grupo.length === 1) {
                unicos[grupo[0]]++;
            }

        });

    });

    return obterEmpatados(
        Object.entries(unicos).map(([nome, valor]) => ({
            nome,
            valor
        })),
        "valor"
    );
}
