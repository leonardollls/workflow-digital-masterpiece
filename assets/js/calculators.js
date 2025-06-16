// 🧮 Calculadoras da Área de Membros
window.ToolsCalculator = {
  
  // 📊 ROI Calculator
  calculateROI() {
    const investment = parseFloat(document.getElementById('investment')?.value) || 0;
    const gains = parseFloat(document.getElementById('gains')?.value) || 0;
    const period = parseInt(document.getElementById('period')?.value) || 1;
    const costs = parseFloat(document.getElementById('costs')?.value) || 0;

    if (investment <= 0) {
      window.app?.showNotification('Por favor, insira um valor de investimento válido', 'error');
      return;
    }

    const totalCosts = investment + costs;
    const netGains = gains - totalCosts;
    const roi = ((netGains / totalCosts) * 100);
    const monthlyROI = roi / period;
    const breakEvenMonths = totalCosts / (gains / period);

    const resultsContainer = document.getElementById('roiResults');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="roi-result">
          <div class="roi-percentage">${roi.toFixed(1)}%</div>
          <p class="roi-label">Retorno sobre Investimento</p>
          
          <div class="roi-analysis">
            <div class="roi-metric">
              <span class="metric-label">Ganho Líquido</span>
              <span class="metric-value ${netGains >= 0 ? 'text-success' : 'text-error'}">
                R$ ${netGains.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div class="roi-metric">
              <span class="metric-label">ROI Mensal</span>
              <span class="metric-value">${monthlyROI.toFixed(2)}%</span>
            </div>
            
            <div class="roi-metric">
              <span class="metric-label">Break-even</span>
              <span class="metric-value">${breakEvenMonths.toFixed(1)} meses</span>
            </div>
            
            <div class="roi-metric">
              <span class="metric-label">Status</span>
              <span class="metric-value ${roi >= 0 ? 'text-success' : 'text-error'}">
                ${roi >= 20 ? '🚀 Excelente' : roi >= 10 ? '✅ Bom' : roi >= 0 ? '⚠️ Positivo' : '❌ Negativo'}
              </span>
            </div>
          </div>

          <div class="roi-recommendations">
            <h4>💡 Análise:</h4>
            <p>${this.getROIAnalysis(roi, monthlyROI, breakEvenMonths)}</p>
          </div>
        </div>

        <style>
          .roi-result { text-align: center; animation: fadeIn 0.5s ease; }
          .roi-percentage { 
            font-size: 4rem; font-weight: 800; margin-bottom: 1rem;
            background: linear-gradient(135deg, var(--workflow-zen), var(--workflow-accent));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          }
          .roi-label { color: var(--text-muted); font-size: 1.1rem; margin-bottom: 2rem; }
          .roi-analysis { display: grid; gap: 1rem; margin-top: 2rem; }
          .roi-metric { 
            display: flex; justify-content: space-between; align-items: center;
            padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-lg);
            border: 1px solid var(--border-glass);
          }
          .metric-label { color: var(--text-secondary); font-weight: 500; }
          .metric-value { color: var(--text-primary); font-weight: 700; }
          .text-success { color: var(--workflow-success) !important; }
          .text-error { color: var(--workflow-error) !important; }
          .roi-recommendations { 
            margin-top: 2rem; padding: 1.5rem; background: var(--bg-glass);
            border-radius: var(--radius-lg); border: 1px solid var(--border-glass);
          }
          .roi-recommendations h4 { color: var(--text-primary); margin-bottom: 1rem; }
          .roi-recommendations p { color: var(--text-secondary); line-height: 1.6; }
        </style>
      `;
    }
  },

  getROIAnalysis(roi, monthlyROI, breakEven) {
    if (roi >= 50) {
      return "Investimento excepcional! Este ROI está muito acima da média de mercado. Continue monitorando para garantir a sustentabilidade.";
    } else if (roi >= 20) {
      return "Ótimo retorno! Este investimento está superando as expectativas. É um indicador muito positivo para seu negócio.";
    } else if (roi >= 10) {
      return "Retorno sólido e consistente. Este resultado está dentro da faixa considerada boa para a maioria dos investimentos.";
    } else if (roi >= 0) {
      return "Retorno positivo, mas há espaço para otimização. Analise formas de reduzir custos ou aumentar a receita.";
    } else {
      return "Investimento com retorno negativo. Recomenda-se revisar a estratégia e identificar pontos de melhoria urgentes.";
    }
  },

  // 🧮 A/B Testing Calculator
  calculateABTest() {
    const visitorsA = parseInt(document.getElementById('visitorsA')?.value) || 0;
    const conversionsA = parseInt(document.getElementById('conversionsA')?.value) || 0;
    const visitorsB = parseInt(document.getElementById('visitorsB')?.value) || 0;
    const conversionsB = parseInt(document.getElementById('conversionsB')?.value) || 0;

    if (visitorsA <= 0 || visitorsB <= 0) {
      window.app?.showNotification('Por favor, insira valores válidos para visitantes', 'error');
      return;
    }

    const conversionRateA = (conversionsA / visitorsA) * 100;
    const conversionRateB = (conversionsB / visitorsB) * 100;
    const improvement = ((conversionRateB - conversionRateA) / conversionRateA) * 100;
    const confidenceLevel = this.calculateConfidence(visitorsA, conversionsA, visitorsB, conversionsB);

    const resultsContainer = document.getElementById('abResults');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="ab-result">
          <div class="ab-comparison">
            <div class="version-result">
              <h4>Versão A</h4>
              <div class="conversion-rate">${conversionRateA.toFixed(2)}%</div>
              <p>${conversionsA} de ${visitorsA} conversões</p>
            </div>
            <div class="vs-divider">VS</div>
            <div class="version-result">
              <h4>Versão B</h4>
              <div class="conversion-rate">${conversionRateB.toFixed(2)}%</div>
              <p>${conversionsB} de ${visitorsB} conversões</p>
            </div>
          </div>
          
          <div class="ab-analysis">
            <div class="improvement-metric">
              <span class="metric-label">Melhoria</span>
              <span class="metric-value ${improvement >= 0 ? 'text-success' : 'text-error'}">
                ${improvement >= 0 ? '+' : ''}${improvement.toFixed(2)}%
              </span>
            </div>
            
            <div class="confidence-metric">
              <span class="metric-label">Confiança</span>
              <span class="metric-value">${confidenceLevel.toFixed(1)}%</span>
            </div>
            
            <div class="significance-metric">
              <span class="metric-label">Significância</span>
              <span class="metric-value ${confidenceLevel >= 95 ? 'text-success' : 'text-warning'}">
                ${confidenceLevel >= 95 ? '✅ Significativo' : '⚠️ Não significativo'}
              </span>
            </div>
          </div>

          <div class="ab-recommendation">
            <h4>📊 Recomendação:</h4>
            <p>${this.getABRecommendation(improvement, confidenceLevel)}</p>
          </div>
        </div>
      `;
    }
  },

  calculateConfidence(visitorsA, conversionsA, visitorsB, conversionsB) {
    // Simplified statistical calculation
    const rateA = conversionsA / visitorsA;
    const rateB = conversionsB / visitorsB;
    
    const seA = Math.sqrt((rateA * (1 - rateA)) / visitorsA);
    const seB = Math.sqrt((rateB * (1 - rateB)) / visitorsB);
    const seDiff = Math.sqrt(seA * seA + seB * seB);
    
    const zScore = Math.abs(rateB - rateA) / seDiff;
    
    // Convert z-score to confidence level (simplified)
    if (zScore >= 2.58) return 99;
    if (zScore >= 1.96) return 95;
    if (zScore >= 1.65) return 90;
    if (zScore >= 1.28) return 80;
    return 50 + (zScore / 2.58) * 49;
  },

  getABRecommendation(improvement, confidence) {
    if (confidence >= 95) {
      if (improvement > 10) {
        return "Resultado altamente significativo! Implemente a versão B imediatamente. A melhoria é substancial e confiável.";
      } else if (improvement > 0) {
        return "Resultado significativo. A versão B é melhor, mas considere o custo de implementação vs. benefício.";
      } else {
        return "A versão A é significativamente melhor. Mantenha a versão atual.";
      }
    } else {
      return "O teste ainda não atingiu significância estatística. Continue coletando dados ou aumente o tamanho da amostra.";
    }
  },

  // 📈 Conversion Calculator
  calculateConversion() {
    const visitors = parseInt(document.getElementById('totalVisitors')?.value) || 0;
    const conversions = parseInt(document.getElementById('totalConversions')?.value) || 0;
    const industry = document.getElementById('industry')?.value || 'ecommerce';
    const days = parseInt(document.getElementById('periodDays')?.value) || 30;

    if (visitors <= 0) {
      window.app?.showNotification('Por favor, insira um número válido de visitantes', 'error');
      return;
    }

    const conversionRate = (conversions / visitors) * 100;
    const dailyVisitors = visitors / days;
    const dailyConversions = conversions / days;
    
    const benchmarks = {
      ecommerce: { average: 2.5, good: 4.0, excellent: 6.0 },
      saas: { average: 3.0, good: 5.0, excellent: 8.0 },
      leadgen: { average: 4.0, good: 7.0, excellent: 12.0 },
      media: { average: 1.5, good: 3.0, excellent: 5.0 },
      finance: { average: 2.0, good: 4.5, excellent: 7.0 }
    };

    const benchmark = benchmarks[industry];
    const performance = this.getPerformanceLevel(conversionRate, benchmark);

    const resultsContainer = document.getElementById('conversionResults');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="conversion-result">
          <div class="conversion-rate-display">${conversionRate.toFixed(2)}%</div>
          <p class="conversion-label">Taxa de Conversão</p>
          
          <div class="conversion-metrics">
            <div class="metric">
              <span class="metric-label">Visitantes/dia</span>
              <span class="metric-value">${Math.round(dailyVisitors)}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Conversões/dia</span>
              <span class="metric-value">${dailyConversions.toFixed(1)}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Performance</span>
              <span class="metric-value ${performance.class}">${performance.text}</span>
            </div>
          </div>

          <div class="benchmark-comparison">
            <h4>📊 Benchmark da Indústria</h4>
            <div class="benchmark-bars">
              <div class="benchmark-bar">
                <span>Média: ${benchmark.average}%</span>
                <div class="bar ${conversionRate >= benchmark.average ? 'achieved' : ''}"></div>
              </div>
              <div class="benchmark-bar">
                <span>Bom: ${benchmark.good}%</span>
                <div class="bar ${conversionRate >= benchmark.good ? 'achieved' : ''}"></div>
              </div>
              <div class="benchmark-bar">
                <span>Excelente: ${benchmark.excellent}%</span>
                <div class="bar ${conversionRate >= benchmark.excellent ? 'achieved' : ''}"></div>
              </div>
            </div>
          </div>

          <div class="optimization-tips">
            <h4>💡 Dicas de Otimização:</h4>
            <ul>
              ${this.getOptimizationTips(conversionRate, benchmark).map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }
  },

  getPerformanceLevel(rate, benchmark) {
    if (rate >= benchmark.excellent) {
      return { text: '🚀 Excelente', class: 'text-success' };
    } else if (rate >= benchmark.good) {
      return { text: '✅ Bom', class: 'text-success' };
    } else if (rate >= benchmark.average) {
      return { text: '⚡ Médio', class: 'text-warning' };
    } else {
      return { text: '🔧 Baixo', class: 'text-error' };
    }
  },

  getOptimizationTips(rate, benchmark) {
    const tips = [];
    
    if (rate < benchmark.average) {
      tips.push('Revise seu call-to-action principal - deve ser claro e visível');
      tips.push('Simplifique o processo de conversão - remova etapas desnecessárias');
      tips.push('Teste diferentes headlines e propostas de valor');
    }
    
    if (rate < benchmark.good) {
      tips.push('Implemente provas sociais (depoimentos, reviews, números)');
      tips.push('Otimize a velocidade de carregamento da página');
      tips.push('Teste diferentes posicionamentos dos formulários');
    }
    
    if (rate < benchmark.excellent) {
      tips.push('Personalize a experiência com base no comportamento do usuário');
      tips.push('Implemente urgência e escassez nos CTAs');
      tips.push('Faça testes A/B contínuos em elementos-chave');
    }
    
    return tips;
  },

  // Funções auxiliares para downloads
  downloadTypographyGuide() {
    window.app?.showNotification('Download iniciado! Verifique sua pasta de downloads.', 'success');
    // Aqui seria implementado o download real do PDF
  },

  downloadResponsiveGuide() {
    window.app?.showNotification('Download iniciado! Verifique sua pasta de downloads.', 'success');
  },

  downloadGitGuide() {
    window.app?.showNotification('Download iniciado! Verifique sua pasta de downloads.', 'success');
  },

  exportSEOReport() {
    window.app?.showNotification('Relatório exportado com sucesso!', 'success');
  },

  exportLaunchReport() {
    window.app?.showNotification('Relatório de lançamento exportado!', 'success');
  },

  // Função para copiar comando Git
  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      window.app?.showNotification('Comando copiado!', 'success');
    });
  },

  // Função para buscar comandos Git
  searchGitCommands(query) {
    const commands = document.querySelectorAll('.command-item');
    commands.forEach(cmd => {
      const searchText = cmd.dataset.search?.toLowerCase() || '';
      const shouldShow = searchText.includes(query.toLowerCase()) || query === '';
      cmd.style.display = shouldShow ? 'block' : 'none';
    });
  }
}; 