import { CheckCircle, X } from 'lucide-react';

interface ComparisonItem {
  feature: string;
  oldSite: boolean;
  newSite: boolean;
}

interface FeatureComparisonProps {
  comparisons?: ComparisonItem[];
}

const defaultComparisons: ComparisonItem[] = [
  { feature: 'Design Moderno e Premium', oldSite: false, newSite: true },
  { feature: '100% Responsivo', oldSite: false, newSite: true },
  { feature: 'SEO Otimizado', oldSite: false, newSite: true },
  { feature: 'WhatsApp Integrado', oldSite: false, newSite: true },
  { feature: 'Animações Profissionais', oldSite: false, newSite: true },
  { feature: 'Formulário Inteligente', oldSite: false, newSite: true },
  { feature: 'Google Maps Integrado', oldSite: false, newSite: true },
  { feature: 'Performance A+', oldSite: false, newSite: true },
];

const FeatureComparison = ({ comparisons = defaultComparisons }: FeatureComparisonProps) => {

  return (
    <div className="w-full">
      <div className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
        {/* Header */}
        <div className="grid grid-cols-3 bg-white/10 border-b border-white/10">
          <div className="py-4 px-4 sm:px-6 text-center">
            <span className="text-red-400 font-semibold text-sm sm:text-base">Site Atual</span>
          </div>
          <div className="py-4 px-4 sm:px-6 text-center border-x border-white/10">
            <span className="text-white/80 font-semibold text-sm sm:text-base">Recurso</span>
          </div>
          <div className="py-4 px-4 sm:px-6 text-center">
            <span className="text-green-400 font-semibold text-sm sm:text-base">Nova Versão</span>
          </div>
        </div>

        {/* Rows */}
        {comparisons.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-3 ${
              index !== comparisons.length - 1 ? 'border-b border-white/10' : ''
            } hover:bg-white/5 transition-colors duration-200`}
          >
            {/* Old Site */}
            <div className="py-3 sm:py-4 px-4 sm:px-6 flex justify-center items-center">
              {item.oldSite ? (
                <CheckCircle size={20} className="text-green-400" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X size={14} className="text-red-400" />
                </div>
              )}
            </div>

            {/* Feature Name */}
            <div className="py-3 sm:py-4 px-4 sm:px-6 border-x border-white/10 flex items-center justify-center">
              <span className="text-white/80 text-xs sm:text-sm text-center">
                {item.feature}
              </span>
            </div>

            {/* New Site */}
            <div className="py-3 sm:py-4 px-4 sm:px-6 flex justify-center items-center">
              {item.newSite ? (
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle size={16} className="text-green-400" />
                </div>
              ) : (
                <X size={20} className="text-red-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureComparison;

