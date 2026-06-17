import openpyxl
import json

ARQUIVO_EXCEL = "Copa do Mundo 2026.xlsx"
ARQUIVO_JSON = "dados.json"

wb = openpyxl.load_workbook(ARQUIVO_EXCEL, data_only=True)

# =========================
# Classificação
# =========================
ws = wb["Classificação"]

classificacao = []
for row in ws.iter_rows(min_row=3, max_col=7, values_only=True):
    posicao = row[4]
    nome = row[5]
    pontos = row[6]

    if nome is None:
        continue

    classificacao.append({
        "posicao": int(posicao),
        "nome": str(nome),
        "pontos": int(pontos)
    })

# =========================
# Pontuação por rodada
# =========================
ws = wb["Pontuação por rodada"]

cabecalho = [c for c in next(ws.iter_rows(min_row=1, max_row=1, values_only=True))[:8]]
participantes = cabecalho[1:]

evolucao = {p.strip(): [] for p in participantes if p}

for row in ws.iter_rows(min_row=2, values_only=True):
    jogo = row[0]
    jogos_realizados = 0

for jogo in jogo:

    if (
        jogo["golsA"] is not None and
        jogo["golsB"] is not None
    ):
        jogos_realizados += 1
        
    if jogo is None:
        continue

    for i, participante in enumerate(participantes, start=1):
        if participante:
            evolucao[participante.strip()].append({
                "jogo": jogo,
                "pontos": row[i]
            })

dados = {
    "classificacao": classificacao,
    "evolucao": evolucao,
    "jogos": jogos,
    "jogos_realizados": jogos_realizados
}

with open(ARQUIVO_JSON, "w", encoding="utf-8") as f:
    json.dump(dados, f, ensure_ascii=False, indent=2)

print("dados.json gerado com sucesso!")
