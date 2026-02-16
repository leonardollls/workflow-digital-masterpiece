# Otimização de Performance - Roberta Bento Odontologia

## O Que Mudou

Refatoração completa da página `/site/robertabento-odontologia` focada em eliminar gargalos críticos de performance identificados via análise manual e PageSpeed Insights.

### Arquivos Alterados

| Arquivo | Tipo de Mudança |
|---------|----------------|
| `src/pages/VendasRobertaBento.tsx` | Reescrita completa com lazy loading e imports diretos |
| `src/components/vendas/HeroMockup3D.tsx` | Adição de `staticMode` para eliminar iframe |
| `src/components/vendas/Mockup3D.tsx` | Adição de `staticMode` para eliminar iframe |
| `src/components/vendas/LogoCarousel.tsx` | Redução de duplicação de 4x para 2x |
| `src/components/ui/LazySection.tsx` | Novo componente de lazy loading com IntersectionObserver |
| `src/App.tsx` | Remoção de setInterval(200ms) do FaviconCleaner |
| `index.html` | Remoção de setInterval(200ms) do FaviconCleaner |

---

## Motivação

A página apresentava problemas críticos de performance:

1. **4 iframes carregando site externo**: Cada iframe carregava a URL `robertabento.vercel.app` na inicialização, equivalendo a 4 carregamentos completos de página
2. **Barrel import importava 53+ componentes**: O `vendas/index.ts` forçava o download de todos os componentes mesmo usando poucos
3. **FaviconCleaner com setInterval(200ms)**: Execução de queries DOM a cada 200ms desnecessariamente
4. **48 imagens no LogoCarousel**: Duplicação 4x dos 12 logos originais
5. **Zero lazy loading**: Todas as seções renderizavam imediatamente, independente da visibilidade

---

## Impacto das Otimizações

### 1. Eliminação de Iframes (Impacto: Crítico)

**Antes**: 4 iframes carregando `robertabento.vercel.app` na inicialização (HeroMockup3D x3 + Mockup3D x1)  
**Depois**: 0 iframes na inicialização. Placeholders estáticos com gradientes CSS. Iframe só carrega quando o usuário abre o modal de preview.

- Economia de ~4 carregamentos completos de página
- Redução massiva de LCP, TBT e CLS
- Prop `staticMode` adicionada de forma retrocompatível

### 2. Lazy Loading com IntersectionObserver (Impacto: Alto)

**Antes**: Todos os 15+ componentes renderizados imediatamente  
**Depois**: Componentes abaixo do fold carregam apenas quando se aproximam do viewport (rootMargin: 300-400px)

Componentes lazy-loaded:
- `SocialProof`, `LighthouseScores`, `FeatureComparison`
- `QRCodePreview`, `LoadTimeCounter`, `UptimeScore`, `CodeOptimization`
- `Mockup3D`, `FAQ`, `LogoCarousel`, `DeveloperShowcase`
- `AdminPanelShowcaseRobertaBento`, `HostingBonusSection`

### 3. Imports Diretos (Impacto: Alto)

**Antes**: `import { ... } from '@/components/vendas'` (barrel import de 53 exports)  
**Depois**: `import Component from '@/components/vendas/Component'` (imports diretos por arquivo)

- Tree-shaking mais eficiente
- Code splitting granular por componente via `React.lazy()`
- Cada chunk carrega independentemente

### 4. Remoção de setInterval do FaviconCleaner (Impacto: Médio)

**Antes**: `setInterval(forceLeonardoFavicon, 200)` - queries DOM a cada 200ms indefinidamente  
**Depois**: Apenas MutationObserver (já suficiente para monitorar mudanças dinâmicas)

- Economia de ~5 queries DOM/segundo
- Liberação da main thread

### 5. Redução de LogoCarousel (Impacto: Médio)

**Antes**: 12 logos × 4 = 48 elementos DOM + 48 imagens  
**Depois**: 12 logos × 2 = 24 elementos DOM + 24 imagens

- 50% menos nodes DOM
- 50% menos requisições de imagem

### 6. Otimizações Adicionais

- **Scroll handler throttled**: Uso de `requestAnimationFrame` para throttling nativo
- **useEffect consolidados**: 3 useEffects de keyboard/scroll → 1 combinado
- **Remoção de HeroMockup3D duplicado**: De 3 instâncias para 2 (hero + preview section)
- **Acessibilidade**: `aria-label`, `aria-expanded`, `role` em elementos interativos
- **Navegação refatorada**: Função `scrollToSection(id)` unificada

---

## Dependências Alteradas

Nenhuma dependência nova adicionada. Nenhuma removida.

---

## Breaking Changes

Nenhum. As alterações nos componentes compartilhados (`HeroMockup3D`, `Mockup3D`, `LogoCarousel`) são retrocompatíveis:
- `staticMode` é prop opcional (default: `false`)
- Redução de duplicação no LogoCarousel não afeta comportamento visual
- Remoção do `setInterval` é transparente (MutationObserver já cobre o caso de uso)
