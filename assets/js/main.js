// 🚀 Workflow Digital - Área de Membros
// Sistema de Roteamento e Autenticação

class WorkflowMembersArea {
  constructor() {
    this.currentPage = 'login';
    this.user = null;
    this.isAuthenticated = false;
    this.sidebarVisible = true;
    
    this.tools = [
      {
        id: 'roi-calculator',
        title: 'ROI Calculator Pro',
        icon: '📊',
        description: 'Calcule retorno sobre investimento',
        category: 'calculator',
        color: 'from-emerald-500 to-teal-500'
      },
      {
        id: 'ab-testing-calculator',
        title: 'A/B Testing Calculator',
        icon: '🧮',
        description: 'Análise estatística de testes A/B',
        category: 'calculator',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 'conversion-calculator',
        title: 'Conversion Rate Calculator',
        icon: '📈',
        description: 'Otimize suas taxas de conversão',
        category: 'calculator',
        color: 'from-purple-500 to-pink-500'
      },
      {
        id: 'seo-checklist',
        title: 'SEO Audit Checklist 2024',
        icon: '🔍',
        description: 'Checklist completo de SEO',
        category: 'checklist',
        color: 'from-orange-500 to-red-500'
      },
      {
        id: 'prelaunch-checklist',
        title: 'Pre-Launch Checklist',
        icon: '🚀',
        description: 'Verificações antes do lançamento',
        category: 'checklist',
        color: 'from-green-500 to-emerald-500'
      },
      {
        id: 'performance-checklist',
        title: 'Performance Audit Checklist',
        icon: '⚡',
        description: 'Otimização de velocidade',
        category: 'checklist',
        color: 'from-yellow-500 to-orange-500'
      },
      {
        id: 'typography-guide',
        title: 'Typography Mastery Guide',
        icon: '🎨',
        description: 'Guia completo de tipografia',
        category: 'guide',
        color: 'from-pink-500 to-rose-500'
      },
      {
        id: 'responsive-design-guide',
        title: 'Responsive Design Bible',
        icon: '📱',
        description: 'Guia de design responsivo',
        category: 'guide',
        color: 'from-indigo-500 to-blue-500'
      },
      {
        id: 'git-commands-guide',
        title: 'Git Commands Mastery',
        icon: '🔧',
        description: 'Comandos Git organizados',
        category: 'guide',
        color: 'from-gray-600 to-gray-800'
      }
    ];

    this.init();
  }

  init() {
    this.checkAuth();
    this.setupEventListeners();
    this.render();
  }

  checkAuth() {
    const savedAuth = localStorage.getItem('workflow_members_auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      if (authData.expires > Date.now()) {
        this.isAuthenticated = true;
        this.user = authData.user;
        this.currentPage = 'dashboard';
      } else {
        localStorage.removeItem('workflow_members_auth');
      }
    }
  }

  login(email, password) {
    // Validação simples - em produção usar sistema real
    const validCredentials = [
      { email: 'cliente@workflowdigital.com', password: 'workflow2024' },
      { email: 'admin@workflowdigital.com', password: 'admin123' },
      // Adicione mais credenciais conforme necessário
    ];

    const user = validCredentials.find(
      cred => cred.email === email && cred.password === password
    );

    if (user) {
      this.isAuthenticated = true;
      this.user = { 
        email: user.email, 
        name: user.name || 'Cliente Workflow',
        avatar: '👤'
      };
      
      // Salvar autenticação (24 horas)
      const authData = {
        user: this.user,
        expires: Date.now() + (24 * 60 * 60 * 1000)
      };
      localStorage.setItem('workflow_members_auth', JSON.stringify(authData));
      
      this.currentPage = 'dashboard';
      this.render();
      return true;
    }
    
    return false;
  }

  logout() {
    this.isAuthenticated = false;
    this.user = null;
    this.currentPage = 'login';
    localStorage.removeItem('workflow_members_auth');
    this.render();
  }

  navigateTo(page) {
    if (!this.isAuthenticated && page !== 'login') {
      this.currentPage = 'login';
    } else {
      this.currentPage = page;
    }
    this.render();
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    this.updateSidebarVisibility();
  }

  updateSidebarVisibility() {
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('.main');
    
    if (sidebar && main) {
      if (this.sidebarVisible) {
        sidebar.classList.remove('sidebar-hidden');
        main.classList.remove('main-full');
      } else {
        sidebar.classList.add('sidebar-hidden');
        main.classList.add('main-full');
      }
    }
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      // Navigation
      if (e.target.matches('[data-nav]')) {
        e.preventDefault();
        this.navigateTo(e.target.getAttribute('data-nav'));
      }

      // Logout
      if (e.target.matches('[data-logout]')) {
        e.preventDefault();
        this.logout();
      }

      // Sidebar toggle
      if (e.target.matches('[data-sidebar-toggle]')) {
        e.preventDefault();
        this.toggleSidebar();
      }
    });

    // Form submission
    document.addEventListener('submit', (e) => {
      if (e.target.matches('#loginForm')) {
        e.preventDefault();
        this.handleLogin(e.target);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Implementar busca rápida
      }
    });
  }

  handleLogin(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    if (this.login(email, password)) {
      this.showNotification('Login realizado com sucesso!', 'success');
    } else {
      this.showNotification('Credenciais inválidas. Tente novamente.', 'error');
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">
          ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <span class="notification-message">${message}</span>
      </div>
    `;

    // Adicionar estilos se não existirem
    if (!document.querySelector('#notificationStyles')) {
      const style = document.createElement('style');
      style.id = 'notificationStyles';
      style.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          color: white;
          font-weight: 500;
          animation: slideInRight 0.3s ease-out;
          max-width: 400px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .notification-success {
          background: rgba(16, 185, 129, 0.9);
        }
        
        .notification-error {
          background: rgba(239, 68, 68, 0.9);
        }
        
        .notification-info {
          background: rgba(6, 182, 212, 0.9);
        }
        
        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  render() {
    const app = document.getElementById('app');
    if (!app) return;

    if (!this.isAuthenticated) {
      app.innerHTML = this.renderLogin();
    } else {
      app.innerHTML = this.renderApp();
      this.updateSidebarVisibility();
      this.initializePage();
    }
  }

  renderLogin() {
    return `
      <div class="login-container bg-mesh">
        <div class="login-card glass">
          <div class="login-header">
            <div class="login-logo">
              <div class="logo-icon">🚀</div>
              <h1 class="text-display">Workflow Digital</h1>
            </div>
            <h2 class="login-title">Área de Membros</h2>
            <p class="login-description">
              Acesse suas ferramentas exclusivas e maximize sua produtividade
            </p>
          </div>

          <form id="loginForm" class="login-form">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                class="form-input"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                class="form-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" class="btn btn-primary w-full">
              <span>Entrar na Área de Membros</span>
              <span>→</span>
            </button>
          </form>

          <div class="login-footer">
            <p>
              Ainda não tem acesso? 
              <a href="https://workflow-services.online" target="_blank" class="login-link">
                Conheça nossos serviços
              </a>
            </p>
          </div>
        </div>

        <style>
          .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }

          .login-card {
            width: 100%;
            max-width: 480px;
            padding: 3rem;
          }

          .login-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .login-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          .logo-icon {
            font-size: 2.5rem;
            filter: drop-shadow(0 0 20px rgba(124, 58, 237, 0.5));
          }

          .login-title {
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, var(--workflow-zen), var(--workflow-accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .login-description {
            color: var(--text-muted);
            font-size: 1.1rem;
          }

          .login-form {
            margin-bottom: 2rem;
          }

          .login-footer {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid var(--border-glass);
          }

          .login-link {
            color: var(--workflow-accent);
            text-decoration: none;
            font-weight: 600;
          }

          .login-link:hover {
            text-decoration: underline;
          }
        </style>
      </div>
    `;
  }

  renderApp() {
    return `
      <div class="app-container">
        ${this.renderNavigation()}
        ${this.renderSidebar()}
        ${this.renderMainContent()}
      </div>
    `;
  }

  renderNavigation() {
    return `
      <nav class="nav">
        <div class="nav-container">
          <div class="nav-brand">
            <button class="nav-toggle" data-sidebar-toggle>
              <span class="nav-toggle-icon">☰</span>
            </button>
            <a href="#" class="nav-logo">
              <span class="nav-logo-icon">🚀</span>
              Workflow Digital
            </a>
          </div>

          <div class="nav-menu">
            <div class="nav-user">
              <span class="nav-user-avatar">${this.user?.avatar || '👤'}</span>
              <span class="nav-user-name">${this.user?.name || 'Cliente'}</span>
              <button class="nav-user-menu" data-logout>
                <span>Sair</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        </div>

        <style>
          .nav-brand {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .nav-toggle {
            display: none;
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.5rem;
            transition: background-color 0.3s ease;
          }

          .nav-toggle:hover {
            background: var(--bg-glass);
          }

          .nav-logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .nav-logo-icon {
            font-size: 1.5rem;
            filter: drop-shadow(0 0 10px rgba(124, 58, 237, 0.5));
          }

          .nav-user {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .nav-user-avatar {
            font-size: 1.5rem;
          }

          .nav-user-name {
            font-weight: 600;
            color: var(--text-primary);
          }

          .nav-user-menu {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--bg-glass);
            border: 1px solid var(--border-glass);
            color: var(--text-secondary);
            padding: 0.5rem 1rem;
            border-radius: 0.75rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .nav-user-menu:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
          }

          @media (max-width: 1024px) {
            .nav-toggle {
              display: block;
            }
          }
        </style>
      </nav>
    `;
  }

  renderSidebar() {
    const categories = [
      { id: 'calculator', name: 'Calculadoras', icon: '🧮' },
      { id: 'checklist', name: 'Checklists', icon: '✅' },
      { id: 'guide', name: 'Guias', icon: '📚' }
    ];

    return `
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3 class="sidebar-title">Ferramentas</h3>
          <p class="sidebar-subtitle">9 ferramentas premium</p>
        </div>

        <ul class="sidebar-menu">
          <li class="sidebar-item">
            <a href="#" class="sidebar-link ${this.currentPage === 'dashboard' ? 'active' : ''}" data-nav="dashboard">
              <span class="sidebar-icon">🏠</span>
              <span>Dashboard</span>
            </a>
          </li>

          ${categories.map(category => `
            <li class="sidebar-category">
              <div class="sidebar-category-header">
                <span class="sidebar-icon">${category.icon}</span>
                <span class="sidebar-category-name">${category.name}</span>
              </div>
              <ul class="sidebar-submenu">
                ${this.tools
                  .filter(tool => tool.category === category.id)
                  .map(tool => `
                    <li class="sidebar-item">
                      <a href="#" class="sidebar-link ${this.currentPage === tool.id ? 'active' : ''}" data-nav="${tool.id}">
                        <span class="sidebar-icon">${tool.icon}</span>
                        <span class="sidebar-text">${tool.title}</span>
                      </a>
                    </li>
                  `).join('')}
              </ul>
            </li>
          `).join('')}
        </ul>

        <div class="sidebar-footer">
          <div class="sidebar-stats">
            <div class="stat-item">
              <span class="stat-icon">⏱️</span>
              <div class="stat-content">
                <span class="stat-number">57h</span>
                <span class="stat-label">Economia Total</span>
              </div>
            </div>
          </div>
        </div>

        <style>
          .sidebar-header {
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-glass);
          }

          .sidebar-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
          }

          .sidebar-subtitle {
            color: var(--text-muted);
            font-size: 0.875rem;
          }

          .sidebar-category {
            margin-bottom: 1.5rem;
          }

          .sidebar-category-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 0.5rem;
            font-weight: 600;
            color: var(--text-primary);
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .sidebar-submenu {
            list-style: none;
            padding-left: 1rem;
          }

          .sidebar-text {
            font-size: 0.875rem;
          }

          .sidebar-footer {
            margin-top: auto;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-glass);
          }

          .sidebar-stats {
            background: var(--bg-glass);
            border-radius: var(--radius-lg);
            padding: 1rem;
          }

          .stat-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .stat-icon {
            font-size: 1.5rem;
          }

          .stat-content {
            display: flex;
            flex-direction: column;
          }

          .stat-number {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--workflow-accent);
          }

          .stat-label {
            font-size: 0.75rem;
            color: var(--text-muted);
          }
        </style>
      </aside>
    `;
  }

  renderMainContent() {
    return `
      <main class="main">
        <div class="main-content">
          ${this.renderCurrentPage()}
        </div>
      </main>
    `;
  }

  renderCurrentPage() {
    switch (this.currentPage) {
      case 'dashboard':
        return this.renderDashboard();
      case 'roi-calculator':
        return this.renderROICalculator();
      case 'ab-testing-calculator':
        return this.renderABTestingCalculator();
      case 'conversion-calculator':
        return this.renderConversionCalculator();
      case 'seo-checklist':
        return this.renderSEOChecklist();
      case 'prelaunch-checklist':
        return this.renderPreLaunchChecklist();
      case 'performance-checklist':
        return this.renderPerformanceChecklist();
      case 'typography-guide':
        return this.renderTypographyGuide();
      case 'responsive-design-guide':
        return this.renderResponsiveDesignGuide();
      case 'git-commands-guide':
        return this.renderGitCommandsGuide();
      default:
        return this.renderDashboard();
    }
  }

  renderDashboard() {
    return `
      <div class="dashboard animate-fade-in">
        <div class="dashboard-header">
          <h1 class="tool-title">Bem-vindo à Área de Membros</h1>
          <p class="tool-description">
            Acesse suas 9 ferramentas premium e maximize sua produtividade
          </p>
        </div>

        <div class="dashboard-stats">
          <div class="stat-card glass">
            <div class="stat-icon">🚀</div>
            <div class="stat-content">
              <h3 class="stat-title">9 Ferramentas</h3>
              <p class="stat-description">Premium disponíveis</p>
            </div>
          </div>

          <div class="stat-card glass">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <h3 class="stat-title">57+ Horas</h3>
              <p class="stat-description">Economia de tempo</p>
            </div>
          </div>

          <div class="stat-card glass">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3 class="stat-title">100% Prático</h3>
              <p class="stat-description">Resultados reais</p>
            </div>
          </div>
        </div>

        <div class="dashboard-tools">
          <h2 class="section-title">Suas Ferramentas</h2>
          <div class="tools-grid">
            ${this.tools.map(tool => `
              <div class="tool-card card-tool" data-nav="${tool.id}">
                <div class="tool-card-header">
                  <div class="tool-icon">${tool.icon}</div>
                  <div class="tool-badge">${tool.category}</div>
                </div>
                <div class="tool-card-content">
                  <h3 class="tool-card-title">${tool.title}</h3>
                  <p class="tool-card-description">${tool.description}</p>
                </div>
                <div class="tool-card-footer">
                  <button class="btn btn-secondary" data-nav="${tool.id}">
                    Acessar Ferramenta →
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <style>
        .dashboard-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          cursor: default;
        }

        .stat-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 0 10px rgba(124, 58, 237, 0.3));
        }

        .stat-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .stat-description {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2rem;
          text-align: center;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .tool-card {
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tool-card:hover {
          transform: translateY(-8px);
        }

        .tool-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .tool-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 0 15px rgba(124, 58, 237, 0.4));
        }

        .tool-badge {
          background: var(--workflow-energy);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tool-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .tool-card-description {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .tool-card-footer {
          margin-top: auto;
        }

        @media (max-width: 768px) {
          .tools-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-stats {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `;
  }

  // Métodos para renderizar cada ferramenta serão adicionados aqui
  renderROICalculator() {
    return `
      <div class="tool-container animate-fade-in">
        <div class="tool-header">
          <h1 class="tool-title">📊 ROI Calculator Pro</h1>
          <p class="tool-description">
            Calcule o retorno sobre investimento de forma instantânea com gráficos visuais e comparativos
          </p>
        </div>

        <div class="tool-content">
          <div class="calculator-container">
            <div class="calculator-form">
              <div class="form-section">
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
                <button class="btn btn-primary" onclick="app.calculateROI()">
                  Calcular ROI
                </button>
              </div>
            </div>

            <div class="calculator-results">
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
        .calculator-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .calculator-form,
        .calculator-results {
          background: var(--bg-glass);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-xl);
          padding: 2rem;
        }

        .form-section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-grid {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .results-container {
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .results-placeholder {
          text-align: center;
          color: var(--text-muted);
        }

        .placeholder-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .roi-result {
          text-align: center;
          animation: fadeIn 0.5s ease;
        }

        .roi-percentage {
          font-size: 4rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--workflow-zen), var(--workflow-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .roi-analysis {
          display: grid;
          gap: 1rem;
          margin-top: 2rem;
        }

        .roi-metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--bg-glass);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-glass);
        }

        .metric-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .metric-value {
          color: var(--text-primary);
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .calculator-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      </style>
    `;
  }

  calculateROI() {
    const investment = parseFloat(document.getElementById('investment').value) || 0;
    const gains = parseFloat(document.getElementById('gains').value) || 0;
    const period = parseInt(document.getElementById('period').value) || 1;
    const costs = parseFloat(document.getElementById('costs').value) || 0;

    if (investment <= 0) {
      this.showNotification('Por favor, insira um valor de investimento válido', 'error');
      return;
    }

    const totalCosts = investment + costs;
    const netGains = gains - totalCosts;
    const roi = ((netGains / totalCosts) * 100);
    const monthlyROI = roi / period;
    const breakEvenMonths = totalCosts / (gains / period);

    const resultsContainer = document.getElementById('roiResults');
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
        .text-success { color: var(--workflow-success) !important; }
        .text-error { color: var(--workflow-error) !important; }
        
        .roi-label {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        
        .roi-recommendations {
          margin-top: 2rem;
          padding: 1.5rem;
          background: var(--bg-glass);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-glass);
        }
        
        .roi-recommendations h4 {
          color: var(--text-primary);
          margin-bottom: 1rem;
        }
        
        .roi-recommendations p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
      </style>
    `;
  }

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
  }

  initializePage() {
    // Inicializar funcionalidades específicas da página atual
    if (typeof window !== 'undefined') {
      // Adicionar event listeners específicos se necessário
      this.addPageSpecificListeners();
    }
  }

  addPageSpecificListeners() {
    // Adicionar listeners específicos para cada ferramenta
    switch (this.currentPage) {
      case 'roi-calculator':
        // Listeners específicos do ROI Calculator
        break;
      // Adicionar outros casos conforme necessário
    }
  }
}

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
  window.app = new WorkflowMembersArea();
});

// Tornar disponível globalmente para funções inline
window.app = window.app || {}; 