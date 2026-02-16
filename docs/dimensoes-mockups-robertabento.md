# Dimensões de Imagem para Mockups - Roberta Bento Odontologia

## Análise dos Componentes de Mockup

### HeroMockup3D (Desktop Mockup)

**Container da Tela:**
- **Desktop**: Altura `340px`, largura `100%` (responsiva, geralmente ~800-1200px)
- **Mobile**: Altura `200px`
- **Compact**: Altura `180px`

**Iframe com Scale:**
- O iframe usa `transform: scale(0.35)` com `width: 286%` e `height: 286%`
- Isso significa que a imagem real precisa ser **~817px de altura** para preencher adequadamente

**Dimensões Recomendadas para Screenshot:**

| Tipo | Largura | Altura | Aspect Ratio | Uso |
|------|---------|--------|--------------|-----|
| **Desktop Full** | 1920px | 1080px | 16:9 | Screenshot completo da página |
| **Desktop Hero** | 1920px | 1080px | 16:9 | Área acima do fold |
| **Desktop Content** | 1920px | 2160px | 16:18 | Conteúdo completo (2x altura) |

**Para o mockup 3D específico:**
- **Largura mínima**: 1920px (Full HD)
- **Altura mínima**: 1080px (Full HD)
- **Recomendado**: 2560px × 1440px (2K) ou 3840px × 2160px (4K) para melhor qualidade

---

### Mockup3D (Mobile Mockup)

**Container da Tela:**
- **Largura**: `150px` (fixo)
- **Altura**: `270px` (fixo)
- **Aspect Ratio**: ~9:16 (portrait)

**Iframe com Scale:**
- O iframe usa `transform: scale(0.28)` com `width: 357%` e `height: 357%`
- Isso significa que a imagem real precisa ser **~964px de altura**

**Dimensões Recomendadas para Screenshot Mobile:**

| Tipo | Largura | Altura | Aspect Ratio | Uso |
|------|---------|--------|--------------|-----|
| **iPhone 14 Pro** | 393px | 852px | 9:19.5 | Tamanho real |
| **iPhone 14 Pro Max** | 430px | 932px | 9:19.5 | Tamanho real |
| **Screenshot Mobile** | 1080px | 1920px | 9:16 | Screenshot completo (3x) |
| **Screenshot Mobile Hero** | 1080px | 1920px | 9:16 | Área acima do fold |

**Para o mockup 3D específico:**
- **Largura mínima**: 1080px (3x do iPhone)
- **Altura mínima**: 1920px (3x do iPhone)
- **Recomendado**: 1242px × 2208px (iPhone 6/7/8 Plus @3x) ou 1284px × 2778px (iPhone 14 Pro Max @3x)

---

## Especificações Técnicas para Screenshots

### Formato e Qualidade

- **Formato**: PNG (sem perda) ou WebP (com compressão otimizada)
- **Qualidade**: 90-95% (WebP) ou PNG sem compressão
- **Profundidade de cor**: 24-bit RGB
- **Background**: Transparente ou branco (#FFFFFF)

### Desktop Screenshot

```javascript
// Dimensões ideais para HeroMockup3D
const desktopScreenshot = {
  width: 1920,        // Full HD
  height: 1080,        // Full HD
  // ou
  width: 2560,        // 2K (recomendado)
  height: 1440,       // 2K (recomendado)
  
  // Para mockup completo (scroll)
  fullPage: {
    width: 1920,
    height: 2160,      // 2x altura para conteúdo completo
  }
};
```

### Mobile Screenshot

```javascript
// Dimensões ideais para Mockup3D
const mobileScreenshot = {
  width: 1080,         // 3x iPhone
  height: 1920,        // 9:16 aspect ratio
  
  // iPhone 14 Pro Max @3x
  iphone14ProMax: {
    width: 1284,
    height: 2778,
  },
  
  // iPhone 14 Pro @3x
  iphone14Pro: {
    width: 1179,
    height: 2556,
  }
};
```

---

## Como Capturar os Screenshots

### Opção 1: Chrome DevTools (Recomendado)

1. Abra `https://robertabento.vercel.app/` no Chrome
2. Abra DevTools (F12)
3. Ative o Device Toolbar (Ctrl+Shift+M)
4. Para Desktop:
   - Selecione "Responsive"
   - Defina: 1920px × 1080px
   - Capture screenshot (Ctrl+Shift+P → "Capture screenshot")
5. Para Mobile:
   - Selecione "iPhone 14 Pro Max" ou "iPhone 14 Pro"
   - Capture screenshot

### Opção 2: Ferramentas Online

- **BrowserStack Screenshots**: https://www.browserstack.com/screenshots
- **Responsively App**: https://responsively.app/
- **Sizzy**: https://sizzy.co/

### Opção 3: Script Automatizado (Puppeteer/Playwright)

```javascript
// Exemplo com Puppeteer
const screenshot = await page.screenshot({
  path: 'robertabento-desktop.png',
  fullPage: false,
  clip: { x: 0, y: 0, width: 1920, height: 1080 }
});

const mobileScreenshot = await page.screenshot({
  path: 'robertabento-mobile.png',
  fullPage: false,
  clip: { x: 0, y: 0, width: 1080, height: 1920 }
});
```

---

## Otimização das Imagens

### Antes de Usar nos Mockups

1. **Comprimir**: Use ferramentas como:
   - TinyPNG: https://tinypng.com/
   - Squoosh: https://squoosh.app/
   - ImageOptim (Mac)

2. **Converter para WebP** (opcional, mas recomendado):
   ```bash
   # Com cwebp (Google WebP)
   cwebp -q 90 robertabento-desktop.png -o robertabento-desktop.webp
   ```

3. **Verificar tamanho**: 
   - Desktop: < 500KB (ideal: < 300KB)
   - Mobile: < 300KB (ideal: < 200KB)

---

## Estrutura de Arquivos Recomendada

```
public/
  Images/
    mockups-robertabento/
      desktop/
        hero-1920x1080.png (ou .webp)
        hero-2560x1440.png (ou .webp)
        fullpage-1920x2160.png (ou .webp)
      mobile/
        hero-1080x1920.png (ou .webp)
        hero-1284x2778.png (ou .webp) [iPhone 14 Pro Max]
        fullpage-1080x3840.png (ou .webp) [scroll completo]
```

---

## Resumo Rápido

### Desktop Mockup (HeroMockup3D)
- **Mínimo**: 1920px × 1080px
- **Recomendado**: 2560px × 1440px
- **Formato**: PNG ou WebP
- **Tamanho arquivo**: < 500KB

### Mobile Mockup (Mockup3D)
- **Mínimo**: 1080px × 1920px
- **Recomendado**: 1284px × 2778px (iPhone 14 Pro Max @3x)
- **Formato**: PNG ou WebP
- **Tamanho arquivo**: < 300KB

---

## Notas Importantes

1. **Aspect Ratio**: Mantenha sempre o aspect ratio correto para evitar distorção
2. **Qualidade**: Use alta qualidade (90%+) para evitar pixelização no mockup 3D
3. **Background**: Se possível, capture com background transparente ou branco puro
4. **Scroll**: Para mockups completos, considere capturar múltiplas seções e fazer composição
5. **Atualização**: Atualize os screenshots sempre que houver mudanças significativas no site
