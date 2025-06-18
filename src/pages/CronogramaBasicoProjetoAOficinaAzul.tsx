import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Target, 
  Clock, 
  CheckCircle, 
  Palette, 
  Code, 
  Settings, 
  TestTube, 
  Upload, 
  Gift,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

const CronogramaBasicoProjetoAOficinaAzul = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const phases = [
    {
      title: "DESCOBERTA & ESTRATÉGIA",
      icon: Target,
      color: "bg-gradient-to-r from-purple-100 to-purple-200",
      borderColor: "border-purple-300",
      textColor: "text-purple-700",
      tasks: [
        "✅ Análise competitiva aprofundada",
        "✅ Mapeamento da jornada da mãe atípica", 
        "✅ Definição da arquitetura de conversão",
        "✅ Wireframe estrutural",
        "🎨 Criação do moodboard visual",
        "📱 Prototipagem mobile-first",
        "💙 Desenvolvimento da paleta TEA personalizada",
        "📄 Copywriting estratégico iniciado"
      ]
    },
    {
      title: "DESIGN & IDENTIDADE VISUAL",
      icon: Palette,
      color: "bg-gradient-to-r from-blue-100 to-blue-200",
      borderColor: "border-blue-300", 
      textColor: "text-blue-700",
      tasks: [
        "🖌️ Design do header impactante",
        "💙 Sistema de cores azul suave aplicado",
        "✨ Criação dos elementos visuais acolhedores",
        "📐 Layout responsivo estruturado",
        "🖼️ Design das seções principais",
        "👩‍👧‍👦 Área de depoimentos maternos",
        "🎠 Layout do carrossel de atividades",
        "💰 Design da oferta irresistível"
      ]
    },
    {
      title: "DESENVOLVIMENTO FRONTEND",
      icon: Code,
      color: "bg-gradient-to-r from-indigo-100 to-indigo-200",
      borderColor: "border-indigo-300",
      textColor: "text-indigo-700",
      tasks: [
        "💻 Setup do ambiente de desenvolvimento",
        "🏗️ Estrutura HTML/CSS responsiva",
        "📱 Otimização mobile prioritária",
        "🎭 Implementação das animações delicadas",
        "🎠 Desenvolvimento do carrossel suave",
        "✨ Efeitos hover e glow nos botões",
        "🖼️ Galeria interativa de atividades",
        "📊 Primeira versão funcional"
      ]
    },
    {
      title: "INTEGRAÇÃO & FUNCIONALIDADES",
      icon: Settings,
      color: "bg-gradient-to-r from-purple-100 to-purple-200",
      borderColor: "border-purple-300",
      textColor: "text-purple-700",
      tasks: [
        "💳 Integração com Ticto (checkout)",
        "🔗 Todas as demais integrações necessárias",
        "⚡ Otimização de performance",
        "🛡️ Implementação de segurança",
        "🧪 Testes de funcionalidade",
        "🔌 Integração com ferramentas externas"
      ]
    },
    {
      title: "CONTEÚDO & COPYWRITING",
      icon: Sparkles,
      color: "bg-gradient-to-r from-blue-100 to-blue-200",
      borderColor: "border-blue-300",
      textColor: "text-blue-700",
      tasks: [
        "📝 Copywriting emocional finalizado",
        "💬 Criação dos depoimentos estratégicos",
        "❓ FAQ focado em dúvidas maternas",
        "🎯 CTAs de alta conversão implementados",
        "📸 Otimização de imagens e assets",
        "🔍 SEO on-page completo",
        "📱 Ajustes de UX mobile",
        "👀 Revisão visual detalhada"
      ]
    },
    {
      title: "TESTES & OTIMIZAÇÃO",
      icon: TestTube,
      color: "bg-gradient-to-r from-indigo-100 to-indigo-200",
      borderColor: "border-indigo-300",
      textColor: "text-indigo-700",
      tasks: [
        "🔧 Testes em múltiplos dispositivos",
        "⚡ Otimização de velocidade (< 3s)",
        "🎯 Testes de conversão A/B",
        "🐛 Correções de bugs encontrados",
        "📊 Implementação de heatmaps",
        "🔍 Validação de compatibilidade"
      ]
    },
    {
      title: "DEPLOY & CONFIGURAÇÃO",
      icon: Upload,
      color: "bg-gradient-to-r from-purple-100 to-purple-200",
      borderColor: "border-purple-300",
      textColor: "text-purple-700",
      tasks: [
        "🌐 Configuração do domínio aoficinazul.com.br",
        "☁️ Deploy em servidor otimizado",
        "🔒 SSL e certificados de segurança",
        "🔍 Testes pós-deploy completos",
        "📱 Validação mobile em produção",
        "📋 Documentação de acesso entregue"
      ]
    },
    {
      title: "ENTREGA",
      icon: Gift,
      color: "bg-gradient-to-r from-blue-100 to-blue-200",
      borderColor: "border-blue-300",
      textColor: "text-blue-700",
      tasks: [
        "✅ Revisão final com cliente",
        "🎯 Guia de gestão básico",
        "🔄 Ajustes finais solicitados",
        "📈 Estratégias de otimização contínua"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
              <div className="relative overflow-hidden bg-gradient-to-r from-purple-100 via-blue-50 to-indigo-50 border-b border-purple-200">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMGY5ZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                <span className="mr-3 text-purple-600">📅</span>Cronograma Personalizado
              </h1>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-700 mb-2">A Oficina Azul</h2>
              <p className="text-lg text-blue-600">Landing Page de Alta Conversão | 5-8 Dias</p>
              <p className="text-sm text-purple-600 mt-2">Desenvolvido por <strong>Leonardo Lopes</strong></p>
            </div>

            {/* Project Overview Card */}
                         <Card className="max-w-2xl mx-auto border-purple-200 shadow-lg">
               <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                 <CardTitle className="flex items-center gap-2 text-purple-700">
                   <Target className="w-5 h-5" />
                   📋 Visão Geral do Projeto
                 </CardTitle>
               </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-600">Cliente:</p>
                    <p className="font-semibold text-blue-700">Daniel Almeida - A Oficina Azul</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Objetivo:</p>
                    <p className="font-semibold text-green-700">Portal de atividades para crianças com TEA</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prazo:</p>
                    <p className="font-semibold text-yellow-700">5-8 dias úteis</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Início:</p>
                    <p className="font-semibold text-red-700">Imediato após aprovação</p>
                  </div>
                </div>
                                 <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                   <p className="text-sm text-gray-600">Entrega:</p>
                   <p className="font-semibold text-purple-700">Landing page completa + otimização</p>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Section Title */}
                 <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-purple-700 mb-4">
             🚀 CRONOGRAMA DETALHADO
           </h2>
           <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
         </div>

        {/* Timeline */}
        <div className="space-y-8">
          {phases.map((phase, index) => {
            const IconComponent = phase.icon;
            return (
              <Card 
                key={index}
                className={`${phase.borderColor} border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  isVisible ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                                 <CardHeader className={`${phase.color} rounded-t-lg`}>
                   <CardTitle className={`flex items-center gap-3 ${phase.textColor}`}>
                     <div className={`p-2 bg-white rounded-full shadow-md`}>
                       <IconComponent className="w-6 h-6" />
                     </div>
                     <span className="text-xl font-bold">{phase.title}</span>
                   </CardTitle>
                 </CardHeader>
                
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {phase.tasks.map((task, taskIndex) => (
                      <div 
                        key={taskIndex}
                        className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <span className="text-lg leading-none">{task.split(' ')[0]}</span>
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {task.substring(task.indexOf(' ') + 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Final Message */}
                 <div className="mt-16 text-center">
           <Card className="max-w-2xl mx-auto border-2 border-purple-300 shadow-2xl bg-gradient-to-r from-purple-50 to-blue-50">
             <CardContent className="p-8">
               <div className="text-6xl mb-4">🎉</div>
               <h3 className="text-2xl font-bold text-purple-700 mb-4">
                 PROJETO FINALIZADO
               </h3>
               <p className="text-gray-600 mb-6">
                 Sua landing page estará pronta para converter visitantes em clientes fiéis!
               </p>
               <div className="flex flex-wrap justify-center gap-4">
                 <Badge className="bg-purple-100 text-purple-700 px-4 py-2">
                   ⚡ Performance Otimizada
                 </Badge>
                 <Badge className="bg-blue-100 text-blue-700 px-4 py-2">
                   📱 Mobile-First
                 </Badge>
                 <Badge className="bg-indigo-100 text-indigo-700 px-4 py-2">
                   💙 Design Acolhedor
                 </Badge>
                 <Badge className="bg-purple-100 text-purple-700 px-4 py-2">
                   🎯 Alta Conversão
                 </Badge>
               </div>
             </CardContent>
           </Card>
         </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
                     <Button 
             onClick={() => window.history.back()}
             className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
           >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CronogramaBasicoProjetoAOficinaAzul; 