import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://sphiqzwnkuzfiwejjlav.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGlxendua3V6Zml3ZWpqbGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTQxMjMsImV4cCI6MjA2NTI3MDEyM30.-R19Vv3EgGxjeb0PoqaU4-SMi46E3PE-7FnFIyxWUds';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PortfolioImage {
  id: string;
  project_id: string;
  project_title: string;
  project_description: string;
  project_category: string;
  original_url: string;
  thumbnail_url?: string;
  webp_url?: string;
  blur_data_url?: string;
  priority: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  image: string;
  thumbnailImage?: string;
  blurDataUrl?: string;
  category: string;
  priority?: boolean;
}

export const usePortfolioImages = () => {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback data - dados originais caso o Supabase não esteja disponível
  const fallbackProjects: ProjectData[] = [
    {
      id: 101,
      title: "Plataforma de IA para Vendas",
      description: "Landing page desenvolvida para uma plataforma inovadora de inteligência artificial focada em otimizar processos de vendas e atendimento ao cliente.",
      image: "/Images/landing-page-demonstracao-workana-1.png",
      category: "ai",
      priority: true
    },
    {
      id: 102,
      title: "Quart's - Móveis Sob Medida",
      description: "Landing page desenvolvida para uma empresa especializada em móveis sob medida e design de interiores.",
      image: "/Images/118d31229400769.686562b112afe.jpg",
      category: "interiores",
      priority: true
    },
    {
      id: 1,
      title: "Wood Home - Móveis Planejados",
      description: "Landing page para empresa de móveis planejados sob medida, destacando design sofisticado, qualidade e atendimento personalizado",
      image: "/Images/landing-page-demonstracao-1.webp",
      category: "design",
      priority: true
    },
    {
      id: 105,
      title: "Valor Corretora - Seguro de Renda",
      description: "Página de captura que apresenta o Seguro DIT para proteger a renda de trabalhadores contra afastamentos por acidente ou doença.",
      image: "/Images/FireShot Capture 003 - Segura de Renda.webp",
      category: "finance"
    },
    {
      id: 106,
      title: "Curso Nano Lips – Domine a Técnica Mais Lucrativa do Mercado",
      description: "Página de captura para curso especializado em Nano Lips, apresentando benefícios, público-alvo, técnicas ensinadas, resultados alcançáveis e bônus exclusivos.",
      image: "/Images/FireShotCaptureNanoLips.jpg",
      category: "education"
    },
    {
      id: 104,
      title: "Rei do Crédito – Crédito Rápido e Seguro",
      description: "Página de captura que apresenta soluções de crédito rápido e transparente (Antecipação FGTS, crédito pessoal e para trabalhadores).",
      image: "/Images/FireShot Capture 001 - Rei do Crédito.webp",
      category: "finance"
    },
    {
      id: 2,
      title: "Teacher Mary - Curso de Inglês",
      description: "Página de captura para professora de inglês com método exclusivo, aulas personalizadas e resultados comprovados",
      image: "/Images/landing-page-demonstracao-2.webp",
      category: "education"
    },
    {
      id: 3,
      title: "Evento de Imersão",
      description: "Landing page desenvolvida para uma imersão de alto nível voltada para desenvolvimento pessoal e networking estratégico.",
      image: "/Images/landing-page-demonstracao-3.png",
      category: "evento"
    },
    {
      id: 4,
      title: "Plataforma de Design Interativo",
      description: "Landing page para ferramenta de criação de interfaces UI com gráficos vetoriais em tempo real e multiplataforma",
      image: "/Images/landing-page-demonstracao-4.webp",
      category: "tech"
    },
    {
      id: 5,
      title: "Desenvolvimento Pessoal & Relacionamentos",
      description: "Página de conversão para programa de autoconhecimento e relacionamentos saudáveis voltado para mulheres",
      image: "/Images/landing-page-demonstracao-5.webp",
      category: "lifestyle"
    },
    {
      id: 6,
      title: "Checklist Produto Digital",
      description: "Landing page para método de lançamento de produtos digitais em 3 dias, ideal para iniciantes sem audiência",
      image: "/Images/landing-page-demonstracao-6.webp",
      category: "digital"
    },
    {
      id: 7,
      title: "Grupo Dharma - Arquitetura",
      description: "Site institucional para empresa de arquitetura e design de interiores com portfólio de projetos residenciais e comerciais",
      image: "/Images/landing-page-demonstracao-7.webp",
      category: "architecture"
    },
    {
      id: 8,
      title: "Oasis Corp - Presença Digital",
      description: "Landing page para agência especializada em criar sites profissionais para pequenas empresas e empreendedores",
      image: "/Images/landing-page-demonstracao-8.webp",
      category: "agency"
    },
    {
      id: 103,
      title: "Turtle Fast - Autoridade Digital",
      description: "Página de vendas para metodologia que transforma especialistas em autoridades digitais lucrativas em 120 dias",
      image: "/Images/0cbb7d227466547.68406a44b0343.webp",
      category: "business"
    },
    {
      id: 9,
      title: "Automação Financeira Empresarial",
      description: "Plataforma de gestão financeira inteligente para pequenas empresas com IA, insights em tempo real e integração bancária",
      image: "/Images/landing-page-demonstracao-9.png",
      category: "fintech"
    }
  ];

  useEffect(() => {
    const fetchPortfolioImages = async () => {
      try {
        // Inicia com fallback imediatamente para carregamento rápido
        const projectsWithPriority = fallbackProjects.map((project, index) => ({
          ...project,
          priority: index < 6 // Primeiras 6 imagens são prioritárias
        }));
        
        setProjects(projectsWithPriority);
        setLoading(false);
        
        // Precarrega as primeiras 6 imagens imediatamente
        const preloadImages = projectsWithPriority.slice(0, 6);
        preloadImages.forEach((project) => {
          const img = new Image();
          img.src = project.image;
        });
        
        // Tenta buscar dados otimizados do Supabase em background
        const { data, error: supabaseError } = await supabase
          .from('portfolio_images')
          .select('*')
          .eq('is_active', true)
          .order('priority', { ascending: false })
          .order('created_at', { ascending: true });

        if (!supabaseError && data && data.length > 0) {
          setImages(data);
          
          // Converte dados do Supabase para o formato esperado
          const convertedProjects: ProjectData[] = data.map((img, index) => ({
            id: parseInt(img.project_id),
            title: img.project_title,
            description: img.project_description,
            image: img.original_url,
            // Usa imagem original porque as thumbnails não existem no servidor
            thumbnailImage: img.original_url, 
            blurDataUrl: img.blur_data_url,
            category: img.project_category,
            priority: index < 6 // Primeiras 6 são prioritárias
          }));
          
          // Precarrega também as imagens do Supabase
          convertedProjects.slice(0, 6).forEach((project) => {
            const img = new Image();
            img.src = project.image; // Usa imagem original
          });
          
          setProjects(convertedProjects);
        }
        
        setError(null);
      } catch (err) {
        console.warn('Error fetching portfolio images, keeping fallback:', err);
        setError(null);
      }
    };

    fetchPortfolioImages();
  }, []);

  return {
    images,
    projects,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      // Re-executa o useEffect
    }
  };
};
