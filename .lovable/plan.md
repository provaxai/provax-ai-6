## Visual polish — 4 ajustes pontuais

Apenas mudanças de estilo (cores, fundos, bordas). Nenhuma alteração de lógica/estrutura.

---

### 1) Cabeçalho da tabela do Edital (imagem 1)
Arquivo: `src/components/EditalVerticalizado.tsx` (linhas ~364–373)

Hoje a linha do cabeçalho (`Código | Subtópico | Estudo | Resumo | Revisão | Simulado | Ação`) só tem `border-b`. Vou destacar o fundo:

- Adicionar `background: linear-gradient(180deg,#F1F5FB 0%,#E6EEF9 100%)` no `<tr>` do `thead`.
- Borda inferior mais firme: `border-bottom: 1px solid #C7D5EA`.
- Texto do header: cor `#475569` (slate-600) em vez de `#94A3B8`, mantendo `font-weight 500`.
- Manter as cores específicas de Estudo (azul), Resumo (âmbar) e Revisão (roxo) mas escurecendo levemente para melhor contraste sobre o novo fundo (`#2563EB`, `#D97706`, `#9333EA`).
- Cantos arredondados no topo: `border-top-left-radius: 8px` na primeira `<th>` e `border-top-right-radius: 8px` na última.

---

### 2) Botão "Certo / Errado" no modo claro (imagem 2)
Arquivo: `src/components/Treinar.tsx` (linhas ~470–498)

Hoje usa `bg-green-950/40` que fica num verde-musgo apagado sobre fundo claro. Trocar pelo padrão claro:

- Botão "Certo" (estado não selecionado): `bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400`.
- Estado selecionado: `bg-emerald-100 border-emerald-500 text-emerald-700 ring-2 ring-emerald-200 shadow-sm`.
- Texto secundário "(Assertiva Verdadeira)": `text-emerald-600/70`.
- Botão "Errado" recebe tratamento equivalente com a paleta `rose` (rose-50/100/300/500/600/700) — mantém a polaridade visual verde/vermelho, só que clara e legível.

---

### 3) Badges "Urgente (Atrasado)" e "Intervalo: X dia" (imagem 3)
Arquivo: `src/components/Treinar.tsx` (linhas ~706–718)

Hoje ambos usam `bg-amber-950` / `bg-slate-900` (escuros) e ficam ilegíveis no modo claro.

- "Urgente (Atrasado)": `bg-red-50 border border-red-200 text-red-700 font-bold` com `animate-pulse` mantido; trocar ícone para `text-red-600`.
- "Intervalo: X dia(s)": `bg-blue-50 border border-blue-200 text-blue-700 font-semibold`.
- Badge da disciplina (linha acima): `bg-slate-100 border-slate-200 text-slate-600`.
- Aplicar o mesmo retoque ao container do card quando `isUrgent`: borda `border-red-200` em vez de `border-amber-500/40` e fundo `bg-white` em vez de `bg-slate-950`.

---

### 4) Radar do CONTRAN — paleta azul (imagem 4)
Arquivo: `src/components/RadarContran.tsx`

Substituir TODA a paleta âmbar/laranja por azul PRF, mantendo a estrutura/animações:

- `amber-400` → `#1B4FD8` (BLUE)
- `amber-500` → `#1339A8` (BLUE_DARK)
- `amber-500/10`, `/15`, `/20`, `/30` → equivalentes em `#1B4FD8` com mesma opacidade (`bg-[#1B4FD8]/10` etc.)
- `amber-950/60` → `bg-blue-950/60`
- Ícone `Info` e textos "Mentora Athena" / "Explicação Estratégica" → `text-[#1B4FD8]`
- Pulse do radar (pontos animados): `bg-[#1B4FD8]`
- Anéis e linhas do radar: `border-[#1B4FD8]/15`
- **Botão CTA "Treinar agora" (linha ~359)**: hoje `bg-amber-500 text-slate-950`. Trocar para `bg-[#1B4FD8] hover:bg-[#1339A8] text-white shadow-md`.
- Pill ativa de filtro (linha ~228): `bg-[#1B4FD8]/10 border-[#1B4FD8]/30 text-[#1B4FD8]`.
- Card selecionado (linha ~244): `border-[#1B4FD8]/60`; barra lateral `bg-[#1B4FD8]`.

Manter qualquer verde/vermelho semântico (Certo/Errado) intocado.

---

### Verificação
Após aplicar, abrir as 4 telas no preview e conferir contraste/legibilidade nos pontos das capturas; ajustar tons só se algo ficar duro demais.