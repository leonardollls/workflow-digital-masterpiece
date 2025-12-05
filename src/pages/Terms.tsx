import { ArrowLeft, FileText, Scale, Briefcase, Copyright, AlertTriangle, RefreshCw, Lock, Gavel, Clock } from 'lucide-react';

const Terms = () => {
  const handleBack = () => {
    window.history.back();
  };

  const sections = [
    {
      icon: FileText,
      title: '1. Aceitação dos Termos',
      content:
        'Ao acessar e usar este website, você aceita e concorda em ficar vinculado aos termos e condições de uso aqui estabelecidos. Se você não concordar com estes termos, não deverá usar este site.',
    },
    {
      icon: Scale,
      title: '2. Uso do Website',
      content:
        'Este website é fornecido apenas para fins informativos sobre nossos serviços de criação de landing pages. Você concorda em usar o site apenas para fins legais e de acordo com estes termos.',
      items: [
        'Não usar o site para atividades ilegais ou não autorizadas',
        'Não tentar obter acesso não autorizado ao site ou sistemas relacionados',
        'Não interferir com a operação do site',
        'Respeitar os direitos de propriedade intelectual',
      ],
    },
    {
      icon: Briefcase,
      title: '3. Serviços Oferecidos',
      content:
        'A Workflow Services oferece serviços de criação de landing pages personalizadas. Os detalhes específicos, prazos e valores são definidos em propostas comerciais individuais.',
    },
    {
      icon: Copyright,
      title: '4. Propriedade Intelectual',
      content:
        'Todo o conteúdo deste website, incluindo textos, gráficos, logos, ícones, imagens e software, é propriedade da Workflow Services e está protegido por leis de direitos autorais e outras leis de propriedade intelectual.',
    },
    {
      icon: AlertTriangle,
      title: '5. Limitação de Responsabilidade',
      content:
        'A Workflow Services não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de uso deste website.',
    },
    {
      icon: RefreshCw,
      title: '6. Modificações',
      content:
        'Reservamo-nos o direito de modificar estes termos a qualquer momento. As modificações entrarão em vigor imediatamente após sua publicação no site.',
    },
    {
      icon: Lock,
      title: '7. Política de Privacidade',
      content:
        'Sua privacidade é importante para nós. Consulte nossa Política de Privacidade para informações sobre como coletamos, usamos e protegemos suas informações.',
    },
    {
      icon: Gavel,
      title: '8. Lei Aplicável',
      content:
        'Estes termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida nos tribunais competentes do Brasil.',
    },
    {
      icon: Clock,
      title: '9. Vigência',
      content:
        'Estes termos permanecem em vigor enquanto você usar nosso website. Podemos encerrar ou suspender seu acesso a qualquer momento, sem aviso prévio, por qualquer motivo, incluindo violação destes termos.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
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
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 mb-6">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-violet-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-white via-violet-200 to-purple-300 bg-clip-text text-transparent">
              Termos de Uso
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
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 via-slate-900/50 to-slate-950/50 backdrop-blur-xl border border-white/10 hover:border-violet-500/30 transition-all duration-500"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">{section.title}</h2>
                      <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-4">{section.content}</p>
                      {section.items && (
                        <ul className="space-y-2">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3 text-white/50 text-sm sm:text-base">
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
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

export default Terms;
