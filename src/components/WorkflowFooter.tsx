
const WorkflowFooter = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    services: [
      'Landing Pages',
      'E-commerce',
      'SaaS Platforms',
      'Web Apps',
      'Consultoria UX'
    ],
    company: [
      'Sobre Nós',
      'Nossa Metodologia', 
      'Cases de Sucesso',
      'Blog',
      'Carreira'
    ],
    resources: [
      'Guias Gratuitos',
      'Templates',
      'Calculadoras',
      'Webinars',
      'Newsletter'
    ],
    contact: [
      'Whatsapp',
      'Email',
      'LinkedIn',
      'Instagram',
      'Calendly'
    ]
  };

  return (
    <footer className="bg-workflow-shadow text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNhNDVmYzQiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-3xl font-display font-bold mb-4">
                  Work<span className="text-workflow-zen">flow</span>
                </h3>
                <p className="text-workflow-zen/80 text-lg mb-6">
                  Não criamos landing pages. Criamos máquinas de conversão que transformam visitantes em clientes e negócios em sucessos.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-2xl font-bold text-workflow-zen">150+</div>
                  <div className="text-white/70 text-sm">Projetos Entregues</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-workflow-zen">98%</div>
                  <div className="text-white/70 text-sm">Satisfação</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-workflow-zen">247%</div>
                  <div className="text-white/70 text-sm">ROI Médio</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-workflow-zen">R$ 18.7M</div>
                  <div className="text-white/70 text-sm">Revenue Gerado</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {['📧', '💬', '📱', '💼', '📸'].map((icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-workflow-zen/20 rounded-lg flex items-center justify-center hover:bg-workflow-zen/30 transition-colors"
                  >
                    <span className="text-lg">{icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="font-semibold text-workflow-zen mb-4">Serviços</h4>
                  <ul className="space-y-2">
                    {links.services.map((link, index) => (
                      <li key={index}>
                        <a href="#" className="text-white/70 hover:text-workflow-zen transition-colors text-sm">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-workflow-zen mb-4">Empresa</h4>
                  <ul className="space-y-2">
                    {links.company.map((link, index) => (
                      <li key={index}>
                        <a href="#" className="text-white/70 hover:text-workflow-zen transition-colors text-sm">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-workflow-zen mb-4">Recursos</h4>
                  <ul className="space-y-2">
                    {links.resources.map((link, index) => (
                      <li key={index}>
                        <a href="#" className="text-white/70 hover:text-workflow-zen transition-colors text-sm">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-workflow-zen mb-4">Contato</h4>
                  <ul className="space-y-2">
                    {links.contact.map((link, index) => (
                      <li key={index}>
                        <a href="#" className="text-white/70 hover:text-workflow-zen transition-colors text-sm">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-workflow-zen/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/60 text-sm">
              © {currentYear} Workflow. Todos os direitos reservados. 
              <span className="mx-2">•</span>
              Feito com 💜 para transformar negócios.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-workflow-zen transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-workflow-zen transition-colors">
                Termos
              </a>
              <a href="#" className="hover:text-workflow-zen transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>

        {/* Secret Easter Egg */}
        <div className="absolute bottom-4 right-4 opacity-20 text-xs">
          <span>👾 Konami code para surpresas</span>
        </div>
      </div>
    </footer>
  );
};

export default WorkflowFooter;
