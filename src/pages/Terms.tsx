const Terms = () => {
  return (
    <div className="min-h-screen bg-workflow-glow">
      <div className="container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-display font-bold text-workflow-deep mb-6">
            Termos de <span className="text-gradient bg-gradient-to-r from-workflow-zen to-blue-500 bg-clip-text text-transparent">Uso</span>
          </h1>
          <p className="text-lg text-workflow-deep/70 max-w-3xl mx-auto">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl">
            <div className="prose prose-lg max-w-none">
              
              <h2 className="text-2xl font-bold text-workflow-deep mb-4">1. Aceitação dos Termos</h2>
              <p className="text-workflow-deep/80 mb-8">
                Ao acessar e usar este website, você aceita e concorda em ficar vinculado aos 
                termos e condições de uso aqui estabelecidos. Se você não concordar com estes termos, 
                não deverá usar este site.
              </p>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">2. Uso do Website</h2>
              <p className="text-workflow-deep/80 mb-6">
                Este website é fornecido apenas para fins informativos sobre nossos serviços de 
                criação de landing pages. Você concorda em usar o site apenas para fins legais e de acordo com estes termos.
              </p>
              <ul className="list-disc pl-6 text-workflow-deep/80 mb-8">
                <li>Não usar o site para atividades ilegais ou não autorizadas</li>
                <li>Não tentar obter acesso não autorizado ao site ou sistemas relacionados</li>
                <li>Não interferir com a operação do site</li>
                <li>Respeitar os direitos de propriedade intelectual</li>
              </ul>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">3. Serviços Oferecidos</h2>
              <p className="text-workflow-deep/80 mb-8">
                A Workflow Digital Masterpiece oferece serviços de criação de landing pages 
                personalizadas. Os detalhes específicos, prazos e valores são definidos em 
                propostas comerciais individuais.
              </p>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">4. Propriedade Intelectual</h2>
              <p className="text-workflow-deep/80 mb-8">
                Todo o conteúdo deste website, incluindo textos, gráficos, logos, ícones, 
                imagens e software, é propriedade da Workflow Digital Masterpiece e está 
                protegido por leis de direitos autorais e outras leis de propriedade intelectual.
              </p>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">5. Limitação de Responsabilidade</h2>
              <p className="text-workflow-deep/80 mb-8">
                A Workflow Digital Masterpiece não será responsável por quaisquer danos diretos, 
                indiretos, incidentais, especiais ou consequenciais resultantes do uso ou 
                incapacidade de uso deste website.
              </p>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">6. Modificações</h2>
              <p className="text-workflow-deep/80 mb-8">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                As modificações entrarão em vigor imediatamente após sua publicação no site.
              </p>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">7. Política de Privacidade</h2>
              <p className="text-workflow-deep/80 mb-8">
                Sua privacidade é importante para nós. Consulte nossa Política de Privacidade 
                para informações sobre como coletamos, usamos e protegemos suas informações.
              </p>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">8. Lei Aplicável</h2>
              <p className="text-workflow-deep/80 mb-8">
                Estes termos são regidos pelas leis do Brasil. Qualquer disputa será 
                resolvida nos tribunais competentes do Brasil.
              </p>

              <h2 className="text-2xl font-bold text-workflow-deep mb-4">9. Vigência</h2>
              <p className="text-workflow-deep/80 mb-8">
                Estes termos permanecem em vigor enquanto você usar nosso website. 
                Podemos encerrar ou suspender seu acesso a qualquer momento, sem aviso prévio, 
                por qualquer motivo, incluindo violação destes termos.
              </p>
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

export default Terms; 