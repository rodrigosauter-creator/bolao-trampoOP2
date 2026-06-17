import openpyxl
import json

ARQUIVO_EXCEL = "Copa do Mundo 2026.xlsx"
ARQUIVO_JSON = "dados.json"

# =========================
# Abrir planilha
# =========================

wb = openpyxl.load_workbook(
    ARQUIVO_EXCEL,
    data_only=True
)

# =========================
# Classificação
# =========================

ws = wb["Classificação"]

classificacao = []

for row in ws.iter_rows(
    min_row=3,
    max_col=8,
    values_only=True
):

    posicao = row[4]   # Coluna E
    nome = row[5]      # Coluna F
    pontos = row[6]    # Coluna G
    acertos = row[7]   # Coluna H

    if nome is None:
        continue

    classificacao.append({
        "posicao": int(posicao) if posicao is not None else 0,
        "nome": str(nome),
        "pontos": int(pontos) if pontos is not None else 0,
        "acertos": int(acertos) if acertos is not None else 0
    })

# =========================
# Pontuação por rodada
# =========================

ws = wb["Pontuação por rodada"]

cabecalho = list(
    next(
        ws.iter_rows(
            min_row=1,
            max_row=1,
            values_only=True
        )
    )
)

participantes = cabecalho[1:]

evolucao = {}

for participante in participantes:

    if participante:

        evolucao[str(participante).strip()] = []

for row in ws.iter_rows(
    min_row=2,
    values_only=True
):

    jogo = row[0]

    if jogo is None:
        continue

    for i, participante in enumerate(
        participantes,
        start=1
    ):

        if participante:

            evolucao[
                str(participante).strip()
            ].append({
                "jogo": jogo,
                "pontos": row[i] if row[i] is not None else 0
            })

# =========================
# Jogos realizados
# =========================

ws = wb["Tabela de Jogos"]

jogos_realizados = 0

for row in ws.iter_rows(
    min_row=3,
    values_only=True
):

    golsA = row[2]  # Coluna C
    golsB = row[4]  # Coluna E

    if golsA is not None and golsB is not None:
        jogos_realizados += 1

# =========================
# Exportação JSON
# =========================

dados = {
    "classificacao": classificacao,
    "evolucao": evolucao,
    "jogos_realizados": jogos_realizados
}

with open(
    ARQUIVO_JSON,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        dados,
        f,
        ensure_ascii=False,
        indent=2
    )

wb.close()

print(
    f"dados.json gerado com sucesso. "
    f"Jogos realizados: {jogos_realizados}"
)
