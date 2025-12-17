import { useState } from 'react';
import { X } from 'lucide-react';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
  icon?: string;
}

interface InteractiveHotspotsProps {
  imageUrl?: string;
  siteUrl: string;
}

const InteractiveHotspots = ({ siteUrl }: InteractiveHotspotsProps) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const hotspots: Hotspot[] = [
    {
      id: '1',
      x: 50,
      y: 5,
      label: 'Header Inteligente',
      description: 'Menu fixo com transparência dinâmica ao scroll e navegação suave entre seções.',
    },
    {
      id: '2',
      x: 90,
      y: 5,
      label: 'Área VIP',
      description: 'Acesso exclusivo para clientes com portal personalizado.',
    },
    {
      id: '3',
      x: 50,
      y: 35,
      label: 'Serviços Premium',
      description: 'Cards expansíveis com detalhes completos dos 4 departamentos.',
    },
    {
      id: '4',
      x: 15,
      y: 55,
      label: 'Equipe Profissional',
      description: 'Fotos reais dos 4 sócios-proprietários com cards elegantes.',
    },
    {
      id: '5',
      x: 92,
      y: 85,
      label: 'WhatsApp Flutuante',
      description: 'Botão inteligente com tooltip e mensagem pré-definida.',
    },
  ];

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900">
      {/* Site Preview */}
      <iframe
        src={siteUrl}
        title="Preview do site"
        className="w-full h-full border-0 pointer-events-none"
        style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
      />

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Hotspots */}
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          className={`absolute z-10 group cursor-pointer ${
            activeHotspot?.id === hotspot.id ? 'scale-125' : ''
          }`}
          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          onClick={() => setActiveHotspot(activeHotspot?.id === hotspot.id ? null : hotspot)}
        >
          {/* Pulse animation ring */}
          <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A574]/30 animate-ping" />
          
          {/* Main dot */}
          <div className="relative w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A574] border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>

          {/* Tooltip on hover */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {hotspot.label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80" />
          </div>
        </button>
      ))}

      {/* Detail Panel */}
      {activeHotspot && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 animate-fade-in">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-white font-semibold">{activeHotspot.label}</h4>
            <button
              onClick={() => setActiveHotspot(null)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={16} className="text-white/60" />
            </button>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            {activeHotspot.description}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 left-4 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm">
        <p className="text-white/80 text-xs">Clique nos pontos para saber mais</p>
      </div>
    </div>
  );
};

export default InteractiveHotspots;

