// =====================================================
// BANDEIRAS
// =====================================================

const bandeiras = {
    "México":"🇲🇽",
    "África do Sul":"🇿🇦",
    "Coreia do Sul":"🇰🇷",
    "Tchéquia":"🇨🇿",
    "Canadá":"🇨🇦",
    "Bósnia":"🇧🇦",
    "Bosnia":"🇧🇦",
    "Qatar":"🇶🇦",
    "Suíça":"🇨🇭",
    "Suiça":"🇨🇭",
    "Brasil":"🇧🇷",
    "Marrocos":"🇲🇦",
    "Haiti":"🇭🇹",
    "Escócia":"🏴",
    "Estados Unidos":"🇺🇸",
    "Paraguai":"🇵🇾",
    "Austrália":"🇦🇺",
    "Turquia":"🇹🇷",
    "Alemanha":"🇩🇪",
    "Curaçao":"🇨🇼",
    "Costa do Marfim":"🇨🇮",
    "Equador":"🇪🇨",
    "Holanda":"🇳🇱",
    "Japão":"🇯🇵",
    "Suécia":"🇸🇪",
    "Tunísia":"🇹🇳",
    "Bélgica":"🇧🇪",
    "Egito":"🇪🇬",
    "Irã":"🇮🇷",
    "Nova Zelândia":"🇳🇿",
    "Espanha":"🇪🇸",
    "Cabo Verde":"🇨🇻",
    "Arábia Saudita":"🇸🇦",
    "Uruguai":"🇺🇾",
    "França":"🇫🇷",
    "Senegal":"🇸🇳",
    "Iraque":"🇮🇶",
    "Noruega":"🇳🇴",
    "Argentina":"🇦🇷",
    "Argélia":"🇩🇿",
    "Áustria":"🇦🇹",
    "Jordânia":"🇯🇴",
    "Portugal":"🇵🇹",
    "RD Congo":"🇨🇩",
    "Uzbequistão":"🇺🇿",
    "Colômbia":"🇨🇴",
    "Inglaterra":"🏴",
    "Croácia":"🇭🇷",
    "Gana":"🇬🇭",
    "Panamá":"🇵🇦"
};

function flag(pais) {
    return bandeiras[pais] || "🏳️";
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

function montarGrafico(evolucao) {

    const canvas =
        document.getElementById("grafico");

    if (!canvas) return;

    const limite =
        dadosGlobais.jogos_realizados + 1;

    const nomes =
        Object.keys(evolucao);

    const labels =
        evolucao[nomes[0]]
            .slice(0, limite)
            .map(item =>
                item.jogo === 0
                    ? "Início"
                    : `J${item.jogo}`
            );

    const datasets = nomes.map(nome => {

        return {

            label: nome,

            data: evolucao[nome]
                .slice(0, limite)
                .map(item => item.pontos),

            tension: 0.25,

            fill: false
        };
    });

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
        document.getElementById(
            "participantesGrid"
        );

    if (!grid) return;

    grid.innerHTML = "";

    Object.values(apostadores)
        .forEach(apostador => {

            const card =
                document.createElement("div");

            card.className =
                "participante-card";

           card.innerHTML = `
    <div class="card-apostador">

        <img
            src="imagens/cards/${apostador.nome}.png"
            alt="${apostador.nome}"
            class="imagem-card">

        <div class="info-card">

            <div class="posicao-card">
                🏆 ${apostador.posicao}º Lugar
            </div>

            <div class="pontos-card">
                ${apostador.total} pts
            </div>

            <div class="acertos-card">
                🎯 ${apostador.acertos} acerto(s)
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
                            palpitesOriginais: structuredClone(apostador.palpites)
                        }
                    )
            );

            grid.appendChild(card);
        });
}

function mostrarApostador(apostador, faseAtual = "todos") {

    const classificacao = dadosGlobais.classificacao;

    const infoRanking = classificacao.find(
    p => p.nome === apostador.nome
);
    const posicao = infoRanking ? infoRanking.posicao : "-";
    
    const detalhes =
        document.getElementById(
            "detalhesApostador"
        );

    if (!detalhes) return;

const filtroHTML = `
<select id="filtroPalpites" class="filtro-rodada">

    <option value="todos" ${faseAtual === "todos" ? "selected" : ""}>
        Todas as fases
    </option>

    <option value="1" ${faseAtual === "1" ? "selected" : ""}>
        1ª Rodada (1-24)
    </option>

    <option value="2" ${faseAtual === "2" ? "selected" : ""}>
        2ª Rodada (25-48)
    </option>

    <option value="3" ${faseAtual === "3" ? "selected" : ""}>
        3ª Rodada (49-72)
    </option>

    <option value="16" ${faseAtual === "16" ? "selected" : ""}>
        16-Avos (73-88)
    </option>

    <option value="8" ${faseAtual === "8" ? "selected" : ""}>
        Oitavas (89-96)
    </option>

    <option value="4" ${faseAtual === "4" ? "selected" : ""}>
        Quartas (97-100)
    </option>

    <option value="semi" ${faseAtual === "semi" ? "selected" : ""}>
        Semifinais (101-102)
    </option>

    <option value="terceiro" ${faseAtual === "terceiro" ? "selected" : ""}>
        3º Lugar (103)
    </option>

    <option value="final" ${faseAtual === "final" ? "selected" : ""}>
        Final (104)
    </option>

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
                🏆 ${apostador.total} pts
            </div>
        
            <div class="resumo-card">
                🎯 ${apostador.acertos} acerto(s)
            </div>
        
        </div>

        <table class="tabela-palpites">

            <thead>
                <tr>
                    <th>Jogo</th>
                    <th>Palpite</th>
                    <th>Pontos</th>
                </tr>
            </thead>

            <tbody>
    `;

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

console.log(
    "Fase:",
    faseAtual,
    "Palpites encontrados:",
    palpitesFiltrados.length
);
  
palpitesFiltrados.forEach(
    palpite => {

        html += `

        <tr>

            <td>
                ${palpite.jogo}
            </td>

            <td>

                ${flag(
                    palpite.selecao_a
                )}

                ${palpite.selecao_a}

                <strong>
                    ${palpite.gols_a}
                    x
                    ${palpite.gols_b}
                </strong>

                ${flag(
                    palpite.selecao_b
                )}

                ${palpite.selecao_b}

            </td>

            <td>
                ${palpite.pontos}
            </td>

        </tr>
        `;
    }
);

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
}
