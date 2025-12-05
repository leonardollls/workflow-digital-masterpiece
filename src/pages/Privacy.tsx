import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Cookie, RefreshCw } from 'lucide-react';

const Privacy = () => {
  const handleBack = () => {
    window.history.back();
  };

  const sections = [
    {
      icon: Database,
      title: '1. Informações que Coletamos',
      content: 'Coletamos informações que você nos fornece diretamente quando:',
      items: [
        'Interage com nossos formulários de contato',
        'Solicita orçamentos ou informações sobre nossos serviços',
        'Se inscreve em nossa newsletter',
        'Interage com nosso site',
      ],
    },
    {
      icon: Eye,
      title: '2. Como Usamos suas Informações',
      content: 'Utilizamos as informações coletadas para:',
      items: [
        'Responder às suas solicitações e fornecer suporte',
        'Enviar informações sobre nossos serviços',
        'Melhorar nosso website e serviços',
        'Cumprir obrigações legais',
      ],
    },
    {
      icon: UserCheck,
      title: '3. Compartilhamento de Informações',
      content:
        'Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário para prestação de serviços ou cumprimento de obrigações legais.',
    },
    {
      icon: Lock,
      title: '4. Segurança dos Dados',
      content:
        'Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.',
    },
    {
      icon: Shield,
      title: '5. Seus Direitos (LGPD)',
      content: 'De acordo com a LGPD, você tem o direito de:',
      items: [
        'Acessar suas informações pessoais',
        'Corrigir dados incompletos ou incorretos',
        'Solicitar a exclusão de dados desnecessários',
        'Revogar o consentimento',
      ],
    },
    {
      icon: Cookie,
      title: '6. Cookies',
      content:
        'Nosso site utiliza cookies para melhorar sua experiência de navegação e analisar o tráfego do site. Você pode configurar seu navegador para recusar cookies.',
    },
    {
      icon: RefreshCw,
      title: '7. Alterações nesta Política',
      content:
        'Esta política de privacidade pode ser atualizada periodicamente. Recomendamos que você revise esta página regularmente para se manter informado sobre nossas práticas de privacidade.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="group inline-flex items-center gap-2 mb-8 sm:mb-12 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
          type="button"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Voltar</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 mb-6">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent">
              Política de Privacidade
            </span>
          </h1>
          <p className="text-white/50 text-sm sm:text-base">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Content Cards */}
        <div className="max-w-4xl mx-auto space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 via-slate-900/50 to-slate-950/50 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-500"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">{section.title}</h2>
                      <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-4">{section.content}</p>
                      {section.items && (
                        <ul className="space-y-2">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3 text-white/50 text-sm sm:text-base">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-white/40 text-sm">
            <span className="block sm:inline">Workflow Services © {new Date().getFullYear()}</span>
            <span className="hidden sm:inline"> - </span>
            <span className="block sm:inline">Todos os direitos reservados</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
