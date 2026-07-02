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

    jogosFiltrados.forEach(jogo => {

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

// =====================================================
// APOSTADORES
// =====================================================

function montarListaApostadores(apostadores) {

    const grid =
        document.getElementById("participantesGrid");

    if (!grid) return;

    grid.innerHTML = "";

    Object.values(apostadores)
        .forEach(apostador => {

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

            card.addEventListener(
                "click",
                () =>
                    mostrarApostador(
                        {
                            ...apostador,
                            palpitesOriginais:
                                apostador.palpites
                        }
                    )
            );

            grid.appendChild(card);

        });

}

function mostrarApostador(apostador, faseAtual = "todos") {

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

    let palpitesFiltrados =
        todosPalpites;

    if (faseAtual !== "todos") {

        palpitesFiltrados =
            todosPalpites.filter(
                p =>
                    Number(p.jogo) >= inicio &&
                    Number(p.jogo) <= fim
            );
    }

    const filtroHTML = `
        <select id="filtroPalpites" class="filtro-rodada">
            <option value="todos" ${faseAtual === "todos" ? "selected" : ""}>Todas as fases</option>
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

    palpitesFiltrados.forEach(palpite => {

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
            <div class="palpite-card ${acertouEmCheio ? "palpite-card-certo" : ""}">

                
                <div class="palpite-topo ${acertouEmCheio ? "com-selo" : "sem-selo"}">

    <span>
        ${acertouEmCheio ? "🏆" : "⚽"}
        Jogo ${palpite.jogo}
    </span>

    ${
        acertouEmCheio
        ? `<div class="selo-palpite">PLACAR EXATO</div>`
        : ""
    }

${
    jogoRealizado
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

    document
        .getElementById("filtroPalpites")
        .addEventListener("change", e => {

            mostrarApostador(
                {
                    ...apostador,
                    palpitesOriginais:
                        todosPalpites
                },
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

function slotChave(numero) {
    return `
        <div class="slot-chave" data-jogo="${numero}">
            ${cardChave(numero)}
        </div>
    `;
}

function slotChave(numero, coluna, y) {
    return `
        <div class="slot-chave" data-jogo="${numero}" style="left:${coluna}px; top:${y}px;">
            ${cardChave(numero)}
        </div>
    `;
}

function montarChaveamento() {
    const container = document.getElementById("chaveamento");
    if (!container) return;

    container.innerHTML = `
        <div class="chave-area">

            <h3 class="titulo-fase" style="left:20px; top:10px;">16-Avos</h3>
            <h3 class="titulo-fase" style="left:300px; top:280px;">Oitavas</h3>
            <h3 class="titulo-fase" style="left:580px; top:430px;">Quartas</h3>
            <h3 class="titulo-fase" style="left:860px; top:540px;">Semifinais</h3>

            ${slotChave(75, 20, 70)}
            ${slotChave(78, 20, 225)}
            ${slotChave(73, 20, 380)}
            ${slotChave(76, 20, 535)}
            ${slotChave(84, 20, 690)}
            ${slotChave(83, 20, 845)}
            ${slotChave(82, 20, 1000)}
            ${slotChave(81, 20, 1155)}

            ${slotChave(90, 300, 300)}
            ${slotChave(89, 300, 455)}
            ${slotChave(93, 300, 765)}
            ${slotChave(94, 300, 920)}

            ${slotChave(97, 580, 500)}
            ${slotChave(98, 580, 820)}

            ${slotChave(101, 860, 650)}

            <div class="centro-final" style="left:1140px; top:330px;">
                ${cardCampeao()}
                <div class="titulo-final">🏆 Final</div>
                ${slotChave(104, 0, 180)}
                <div class="titulo-final">🥉 3º Lugar</div>
                ${slotChave(103, 0, 350)}
            </div>

            <h3 class="titulo-fase" style="left:1420px; top:540px;">Semifinais</h3>
            <h3 class="titulo-fase" style="left:1700px; top:430px;">Quartas</h3>
            <h3 class="titulo-fase" style="left:1980px; top:280px;">Oitavas</h3>
            <h3 class="titulo-fase" style="left:2260px; top:10px;">16-Avos</h3>

            ${slotChave(102, 1420, 650)}

            ${slotChave(99, 1700, 500)}
            ${slotChave(100, 1700, 820)}

            ${slotChave(91, 1980, 300)}
            ${slotChave(92, 1980, 455)}
            ${slotChave(95, 1980, 765)}
            ${slotChave(96, 1980, 920)}

            ${slotChave(74, 2260, 70)}
            ${slotChave(77, 2260, 225)}
            ${slotChave(79, 2260, 380)}
            ${slotChave(80, 2260, 535)}
            ${slotChave(87, 2260, 690)}
            ${slotChave(86, 2260, 845)}
            ${slotChave(85, 2260, 1000)}
            ${slotChave(88, 2260, 1155)}

        </div>
    `;

    setTimeout(desenharLinhasChave, 300);
}

function desenharLinhasChave() {
    const container = document.getElementById("chaveamento");
    if (!container) return;

    const antiga = container.querySelector(".linhas-chave");
    if (antiga) antiga.remove();

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("linhas-chave");
    container.appendChild(svg);

    svg.setAttribute("width", container.scrollWidth);
    svg.setAttribute("height", container.scrollHeight);
    svg.setAttribute("viewBox", `0 0 ${container.scrollWidth} ${container.scrollHeight}`);
    
    const grid = container.querySelector(".chave-grid");
    const rectContainer = container.getBoundingClientRect();

if (!grid) return;

    const conexoes = [
        [75, 78, 90],
        [73, 76, 89],
        [84, 83, 93],
        [82, 81, 94],

        [90, 89, 97],
        [93, 94, 98],
        [97, 98, 101],

        [74, 77, 91],
        [79, 80, 92],
        [87, 86, 95],
        [85, 88, 96],

        [91, 92, 99],
        [95, 96, 100],
        [99, 100, 102]
    ];

    conexoes.forEach(([jogoA, jogoB, jogoDestino]) => {
        const a = container.querySelector(`[data-jogo="${jogoA}"]`);
        const b = container.querySelector(`[data-jogo="${jogoB}"]`);
        const destino = container.querySelector(`[data-jogo="${jogoDestino}"]`);

        if (!a || !b || !destino) return;

        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const rd = destino.getBoundingClientRect();

        const ladoEsquerdo = ra.left < rd.left;

        const xA = ladoEsquerdo ? ra.right - rectContainer.left : ra.left - rectContainer.left;
        const yA = ra.top + ra.height / 2 - rectContainer.top;

        const xB = ladoEsquerdo ? rb.right - rectContainer.left : rb.left - rectContainer.left;
        const yB = rb.top + rb.height / 2 - rectContainer.top;

        const xD = ladoEsquerdo ? rd.left - rectContainer.left : rd.right - rectContainer.left;

        const xMeio = ladoEsquerdo
            ? xA + (xD - xA) / 2
            : xA - (xA - xD) / 2;

        const yMeio = (yA + yB) / 2;

        const path = `
            M ${xA} ${yA}
            H ${xMeio}
            V ${yB}
            H ${xB}
            M ${xMeio} ${yMeio}
            H ${xD}
        `;

        const linha = document.createElementNS("http://www.w3.org/2000/svg", "path");
        linha.setAttribute("d", path);
        linha.setAttribute("fill", "none");
        linha.setAttribute("stroke", "#111");
        linha.setAttribute("stroke-width", "2");

        svg.appendChild(linha);

        console.log("Linhas desenhadas:", svg.querySelectorAll("path").length);
        
    });
}

window.addEventListener("resize", desenharLinhasChave);

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
