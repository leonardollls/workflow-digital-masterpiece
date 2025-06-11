const Privacy = () => {
  return (
    <div className="min-h-screen bg-workflow-glow">
      <div className="container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-display font-bold text-workflow-deep mb-6">
            Política de <span className="text-gradient bg-gradient-to-r from-workflow-zen to-blue-500 bg-clip-text text-transparent">Privacidade</span>
          </h1>
          <p className="text-lg text-workflow-deep/70 max-w-3xl mx-auto">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl">
            <div className="prose prose-lg max-w-none">
              
              <h2 className="text-2xl font-bold text-workflow-deep mb-4">1. Informações que Coletamos</h2>
              <p className="text-workflow-deep/80 mb-6">
                Coletamos informações que você nos fornece diretamente quando:
              </p>
              <ul className="list-disc pl-6 text-workflow-deep/80 mb-8">
                <li>Entra em contato conosco através de formulários</li>
                <li>Solicita orçamentos ou informações sobre nossos serviços</li>
                <li>Se inscreve em nossa newsletter</li>
                <li>Interage com nosso site</li>
              </ul>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">2. Como Usamos suas Informações</h2>
              <p className="text-workflow-deep/80 mb-6">
                Utilizamos as informações coletadas para:
              </p>
              <ul className="list-disc pl-6 text-workflow-deep/80 mb-8">
                <li>Responder às suas solicitações e fornecer suporte</li>
                <li>Enviar informações sobre nossos serviços</li>
                <li>Melhorar nosso website e serviços</li>
                <li>Cumprir obrigações legais</li>
              </ul>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">3. Compartilhamento de Informações</h2>
              <p className="text-workflow-deep/80 mb-8">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
                exceto quando necessário para prestação de serviços ou cumprimento de obrigações legais.
              </p>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">4. Segurança dos Dados</h2>
              <p className="text-workflow-deep/80 mb-8">
                Implementamos medidas de segurança técnicas e organizacionais para proteger 
                suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">5. Seus Direitos</h2>
              <p className="text-workflow-deep/80 mb-6">
                De acordo com a LGPD, você tem o direito de:
              </p>
              <ul className="list-disc pl-6 text-workflow-deep/80 mb-8">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados incompletos ou incorretos</li>
                <li>Solicitar a exclusão de dados desnecessários</li>
                <li>Revogar o consentimento</li>
              </ul>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">6. Cookies</h2>
              <p className="text-workflow-deep/80 mb-8">
                Nosso site utiliza cookies para melhorar sua experiência de navegação e 
                analisar o tráfego do site. Você pode configurar seu navegador para recusar cookies.
              </p>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">7. Contato</h2>
              <p className="text-workflow-deep/80 mb-4">
                Para questões sobre esta política de privacidade ou exercer seus direitos, entre em contato:
              </p>
              <div className="bg-workflow-zen/10 rounded-2xl p-6">
                <p className="text-workflow-deep font-semibold">Email: privacy@workflowdigital.com</p>
                <p className="text-workflow-deep/70">Respondemos em até 48 horas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-workflow-zen to-workflow-accent rounded-full text-white font-semibold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
          >
            <span>←</span>
            <span>Voltar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 