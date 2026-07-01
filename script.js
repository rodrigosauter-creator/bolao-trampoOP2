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
    "Estados Unidos":"us",
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
    "Panamá":"pa"

};

function flag(pais){

    // Inglaterra e Escócia usam SVG local

    if(pais === "Inglaterra"){

        return `
            <img
                src="imagens/bandeiras/england.svg"
                class="bandeira-img"
                alt="Inglaterra">
        `;

    }

    if(pais === "Escócia"){

        return `
            <img
                src="imagens/bandeiras/scotland.svg"
                class="bandeira-img"
                alt="Escócia">
        `;

    }

    const codigo = bandeiras[pais];

    if(!codigo){

        return "";
    }

    return `
        <img
            src="https://flagcdn.com/w40/${codigo}.png"
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

                <div class="time ${
                    vencedorA ? "vencedor" : ""
                }">

                    <span class="bandeira">
                        ${flag(jogo.selecao_a)}
                    </span>

                    <span>
                        ${jogo.selecao_a}
                    </span>

                </div>

                <div class="placar">
                    ${placar}
                </div>

                <div class="time ${
                    vencedorB ? "vencedor" : ""
                }">

                    <span class="bandeira">
                        ${flag(jogo.selecao_b)}
                    </span>

                    <span>
                        ${jogo.selecao_b}
                    </span>

                </div>

            </div>

            <div class="jogo-status">

                ${
                    jogo.realizado
                    ? "✅ Finalizado"
                    : "⏳ Aguardando"
                }

                ${
    jogo.jogo >= 73
    ? `
        <div class="jogo-penaltis">
            <strong>Pênaltis:</strong> ${jogo.penaltis}
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

        const acertouEmCheio =
            Number(palpite.palpite_certo) === 1;

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

    <strong class="pontos-jogo">
        ${palpite.pontos} pts
    </strong>

</div>

                <div class="palpite-confronto">

                    <span>
                        ${flag(palpite.selecao_a)}
                        ${palpite.selecao_a}
                    </span>

                    <strong>
                        ${palpite.gols_a} x ${palpite.gols_b}
                    </strong>

                    <span>
                        ${flag(palpite.selecao_b)}
                        ${palpite.selecao_b}
                    </span>

                </div>

                ${
                    Number(palpite.jogo) >= 73
                    ? `
                        <div class="palpite-penaltis">
                            <strong>Pênaltis:</strong> ${palpite.penaltis}
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

    detalhes.innerHTML = html;
