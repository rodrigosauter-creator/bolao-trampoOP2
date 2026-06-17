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


function montarCardsDashboard(classificacao) {

    document.getElementById("lider").textContent =
        classificacao[0]?.nome || "-";

    document.getElementById("participantes").textContent =
        classificacao.length;

    document.getElementById("maxPontos").textContent =
        classificacao[0]?.pontos || 0;
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
    
    console.log("Entrou em carregarDados");

    const response =
        await fetch("dados.json");

    const dados =
        await response.json();

    dadosGlobais = dados;

    montarPodio(
        dados.classificacao
    );

    montarClassificacao(
        dados.classificacao
    );

    montarCardsDashboard(
        dados.classificacao
    );

    montarGrafico(
        dados.evolucao
    );

   montarJogos(
       dados.jogos
    ); 

 montarListaApostadores(
    dados.apostadores
);

    inicializarAbas();

    console.log(
        "Dados carregados com sucesso."
    );
}

document.addEventListener(
    "DOMContentLoaded",
    carregarDados
);

// =====================================================
// JOGOS
// =====================================================

function montarJogos(jogos) {

    const container =
        document.getElementById("listaJogos");

    if (!container) return;

    container.innerHTML = "";

    jogos.forEach(jogo => {

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
                <h3>${apostador.nome}</h3>

                <div class="participante-info">
                    ${apostador.total} pts
                </div>

                <div class="participante-info">
                    ${apostador.acertos} acerto(s)
                </div>
            `;

            card.addEventListener(
                "click",
                () =>
                    mostrarApostador(
                        apostador
                    )
            );

            grid.appendChild(card);
        });
}

function mostrarApostador(apostador) {

    const detalhes =
        document.getElementById(
            "detalhesApostador"
        );

    if (!detalhes) return;

    let html = `

        <h2>${apostador.nome}</h2>

        <div class="apostador-resumo">

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

    apostador.palpites.forEach(
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

    html += `
            </tbody>
        </table>
    `;

    detalhes.innerHTML = html;
}
