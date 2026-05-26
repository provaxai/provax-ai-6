## Dois ajustes visuais pontuais

### 1) Fundo da barra de título do bloco (imagem 1)
Arquivo: `src/components/EditalVerticalizado.tsx` (linha ~316)

Hoje a barra "BLOCO 1 Informática" usa `bg-slate-50` — quase imperceptível. Trocar por um fundo azul claro destacado, alinhado à paleta PRF:

- `background: linear-gradient(180deg, #E6EEF9 0%, #D8E4F5 100%)`
- `border: 1px solid #C7D5EA`
- Hover: gradient levemente mais escuro (`#DCE6F4` → `#CBDAEF`)
- Manter cantos arredondados (`rounded-lg`) e padding atuais
- Texto "Bloco N" passa de `text-slate-500` para `text-[#1B4FD8]` (mantém uppercase + bold) para reforçar a identidade
- Botão "Marcar concluído →" e "% coberto" permanecem nas cores atuais (já em azul PRF)

### 2) Botão "Certo" selecionado (imagem 2)
Arquivo: `src/components/Treinar.tsx` (linha ~477)

Hoje o estado selecionado é `bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200` — fica verde-claro sobre verde-claro, ilegível. Trocar para um estado sólido de alto contraste:

- Selecionado: `bg-emerald-600 border-emerald-700 text-white ring-2 ring-emerald-300 shadow-md`
- Texto secundário "(Assertiva Verdadeira)" quando selecionado: `text-white/80` em vez de `text-emerald-600/70`
- Não-selecionado fica como está (`bg-emerald-50 border-emerald-300 text-emerald-700`)
- Aplicar tratamento equivalente ao botão "Errado": selecionado `bg-rose-600 border-rose-700 text-white ring-2 ring-rose-300 shadow-md`, texto secundário `text-white/80`

Sem mudanças em lógica, estrutura ou outros componentes.
