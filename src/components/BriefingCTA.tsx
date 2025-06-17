import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Building, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const BriefingCTA = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-workflow-deep via-purple-900 to-workflow-deep relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-workflow-zen/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-workflow-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-workflow-zen to-transparent rounded-full" />
            <span className="text-workflow-zen font-mono text-sm tracking-wider uppercase">
              Começar Projeto
            </span>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-workflow-zen to-transparent rounded-full" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
            Escolha o Tipo de{' '}
            <span className="bg-gradient-to-r from-workflow-zen via-workflow-accent to-workflow-zen bg-clip-text text-transparent">
              Projeto
            </span>
          </h2>
          
          <p className="text-xl text-workflow-zen/80 max-w-3xl mx-auto">
            Temos especializações distintas para cada necessidade. Escolha a opção que melhor se adequa ao seu projeto.
          </p>
        </div>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Landing Page Card */}
          <Card className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:border-workflow-energy/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-workflow-energy/20">
            <CardContent className="p-8 lg:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-workflow-energy to-yellow-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white mb-1">Landing Page</h3>
                  <p className="text-workflow-zen/60 text-sm">Para vendas e conversões</p>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-semibold text-white mb-4">Ideal para:</h4>
                <ul className="space-y-2 text-workflow-zen/80">
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-workflow-energy flex-shrink-0" />
                    <span>Lançamento de produtos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-workflow-energy flex-shrink-0" />
                    <span>Captura de leads qualificados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-workflow-energy flex-shrink-0" />
                    <span>Vendas diretas online</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-workflow-energy flex-shrink-0" />
                    <span>Campanhas de marketing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-workflow-energy/10 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-workflow-energy font-semibold">Prazo:</span>
                    <span className="text-white ml-2">5-10 dias</span>
                  </div>
                  <div className="text-2xl">🚀</div>
                </div>
              </div>

              <Link to="/briefing" className="block">
                <Button className="w-full bg-gradient-to-r from-workflow-energy to-yellow-500 hover:from-workflow-energy/80 hover:to-yellow-500/80 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:scale-105">
                  <span className="flex items-center justify-center gap-2">
                    Briefing Landing Page
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Site Institucional Card */}
          <Card className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:border-workflow-zen/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-workflow-zen/20">
            <CardContent className="p-8 lg:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-workflow-zen to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white mb-1">Site Institucional</h3>
                  <p className="text-workflow-zen/60 text-sm">Para presença e credibilidade</p>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-semibold text-white mb-4">Ideal para:</h4>
                <ul className="space-y-2 text-workflow-zen/80">
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-workflow-zen flex-shrink-0" />
                    <span>Presença digital empresarial</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-workflow-zen flex-shrink-0" />
                    <span>Portfólio de serviços</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-workflow-zen flex-shrink-0" />
                    <span>Credibilidade e confiança</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-workflow-zen flex-shrink-0" />
                    <span>Comunicação institucional</span>
                  </li>
                </ul>
              </div>

              <div className="bg-workflow-zen/10 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-workflow-zen font-semibold">Prazo:</span>
                    <span className="text-white ml-2">15-60 dias</span>
                  </div>
                  <div className="text-2xl">🏢</div>
                </div>
              </div>

              <Link to="/briefing-institucional" className="block">
                <Button className="w-full bg-gradient-to-r from-workflow-zen to-blue-500 hover:from-workflow-zen/80 hover:to-blue-500/80 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:scale-105">
                  <span className="flex items-center justify-center gap-2">
                    Briefing Site Institucional
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-workflow-zen/60 text-lg mb-6">
            Não tem certeza qual escolher? Fale conosco!
          </p>
          <Button 
            variant="outline" 
            className="border-workflow-zen/30 text-workflow-zen hover:bg-workflow-zen/10"
            onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
          >
            <span className="flex items-center gap-2">
              💬 Tirar Dúvidas no WhatsApp
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BriefingCTA; 