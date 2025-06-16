// 🛠️ Ferramentas da Área de Membros
window.ToolsRenderer = {
  
  // 📊 ROI Calculator Pro
  renderROICalculator() {
    return `
      <div class="tool-container animate-fade-in">
        <div class="tool-header">
          <h1 class="tool-title">📊 ROI Calculator Pro</h1>
          <p class="tool-description">
            Calcule o retorno sobre investimento com análise completa e benchmarks
          </p>
        </div>

        <div class="tool-content">
          <div class="calculator-container">
            <div class="calculator-form glass">
              <h3 class="form-section-title">Dados do Investimento</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Investimento Inicial (R$)</label>
                  <input type="number" id="investment" class="form-input" placeholder="10000" step="0.01">
                </div>
                <div class="form-group">
                  <label class="form-label">Ganhos Totais (R$)</label>
                  <input type="number" id="gains" class="form-input" placeholder="15000" step="0.01">
                </div>
                <div class="form-group">
                  <label class="form-label">Período (meses)</label>
                  <input type="number" id="period" class="form-input" placeholder="12" min="1">
                </div>
                <div class="form-group">
                  <label class="form-label">Custos Adicionais (R$)</label>
                  <input type="number" id="costs" class="form-input" placeholder="500" step="0.01">
                </div>
              </div>
              <button class="btn btn-primary" onclick="ToolsCalculator.calculateROI()">
                Calcular ROI
              </button>
            </div>

            <div class="calculator-results glass">
              <div id="roiResults" class="results-container">
                <div class="results-placeholder">
                  <div class="placeholder-icon">📊</div>
                  <p>Preencha os dados para ver os resultados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .calculator-container { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .form-section-title { font-size: 1.25rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1.5rem; }
        .form-grid { display: grid; gap: 1.5rem; margin-bottom: 2rem; }
        .results-container { min-height: 300px; display: flex; align-items: center; justify-content: center; flex-direction: column; }
        .results-placeholder { text-align: center; color: var(--text-muted); }
        .placeholder-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
        @media (max-width: 768px) { .calculator-container { grid-template-columns: 1fr; } }
      </style>
    `;
  },

  // 🧮 A/B Testing Calculator
  renderABTestingCalculator() {
    return `
      <div class="tool-container animate-fade-in">
        <div class="tool-header">
          <h1 class="tool-title">🧮 A/B Testing Calculator</h1>
          <p class="tool-description">
            Determine significância estatística dos seus testes A/B
          </p>
        </div>

        <div class="tool-content">
          <div class="calculator-container">
            <div class="calculator-form glass">
              <h3 class="form-section-title">Dados do Teste A/B</h3>
              <div class="ab-test-groups">
                <div class="test-group">
                  <h4>Versão A (Controle)</h4>
                  <div class="form-group">
                    <label class="form-label">Visitantes</label>
                    <input type="number" id="visitorsA" class="form-input" placeholder="1000">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Conversões</label>
                    <input type="number" id="conversionsA" class="form-input" placeholder="50">
                  </div>
                </div>
                <div class="test-group">
                  <h4>Versão B (Variação)</h4>
                  <div class="form-group">
                    <label class="form-label">Visitantes</label>
                    <input type="number" id="visitorsB" class="form-input" placeholder="1000">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Conversões</label>
                    <input type="number" id="conversionsB" class="form-input" placeholder="65">
                  </div>
                </div>
              </div>
              <button class="btn btn-primary" onclick="ToolsCalculator.calculateABTest()">
                Analisar Teste A/B
              </button>
            </div>

            <div class="calculator-results glass">
              <div id="abResults" class="results-container">
                <div class="results-placeholder">
                  <div class="placeholder-icon">🧮</div>
                  <p>Configure seu teste A/B para ver a análise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .ab-test-groups { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
        .test-group h4 { color: var(--text-primary); margin-bottom: 1rem; text-align: center; }
        @media (max-width: 768px) { .ab-test-groups { grid-template-columns: 1fr; } }
      </style>
    `;
  },

  // 📈 Conversion Rate Calculator
  renderConversionCalculator() {
    return `
      <div class="tool-container animate-fade-in">
        <div class="tool-header">
          <h1 class="tool-title">📈 Conversion Rate Calculator</h1>
          <p class="tool-description">
            Analise e otimize suas taxas de conversão com benchmarks
          </p>
        </div>

        <div class="tool-content">
          <div class="calculator-container">
            <div class="calculator-form glass">
              <h3 class="form-section-title">Dados de Conversão</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Total de Visitantes</label>
                  <input type="number" id="totalVisitors" class="form-input" placeholder="10000">
                </div>
                <div class="form-group">
                  <label class="form-label">Total de Conversões</label>
                  <input type="number" id="totalConversions" class="form-input" placeholder="250">
                </div>
                <div class="form-group">
                  <label class="form-label">Indústria</label>
                  <select id="industry" class="form-select">
                    <option value="ecommerce">E-commerce</option>
                    <option value="saas">SaaS</option>
                    <option value="leadgen">Lead Generation</option>
                    <option value="media">Media/Blog</option>
                    <option value="finance">Finanças</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Período (dias)</label>
                  <input type="number" id="periodDays" class="form-input" placeholder="30" min="1">
                </div>
              </div>
              <button class="btn btn-primary" onclick="ToolsCalculator.calculateConversion()">
                Analisar Conversão
              </button>
            </div>

            <div class="calculator-results glass">
              <div id="conversionResults" class="results-container">
                <div class="results-placeholder">
                  <div class="placeholder-icon">📈</div>
                  <p>Insira os dados para ver a análise de conversão</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 🔍 SEO Audit Checklist
  renderSEOChecklist() {
    const seoItems = [
      { category: 'Técnico', items: [
        'Site carrega em menos de 3 segundos',
        'Site é responsivo para mobile',
        'HTTPS implementado corretamente',
        'XML Sitemap configurado',
        'Robots.txt otimizado',
        'Estrutura de URLs amigável',
        'Schema Markup implementado',
        'Core Web Vitals otimizados'
      ]},
      { category: 'Conteúdo', items: [
        'Títulos únicos e descritivos (H1-H6)',
        'Meta descriptions otimizadas',
        'Alt text em todas as imagens',
        'Conteúdo original e relevante',
        'Densidade de palavras-chave adequada',
        'Links internos estratégicos',
        'Breadcrumbs implementados'
      ]},
      { category: 'Off-Page', items: [
        'Perfil de backlinks saudável',
        'Presença em redes sociais',
        'Google My Business otimizado',
        'Citações locais consistentes',
        'Guest posts de qualidade'
      ]}
    ];

    return `
      <div class="tool-container animate-fade-in">
        <div class="tool-header">
          <h1 class="tool-title">🔍 SEO Audit Checklist 2024</h1>
          <p class="tool-description">
            Checklist completo com 45 pontos críticos de SEO
          </p>
        </div>

        <div class="tool-content">
          <div class="checklist-container">
            <div class="checklist-header glass">
              <div class="progress-section">
                <h3>Progresso da Auditoria</h3>
                <div class="progress">
                  <div id="seoProgress" class="progress-bar" style="width: 0%"></div>
                </div>
                <p id="seoProgressText">0% completo</p>
              </div>
              <div class="score-section">
                <div class="score-circle">
                  <span id="seoScore">0</span>
                  <small>/100</small>
                </div>
                <p>SEO Score</p>
              </div>
            </div>

            ${seoItems.map(category => `
              <div class="checklist-category glass">
                <h3 class="category-title">${category.category}</h3>
                <div class="checklist-items">
                  ${category.items.map((item, index) => `
                    <label class="checklist-item">
                      <input type="checkbox" class="seo-checkbox" data-category="${category.category}" onchange="this.updateSEOProgress && this.updateSEOProgress()">
                      <span class="checkmark"></span>
                      <span class="item-text">${item}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            `).join('')}

            <div class="checklist-actions glass">
              <button class="btn btn-secondary" onclick="ToolsCalculator.exportSEOReport()">
                📄 Exportar Relatório
              </button>
              <button class="btn btn-primary" onclick="ToolsCalculator.resetSEOChecklist()">
                🔄 Resetar Checklist
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        .checklist-container { max-width: 1000px; margin: 0 auto; }
        .checklist-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 2rem; }
        .progress-section h3 { color: var(--text-primary); margin-bottom: 1rem; }
        .score-section { text-align: center; }
        .score-circle { width: 80px; height: 80px; border-radius: 50%; background: var(--gradient-workflow); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: white; margin: 0 auto 0.5rem; }
        .checklist-category { margin-bottom: 2rem; padding: 2rem; }
        .category-title { color: var(--text-primary); font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; }
        .checklist-items { display: grid; gap: 1rem; }
        .checklist-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-lg); cursor: pointer; transition: all 0.3s ease; }
        .checklist-item:hover { background: rgba(255, 255, 255, 0.1); }
        .checkmark { width: 20px; height: 20px; border: 2px solid var(--workflow-zen); border-radius: 4px; position: relative; transition: all 0.3s ease; }
        .checklist-item input:checked + .checkmark { background: var(--workflow-energy); border-color: var(--workflow-energy); }
        .checklist-item input:checked + .checkmark::after { content: '✓'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; }
        .item-text { color: var(--text-secondary); flex: 1; }
        .checklist-item input:checked ~ .item-text { color: var(--text-primary); text-decoration: line-through; }
        @media (max-width: 768px) { .checklist-header { flex-direction: column; gap: 2rem; text-align: center; } }
      </style>
    `;
  },

  // 🚀 Pre-Launch Checklist
  renderPreLaunchChecklist() {
    return `
      <div class="tool-container animate-fade-in">
        <div class="tool-header">
          <h1 class="tool-title">🚀 Pre-Launch Checklist</h1>
          <p class="tool-description">
            20 verificações essenciais antes de qualquer lançamento
          </p>
        </div>

        <div class="tool-content">
          <div class="checklist-container">
            <div class="launch-status glass">
              <h3>Status do Lançamento</h3>
              <div class="status-indicator">
                <span class="status-icon">⏳</span>
                <span class="status-text">Preparando Lançamento</span>
              </div>
              <div class="progress">
                <div id="launchProgress" class="progress-bar" style="width: 0%"></div>
              </div>
            </div>

            <div class="checklist-category glass">
              <h3 class="category-title">Verificações Técnicas</h3>
              <div class="checklist-items">
                <label class="checklist-item">
                  <input type="checkbox" class="launch-checkbox">
                  <span class="checkmark"></span>
                  <span class="item-text">Testes de funcionalidade completos</span>
                </label>
                <label class="checklist-item">
                  <input type="checkbox" class="launch-checkbox">
                  <span class="checkmark"></span>
                  <span class="item-text">Testes de responsividade em dispositivos</span>
                </label>
                <label class="checklist-item">
                  <input type="checkbox" class="launch-checkbox">
                  <span class="checkmark"></span>
                  <span class="item-text">SSL certificado instalado</span>
                </label>
                <label class="checklist-item">
                  <input type="checkbox" class="launch-checkbox">
                  <span class="checkmark"></span>
                  <span class="item-text">Backup completo realizado</span>
                </label>
              </div>
            </div>

            <div class="checklist-category glass">
              <h3 class="category-title">Conteúdo e SEO</h3>
              <div class="checklist-items">
                <label class="checklist-item">
                  <input type="checkbox" class="launch-checkbox">
                  <span class="checkmark"></span>
                  <span class="item-text">Revisão ortográfica completa</span>
                </label>
                <label class="checklist-item">
                  <input type="checkbox" class="launch-checkbox">
                  <span class="checkmark"></span>
                  <span class="item-text">Meta tags otimizadas</span>
                </label>
                <label class="checklist-item">
                  <input type="checkbox" class="launch-checkbox">
                  <span class="checkmark"></span>
                  <span class="item-text">Google Analytics configurado</span>
                </label>
              </div>
            </div>

            <div class="launch-actions glass">
              <button class="btn btn-secondary" onclick="ToolsCalculator.exportLaunchReport()">
                📊 Relatório de Lançamento
              </button>
              <button class="btn btn-primary" id="launchButton">
                🚀 Validar Lançamento
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        .launch-status { margin-bottom: 2rem; padding: 2rem; text-align: center; }
        .status-indicator { display: flex; align-items: center; justify-content: center; gap: 1rem; margin: 1rem 0; }
        .status-icon { font-size: 2rem; }
        .status-text { font-size: 1.25rem; font-weight: 600; color: var(--text-primary); }
      </style>
    `;
  },

  // ⚡ Performance Audit Checklist
  renderPerformanceChecklist() {
    return `
      <div class="tool-container animate-fade-in">
        <div class="tool-header">
          <h1 class="tool-title">⚡ Performance Audit Checklist</h1>
          <p class="tool-description">
            15 pontos fundamentais para otimização de velocidade
          </p>
        </div>

        <div class="tool-content">
          <div class="performance-container">
            <div class="performance-score glass">
              <h3>Performance Score</h3>
              <div class="score-gauge">
                <div class="gauge-circle">
                  <span id="performanceScore">0</span>
                  <small>/100</small>
                </div>
              </div>
              <div class="performance-metrics">
                <div class="metric">
                  <span class="metric-label">LCP</span>
                  <span class="metric-value" id="lcpValue">-</span>
                </div>
                <div class="metric">
                  <span class="metric-label">FID</span>
                  <span class="metric-value" id="fidValue">-</span>
                </div>
                <div class="metric">
                  <span class="metric-label">CLS</span>
                  <span class="metric-value" id="clsValue">-</span>
                </div>
              </div>
            </div>

            <div class="checklist-category glass">
              <h3 class="category-title">Otimizações de Carregamento</h3>
              <div class="checklist-items">
                <label class="checklist-item">
                  <input type="checkbox" class="performance-checkbox">
                  <span class="checkmark"></span>
                  <span class="item-text">Imagens otimizadas (WebP/AVIF)</span>
                </label>
                <label class="checklist-item">
                  <input type="checkbox" class="performance-checkbox">
                  <span class="checkmark"></span>
                  <span class="item-text">CSS e JS minificados</span>
                </label>
                <label class="checklist-item">
                  <input type="checkbox" class="performance-checkbox">
                  <span class="checkmark"></span>
                  <span class="item-text">CDN configurado</span>
                </label>
                <label class="checklist-item">
                  <input type="checkbox" class="performance-checkbox">
                  <span class="checkmark"></span>
                  <span class="item-text">Lazy loading implementado</span>
                </label>
              </div>
            </div>

            <div class="performance-tools glass">
              <h3>🛠️ Ferramentas Recomendadas</h3>
              <div class="tools-links">
                <a href="https://pagespeed.web.dev/" target="_blank" class="tool-link btn btn-secondary">
                  PageSpeed Insights
                </a>
                <a href="https://gtmetrix.com/" target="_blank" class="tool-link btn btn-secondary">
                  GTmetrix
                </a>
                <a href="https://www.webpagetest.org/" target="_blank" class="tool-link btn btn-secondary">
                  WebPageTest
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .performance-container { max-width: 1000px; margin: 0 auto; }
        .performance-score { margin-bottom: 2rem; padding: 2rem; text-align: center; }
        .gauge-circle { width: 100px; height: 100px; border-radius: 50%; background: var(--gradient-workflow); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; color: white; margin: 1rem auto; }
        .performance-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2rem; }
        .metric { text-align: center; padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-lg); }
        .metric-label { display: block; font-weight: 600; color: var(--text-primary); }
        .metric-value { display: block; font-size: 1.25rem; color: var(--workflow-accent); margin-top: 0.5rem; }
        .tools-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        .tool-link { text-decoration: none; }
      </style>
    `;
  },

  // 🎨 Typography Mastery Guide
  renderTypographyGuide() {
    const fontPairs = [
      { primary: 'Poppins', secondary: 'Inter', style: 'Modern & Clean' },
      { primary: 'Playfair Display', secondary: 'Source Sans Pro', style: 'Elegant & Professional' },
      { primary: 'Montserrat', secondary: 'Open Sans', style: 'Versatile & Friendly' },
      { primary: 'Lora', secondary: 'Lato', style: 'Editorial & Readable' },
      { primary: 'Oswald', secondary: 'Nunito', style: 'Bold & Approachable' }
    ];

    return `
      <div class="tool-container animate-fade-in">
        <div class="tool-header">
          <h1 class="tool-title">🎨 Typography Mastery Guide</h1>
          <p class="tool-description">
            25 combinações de fontes testadas e hierarquias responsivas
          </p>
        </div>

        <div class="tool-content">
          <div class="typography-guide">
            
            <div class="section glass">
              <h2>🎯 Combinações de Fontes</h2>
              <div class="font-pairs">
                ${fontPairs.map(pair => `
                  <div class="font-pair-card">
                    <div class="font-example">
                      <h3 style="font-family: '${pair.primary}', sans-serif;">${pair.primary}</h3>
                      <p style="font-family: '${pair.secondary}', sans-serif;">
                        ${pair.secondary} - Lorem ipsum dolor sit amet
                      </p>
                    </div>
                    <div class="font-info">
                      <span class="font-style">${pair.style}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="section glass">
              <h2>📏 Escala Tipográfica</h2>
              <div class="type-scale">
                <div class="type-item">
                  <div class="type-example" style="font-size: 4rem; line-height: 1.2;">Display</div>
                  <div class="type-info">
                    <span class="type-size">4rem</span>
                    <span class="type-use">Hero titles</span>
                  </div>
                </div>
                <div class="type-item">
                  <div class="type-example" style="font-size: 3rem; line-height: 1.2;">H1</div>
                  <div class="type-info">
                    <span class="type-size">3rem</span>
                    <span class="type-use">Page titles</span>
                  </div>
                </div>
                <div class="type-item">
                  <div class="type-example" style="font-size: 2.25rem; line-height: 1.2;">H2</div>
                  <div class="type-info">
                    <span class="type-size">2.25rem</span>
                    <span class="type-use">Section headers</span>
                  </div>
                </div>
                <div class="type-item">
                  <div class="type-example" style="font-size: 1rem; line-height: 1.6;">Body</div>
                  <div class="type-info">
                    <span class="type-size">1rem</span>
                    <span class="type-use">Regular text</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="download-section glass">
              <h3>📁 Download do Guia Completo</h3>
              <p>Baixe o PDF com 25 combinações e guia de implementação</p>
              <button class="btn btn-primary" onclick="ToolsCalculator.downloadTypographyGuide()">
                📄 Baixar Guia PDF (2.3MB)
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        .font-pairs { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .font-pair-card { background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 2rem; text-align: center; }
        .font-example h3 { font-size: 2rem; margin-bottom: 1rem; color: var(--text-primary); }
        .font-example p { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1rem; }
        .font-style { background: var(--workflow-energy); color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.875rem; font-weight: 600; }
        .type-scale { display: grid; gap: 1.5rem; }
        .type-item { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; background: var(--bg-glass); border-radius: var(--radius-lg); }
        .type-example { font-weight: 700; color: var(--text-primary); }
        .type-info { text-align: right; }
        .type-size { display: block; font-weight: 600; color: var(--workflow-accent); }
        .type-use { display: block; font-size: 0.875rem; color: var(--text-muted); }
        .section { margin-bottom: 3rem; padding: 2rem; }
        .section h2 { color: var(--text-primary); font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; }
        .download-section { text-align: center; padding: 3rem; }
        .download-section h3 { color: var(--text-primary); margin-bottom: 1rem; }
        .download-section p { color: var(--text-muted); margin-bottom: 2rem; }
      </style>
    `;
  },

  // 📱 Responsive Design Bible
  renderResponsiveDesignGuide() {
    const breakpoints = [
      { name: 'Mobile', width: '320px - 768px', description: 'Smartphones' },
      { name: 'Tablet', width: '768px - 1024px', description: 'Tablets e pequenos laptops' },
      { name: 'Desktop', width: '1024px - 1440px', description: 'Desktops padrão' },
      { name: 'Large', width: '1440px+', description: 'Monitores grandes' }
    ];

    return `
      <div class="tool-container animate-fade-in">
        <div class="tool-header">
          <h1 class="tool-title">📱 Responsive Design Bible</h1>
          <p class="tool-description">
            Referência definitiva para design responsivo com breakpoints e grid systems
          </p>
        </div>

        <div class="tool-content">
          <div class="responsive-guide">
            
            <div class="section glass">
              <h2>📐 Breakpoints Essenciais</h2>
              <div class="breakpoints-grid">
                ${breakpoints.map(bp => `
                  <div class="breakpoint-card">
                    <h4>${bp.name}</h4>
                    <div class="width">${bp.width}</div>
                    <p>${bp.description}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="section glass">
              <h2>🎯 Media Queries Prontas</h2>
              <div class="code-examples">
                <div class="code-block">
                  <h4>Mobile First (Recomendado)</h4>
                  <pre><code>/* Mobile */
.container { width: 100%; }

/* Tablet */
@media (min-width: 768px) {
  .container { width: 750px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { width: 1000px; }
}</code></pre>
                </div>
              </div>
            </div>

            <div class="download-section glass">
              <h3>📚 Baixar Guia Completo</h3>
              <p>PDF com 18 páginas: media queries, grid systems e estratégias mobile-first</p>
              <button class="btn btn-primary" onclick="ToolsCalculator.downloadResponsiveGuide()">
                📄 Baixar Guia PDF (3.1MB)
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        .breakpoints-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
        .breakpoint-card { background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 1.5rem; text-align: center; }
        .breakpoint-card h4 { color: var(--text-primary); margin-bottom: 0.5rem; }
        .width { font-weight: 600; color: var(--workflow-accent); margin-bottom: 0.5rem; }
        .code-block { background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; }
        .code-block h4 { color: var(--text-primary); margin-bottom: 1rem; }
        .code-block pre { background: var(--workflow-shadow); color: var(--text-secondary); padding: 1rem; border-radius: var(--radius-md); overflow-x: auto; font-family: 'Monaco', 'Consolas', monospace; line-height: 1.5; }
      </style>
    `;
  },

  // 🔧 Git Commands Mastery
  renderGitCommandsGuide() {
    const gitCommands = [
      { category: 'Básicos', commands: [
        { cmd: 'git init', desc: 'Inicializar repositório' },
        { cmd: 'git clone <url>', desc: 'Clonar repositório' },
        { cmd: 'git status', desc: 'Ver status dos arquivos' },
        { cmd: 'git add .', desc: 'Adicionar todos os arquivos' },
        { cmd: 'git commit -m "message"', desc: 'Fazer commit' },
        { cmd: 'git push', desc: 'Enviar para repositório remoto' }
      ]},
      { category: 'Branches', commands: [
        { cmd: 'git branch', desc: 'Listar branches' },
        { cmd: 'git branch <name>', desc: 'Criar branch' },
        { cmd: 'git checkout <branch>', desc: 'Trocar de branch' },
        { cmd: 'git merge <branch>', desc: 'Fazer merge' },
        { cmd: 'git branch -d <branch>', desc: 'Deletar branch' }
      ]},
      { category: 'Emergência', commands: [
        { cmd: 'git reset --hard HEAD~1', desc: 'Desfazer último commit' },
        { cmd: 'git revert <commit>', desc: 'Reverter commit específico' },
        { cmd: 'git stash', desc: 'Salvar mudanças temporariamente' },
        { cmd: 'git stash pop', desc: 'Recuperar mudanças salvas' },
        { cmd: 'git log --oneline', desc: 'Ver histórico resumido' }
      ]}
    ];

    return `
      <div class="tool-container animate-fade-in">
        <div class="tool-header">
          <h1 class="tool-title">🔧 Git Commands Mastery</h1>
          <p class="tool-description">
            Cheat sheet com 50+ comandos Git organizados por situação
          </p>
        </div>

        <div class="tool-content">
          <div class="git-guide">
            
            <div class="search-section glass">
              <h3>🔍 Buscar Comando</h3>
              <input type="text" id="gitSearch" class="form-input" 
                     placeholder="Digite o que você quer fazer..." 
                     onkeyup="ToolsCalculator.searchGitCommands(this.value)">
            </div>

            ${gitCommands.map(category => `
              <div class="section glass git-category" data-category="${category.category}">
                <h2>${category.category}</h2>
                <div class="commands-list">
                  ${category.commands.map(cmd => `
                    <div class="command-item" data-search="${cmd.cmd} ${cmd.desc}">
                      <div class="command-code">
                        <code>${cmd.cmd}</code>
                        <button class="copy-btn" onclick="ToolsCalculator.copyToClipboard('${cmd.cmd}')">
                          📋
                        </button>
                      </div>
                      <div class="command-desc">${cmd.desc}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}

            <div class="download-section glass">
              <h3>📖 Cheat Sheet Completo</h3>
              <p>PDF com 50+ comandos categorizados e workflows para equipes</p>
              <button class="btn btn-primary" onclick="ToolsCalculator.downloadGitGuide()">
                📄 Baixar PDF (1.8MB)
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        .commands-list { display: grid; gap: 1rem; }
        .command-item { background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 1.5rem; }
        .command-code { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
        .command-code code { background: var(--workflow-shadow); color: var(--workflow-accent); padding: 0.5rem 1rem; border-radius: var(--radius-md); font-family: 'Monaco', 'Consolas', monospace; font-size: 0.875rem; }
        .copy-btn { background: none; border: none; cursor: pointer; font-size: 1rem; opacity: 0.7; transition: opacity 0.3s ease; }
        .copy-btn:hover { opacity: 1; }
        .command-desc { color: var(--text-secondary); font-size: 0.875rem; }
      </style>
    `;
  }
}; 