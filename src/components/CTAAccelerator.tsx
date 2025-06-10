
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const CTAAccelerator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '',
    complexity: 3,
    timeline: '',
    budget: '',
    name: '',
    email: '',
    company: ''
  });

  const projectTypes = [
    { id: 'landing-page', name: 'Landing Page', icon: '🎯', basePrice: 2500 },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒', basePrice: 8500 },
    { id: 'saas', name: 'SaaS Platform', icon: '💻', basePrice: 15000 },
    { id: 'corporate', name: 'Site Corporativo', icon: '🏢', basePrice: 5500 },
    { id: 'app', name: 'Web App', icon: '📱', basePrice: 12000 },
    { id: 'custom', name: 'Projeto Customizado', icon: '⚡', basePrice: 0 }
  ];

  const complexityLabels = {
    1: 'Simples',
    2: 'Básico',
    3: 'Padrão',
    4: 'Avançado',
    5: 'Enterprise'
  };

  const calculateEstimate = () => {
    const selectedProject = projectTypes.find(p => p.id === formData.projectType);
    if (!selectedProject) return 0;
    
    const basePrice = selectedProject.basePrice;
    const complexityMultiplier = 0.5 + (formData.complexity * 0.25);
    return Math.round(basePrice * complexityMultiplier);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-workflow-deep text-center mb-8">
              Qual tipo de projeto você precisa?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData({...formData, projectType: type.id})}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    formData.projectType === type.id
                      ? 'border-workflow-energy bg-workflow-energy/10 shadow-workflow'
                      : 'border-workflow-glow hover:border-workflow-zen'
                  }`}
                >
                  <div className="text-4xl mb-3">{type.icon}</div>
                  <div className="font-semibold text-workflow-deep">{type.name}</div>
                  {type.basePrice > 0 && (
                    <div className="text-sm text-workflow-deep/60 mt-2">
                      A partir de R$ {type.basePrice.toLocaleString('pt-BR')}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-workflow-deep text-center mb-8">
              Qual a complexidade do projeto?
            </h3>
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <label className="block text-workflow-deep font-medium mb-4">
                  Nível de Complexidade: <span className="text-workflow-energy font-bold">
                    {complexityLabels[formData.complexity as keyof typeof complexityLabels]}
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.complexity}
                  onChange={(e) => setFormData({...formData, complexity: parseInt(e.target.value)})}
                  className="w-full h-3 bg-workflow-glow rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-workflow-deep/60 mt-2">
                  <span>Simples</span>
                  <span>Enterprise</span>
                </div>
              </div>
              <div className="bg-workflow-glow rounded-lg p-4">
                <div className="text-center">
                  <div className="text-workflow-deep/70 text-sm mb-1">Estimativa Inicial</div>
                  <div className="text-3xl font-bold text-workflow-energy">
                    R$ {calculateEstimate().toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-workflow-deep text-center mb-8">
              Quando você precisa do projeto?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              {[
                { value: 'urgent', label: 'Urgente (1-2 semanas)', icon: '🚨' },
                { value: 'fast', label: 'Rápido (2-4 semanas)', icon: '⚡' },
                { value: 'normal', label: 'Normal (1-2 meses)', icon: '📅' },
                { value: 'flexible', label: 'Flexível (2+ meses)', icon: '🕰️' }
              ].map((timeline) => (
                <button
                  key={timeline.value}
                  onClick={() => setFormData({...formData, timeline: timeline.value})}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    formData.timeline === timeline.value
                      ? 'border-workflow-energy bg-workflow-energy/10'
                      : 'border-workflow-glow hover:border-workflow-zen'
                  }`}
                >
                  <div className="text-2xl mb-2">{timeline.icon}</div>
                  <div className="font-semibold text-workflow-deep text-sm">
                    {timeline.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-workflow-deep text-center mb-8">
              Qual seu orçamento previsto?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              {[
                { value: 'startup', label: 'R$ 2k - 10k', subtitle: 'Startup/PME' },
                { value: 'growth', label: 'R$ 10k - 25k', subtitle: 'Growth Stage' },
                { value: 'enterprise', label: 'R$ 25k - 50k', subtitle: 'Enterprise' },
                { value: 'premium', label: 'R$ 50k+', subtitle: 'Premium' }
              ].map((budget) => (
                <button
                  key={budget.value}
                  onClick={() => setFormData({...formData, budget: budget.value})}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    formData.budget === budget.value
                      ? 'border-workflow-energy bg-workflow-energy/10'
                      : 'border-workflow-glow hover:border-workflow-zen'
                  }`}
                >
                  <div className="font-bold text-workflow-deep">{budget.label}</div>
                  <div className="text-sm text-workflow-deep/60">{budget.subtitle}</div>
                </button>
              ))}
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-workflow-deep text-center mb-8">
              Vamos finalizar seu orçamento!
            </h3>
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-workflow-deep font-medium mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-workflow-glow focus:border-workflow-energy focus:outline-none"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-workflow-deep font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-workflow-glow focus:border-workflow-energy focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-workflow-deep font-medium mb-2">Empresa</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-workflow-glow focus:border-workflow-energy focus:outline-none"
                  placeholder="Nome da sua empresa"
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <section id="cta-accelerator" className="py-20 bg-workflow-deep relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-workflow-energy/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-workflow-zen/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            The <span className="text-workflow-zen">Accelerator</span>
          </h2>
          <p className="text-xl text-workflow-zen/80 mb-8">
            Gerador inteligente de orçamento em 60 segundos
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-workflow-zen/80">Progresso</span>
            <span className="text-workflow-zen font-bold">{currentStep}/5</span>
          </div>
          <div className="w-full bg-workflow-zen/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-workflow-energy to-workflow-zen h-full rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          <div className="card-workflow bg-white/95 backdrop-blur-lg min-h-[400px] flex flex-col">
            <div className="flex-1 p-8 md:p-12">
              {renderStep()}
            </div>
            
            {/* Navigation */}
            <div className="p-6 border-t border-workflow-glow flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="btn-secondary"
              >
                ← Voltar
              </Button>
              
              {currentStep < 5 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={
                    (currentStep === 1 && !formData.projectType) ||
                    (currentStep === 3 && !formData.timeline) ||
                    (currentStep === 4 && !formData.budget)
                  }
                  className="btn-primary"
                >
                  Continuar →
                </Button>
              ) : (
                <Button 
                  className="btn-primary"
                  disabled={!formData.name || !formData.email}
                >
                  🚀 Receber Orçamento
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12">
          <div className="flex justify-center items-center gap-8 text-workflow-zen/60 text-sm">
            <span>🔒 100% Seguro</span>
            <span>⚡ Resposta em 24h</span>
            <span>💰 Sem Compromisso</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAAccelerator;
