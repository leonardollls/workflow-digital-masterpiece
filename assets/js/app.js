// 🚀 Workflow Digital - Área de Membros
class WorkflowMembersArea {
  constructor() {
    this.currentPage = 'login';
    this.user = null;
    this.isAuthenticated = false;
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
    const validCredentials = [
      { email: 'cliente@workflowdigital.com', password: 'workflow2024' },
      { email: 'admin@workflowdigital.com', password: 'admin123' }
    ];

    const user = validCredentials.find(
      cred => cred.email === email && cred.password === password
    );

    if (user) {
      this.isAuthenticated = true;
      this.user = { email: user.email, name: 'Cliente Workflow', avatar: '👤' };
      
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

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-nav]')) {
        e.preventDefault();
        this.navigateTo(e.target.getAttribute('data-nav'));
      }

      if (e.target.matches('[data-logout]')) {
        e.preventDefault();
        this.logout();
      }
    });

    document.addEventListener('submit', (e) => {
      if (e.target.matches('#loginForm')) {
        e.preventDefault();
        this.handleLogin(e.target);
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
        <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <span>${message}</span>
      </div>
    `;

    if (!document.querySelector('#notificationStyles')) {
      const style = document.createElement('style');
      style.id = 'notificationStyles';
      style.textContent = `
        .notification {
          position: fixed; top: 20px; right: 20px; z-index: 10000;
          padding: 1rem 1.5rem; border-radius: 0.75rem; color: white;
          font-weight: 500; animation: slideInRight 0.3s ease-out;
          max-width: 400px; backdrop-filter: blur(20px);
        }
        .notification-success { background: rgba(16, 185, 129, 0.9); }
        .notification-error { background: rgba(239, 68, 68, 0.9); }
        .notification-content { display: flex; align-items: center; gap: 0.5rem; }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  render() {
    const app = document.getElementById('app');
    if (!app) return;

    if (!this.isAuthenticated) {
      app.innerHTML = this.renderLogin();
    } else {
      app.innerHTML = this.renderApp();
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
            <p class="login-description">Acesse suas ferramentas exclusivas</p>
          </div>

          <form id="loginForm" class="login-form">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" name="email" class="form-input" 
                     placeholder="seu@email.com" required />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Senha</label>
              <input type="password" id="password" name="password" class="form-input" 
                     placeholder="••••••••" required />
            </div>

            <button type="submit" class="btn btn-primary w-full">
              Entrar na Área de Membros →
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
          <a href="#" class="nav-logo">
            <span class="nav-logo-icon">🚀</span>
            Workflow Digital
          </a>
          <div class="nav-user">
            <span class="nav-user-name">${this.user?.name || 'Cliente'}</span>
            <button class="nav-user-menu" data-logout>Sair</button>
          </div>
        </div>
      </nav>
    `;
  }

  renderSidebar() {
    const tools = [
      { id: 'roi-calculator', title: 'ROI Calculator Pro', icon: '📊', category: 'calculator' },
      { id: 'ab-testing-calculator', title: 'A/B Testing Calculator', icon: '🧮', category: 'calculator' },
      { id: 'conversion-calculator', title: 'Conversion Calculator', icon: '📈', category: 'calculator' },
      { id: 'seo-checklist', title: 'SEO Audit Checklist', icon: '🔍', category: 'checklist' },
      { id: 'prelaunch-checklist', title: 'Pre-Launch Checklist', icon: '🚀', category: 'checklist' },
      { id: 'performance-checklist', title: 'Performance Checklist', icon: '⚡', category: 'checklist' },
      { id: 'typography-guide', title: 'Typography Guide', icon: '🎨', category: 'guide' },
      { id: 'responsive-design-guide', title: 'Responsive Design Guide', icon: '📱', category: 'guide' },
      { id: 'git-commands-guide', title: 'Git Commands Guide', icon: '🔧', category: 'guide' }
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

          ${tools.map(tool => `
            <li class="sidebar-item">
              <a href="#" class="sidebar-link ${this.currentPage === tool.id ? 'active' : ''}" data-nav="${tool.id}">
                <span class="sidebar-icon">${tool.icon}</span>
                <span class="sidebar-text">${tool.title}</span>
              </a>
            </li>
          `).join('')}
        </ul>
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
        return window.ToolsRenderer.renderROICalculator();
      case 'ab-testing-calculator':
        return window.ToolsRenderer.renderABTestingCalculator();
      case 'conversion-calculator':
        return window.ToolsRenderer.renderConversionCalculator();
      case 'seo-checklist':
        return window.ToolsRenderer.renderSEOChecklist();
      case 'prelaunch-checklist':
        return window.ToolsRenderer.renderPreLaunchChecklist();
      case 'performance-checklist':
        return window.ToolsRenderer.renderPerformanceChecklist();
      case 'typography-guide':
        return window.ToolsRenderer.renderTypographyGuide();
      case 'responsive-design-guide':
        return window.ToolsRenderer.renderResponsiveDesignGuide();
      case 'git-commands-guide':
        return window.ToolsRenderer.renderGitCommandsGuide();
      default:
        return this.renderDashboard();
    }
  }

  renderDashboard() {
    const tools = [
      { id: 'roi-calculator', title: 'ROI Calculator Pro', icon: '📊', description: 'Calcule retorno sobre investimento' },
      { id: 'ab-testing-calculator', title: 'A/B Testing Calculator', icon: '🧮', description: 'Análise estatística de testes A/B' },
      { id: 'conversion-calculator', title: 'Conversion Calculator', icon: '📈', description: 'Otimize suas taxas de conversão' },
      { id: 'seo-checklist', title: 'SEO Audit Checklist', icon: '🔍', description: 'Checklist completo de SEO' },
      { id: 'prelaunch-checklist', title: 'Pre-Launch Checklist', icon: '🚀', description: 'Verificações antes do lançamento' },
      { id: 'performance-checklist', title: 'Performance Checklist', icon: '⚡', description: 'Otimização de velocidade' },
      { id: 'typography-guide', title: 'Typography Guide', icon: '🎨', description: 'Guia completo de tipografia' },
      { id: 'responsive-design-guide', title: 'Responsive Design Guide', icon: '📱', description: 'Guia de design responsivo' },
      { id: 'git-commands-guide', title: 'Git Commands Guide', icon: '🔧', description: 'Comandos Git organizados' }
    ];

    return `
      <div class="dashboard animate-fade-in">
        <div class="dashboard-header">
          <h1 class="tool-title">Bem-vindo à Área de Membros</h1>
          <p class="tool-description">Acesse suas 9 ferramentas premium</p>
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
            ${tools.map(tool => `
              <div class="tool-card card-tool" data-nav="${tool.id}">
                <div class="tool-card-header">
                  <div class="tool-icon">${tool.icon}</div>
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
    `;
  }
}

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
  window.app = new WorkflowMembersArea();
});

window.app = window.app || {}; 