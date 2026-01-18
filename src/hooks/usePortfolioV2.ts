import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  thumbnail_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Fallback data in case Supabase is unavailable
// Ordem: Conexa AI, Oxpay, Empregga, Techome, e demais
const fallbackProjects: PortfolioProject[] = [
  {
    id: '1',
    title: 'Conexa AI',
    description: 'Consultoria de IA para automação de atendimento, processos repetitivos e vendas. Chatbots humanizados e integrações com WhatsApp/CRMs.',
    category: 'Tecnologia/AI',
    url: 'https://conexaai.com.br/',
    thumbnail_url: '/Images/capas-sites/Conexa AI.webp',
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Oxpay',
    description: 'Conta digital especializada para transportadoras. Pagamentos em lote, antecipação de frete, onboarding digital e benefícios exclusivos para motoristas.',
    category: 'Fintech',
    url: 'https://www.oxpay.com.br/',
    thumbnail_url: '/Images/capas-sites/Oxpay.webp',
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Empregga',
    description: 'Plataforma de recrutamento que conecta empresas a profissionais de RH. +6.000 contratados, +2.700 empresas atendidas, 1 vaga a cada 60 minutos.',
    category: 'RH/Tecnologia',
    url: 'https://empregga.com.br/',
    thumbnail_url: '/Images/capas-sites/Empregga.webp',
    order_index: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Techome',
    description: 'Casas de alto padrão em condomínio fechado com tecnologia construtiva americana. 4 modelos de 181 a 220m² no Jardim Recanto das Águas em Nova Odessa.',
    category: 'Imobiliário',
    url: 'https://suacasatechome.com.br/',
    thumbnail_url: '/Images/capas-sites/Techome.webp',
    order_index: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Envel Contabilidade',
    description: 'Escritório contábil com 60 anos de excelência em gestão contábil. +1.200 clientes confiam na expertise para transformar números em resultados.',
    category: 'Contabilidade',
    url: 'https://envel-contabilidade.vercel.app/',
    thumbnail_url: '/Images/capas-sites/Envel-Contabilidade.png',
    order_index: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Haza Empreendimentos',
    description: 'Construtora em Joinville-SC com o Residencial Riade em fase de construção. Apartamentos na Rua Padre Roma, bairro João Costa, com plantas de qualidade.',
    category: 'Imobiliário',
    url: 'https://hazaempreendimentos.com.br/',
    thumbnail_url: '/Images/capas-sites/Haza Empreendimentos.webp',
    order_index: 6,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'BF Tributos',
    description: 'Consultoria tributária com +14 anos de experiência em isenção de IR para aposentados e restituição de impostos. Pagamento apenas no êxito.',
    category: 'Financeiro',
    url: 'https://bftributos.com.br/',
    thumbnail_url: '/Images/capas-sites/BF Tributos.webp',
    order_index: 7,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '9',
    title: 'GynFood App',
    description: 'Sistema completo de gestão para food service com PDV, cardápio digital, integração com iFood/Rappi e automação via WhatsApp com IA.',
    category: 'App/Saúde',
    url: 'https://gynfood.vercel.app/',
    thumbnail_url: '/Images/capas-sites/GynFood App.webp',
    order_index: 9,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '10',
    title: 'Grupo Dharma Soluções',
    description: 'Empresa de arquitetura e construção com 27 anos de experiência, especializada em projetos residenciais e obras com tijolo ecológico.',
    category: 'Arquitetura',
    url: 'https://grupodharmasolucoes.com.br/',
    thumbnail_url: '/Images/capas-sites/Grupo Dharma Soluções.webp',
    order_index: 10,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11',
    title: 'Color Haus Acabamentos',
    description: 'Serviços profissionais de pintura, pisos e encanamento para obras residenciais, comerciais e industriais desde 2015.',
    category: 'Varejo',
    url: 'https://colorhausacabamentos.com/',
    thumbnail_url: '/Images/capas-sites/Color Haus Acabamentos.webp',
    order_index: 11,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '12',
    title: 'Oasis Corp',
    description: 'Agência especializada em sites profissionais: landing pages, sites institucionais e one page. Mais de 53 empresas atendidas com nota 4.9.',
    category: 'Agência',
    url: 'https://oasiscorp.com.br/',
    thumbnail_url: '/Images/capas-sites/Oasis Corp.webp',
    order_index: 12,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '13',
    title: 'Valor Corretora',
    description: 'Corretora de seguros focada em Seguro de Renda (DIT) para autônomos e profissionais liberais. Avaliação 4.9/5 no Google.',
    category: 'Financeiro',
    url: 'https://valor-corretora-landing.vercel.app/',
    thumbnail_url: '/Images/capas-sites/Valor Corretora.webp',
    order_index: 13,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '14',
    title: 'Semiglobe',
    description: 'Soluções completas em energia solar: importação, logística e distribuição de equipamentos para todo o Brasil.',
    category: 'Tecnologia',
    url: 'https://semiglobe.com.br/',
    thumbnail_url: '/Images/capas-sites/Semiglobe.webp',
    order_index: 14,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '16',
    title: 'DX Lub',
    description: 'Fabricante de lubrificantes automotivos e industriais com linha completa para carros, motos, caminhões e maquinário agrícola.',
    category: 'Industrial',
    url: 'https://dxlub.com/',
    thumbnail_url: '/Images/capas-sites/DX Lub.webp',
    order_index: 16,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '17',
    title: 'Bidix Pay',
    description: 'Maquininhas de cartão com taxas a partir de 1,39% no débito. Recebimento em 1 dia útil, frete grátis e 5 anos de garantia.',
    category: 'Fintech',
    url: 'https://bidixpay.com.br/',
    thumbnail_url: '/Images/capas-sites/Bidix Pay.webp',
    order_index: 17,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '18',
    title: 'Hora do Sono Colchões',
    description: 'Loja de colchões em Campinas com entrega em até 2 horas. Colchões de molas, espuma e box baú com nota 4.9 no Google.',
    category: 'E-commerce',
    url: 'https://horadosonocolchoes.com.br/',
    thumbnail_url: '/Images/capas-sites/Hora do Sono Colchões.webp',
    order_index: 18,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '19',
    title: 'James Produtor',
    description: 'Fotógrafo publicitário com direção criativa e produção completa para moda, e-commerce, beauty e branding de marcas.',
    category: 'Produção',
    url: 'https://www.jamesprodutor.com.br/',
    thumbnail_url: '/Images/capas-sites/James Produtor.webp',
    order_index: 19,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '20',
    title: 'Maier Advocacia',
    description: 'Advocacia criminal com atendimento 24h: habeas corpus, tribunal do júri, crimes de colarinho branco e grandes operações.',
    category: 'Advocacia',
    url: 'https://maieradvocacia.com.br/',
    thumbnail_url: '/Images/capas-sites/Maier Advocacia.webp',
    order_index: 20,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '23',
    title: 'Ideia Medicina do Trabalho',
    description: 'Saúde ocupacional, segurança do trabalho e gestão ambiental em MG. Reduções de até 38% em afastamentos e 81% em dias de ausência por acidentes.',
    category: 'Saúde',
    url: 'https://ideiamedicinadotrabalho.com.br/',
    thumbnail_url: '/Images/capas-sites/Ideia Medicina do Trabalho.webp',
    order_index: 23,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '24',
    title: 'Faculdade Phorte - Black Friday',
    description: 'Landing page de Black Friday com 4 formações avançadas e +50 cursos para profissionais de Educação Física. Descontos de até 80%.',
    category: 'Educação',
    url: 'https://faculdadephorte.edu.br/black-friday-phorte-educacao-fisica/',
    thumbnail_url: '/Images/capas-sites/Faculdade Phorte - Black Friday.webp',
    order_index: 24,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const usePortfolioV2 = () => {
  // Initialize with fallback data immediately for fast rendering
  const [projects, setProjects] = useState<PortfolioProject[]>(fallbackProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Try to fetch from Supabase in background
        const { data, error: supabaseError } = await supabase
          .from('portfolio_projects_v2')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (supabaseError) {
          console.warn('Error fetching from Supabase, using fallback:', supabaseError);
          return;
        }

        if (data && data.length > 0) {
          setProjects(data);
        }

        setError(null);
      } catch (err) {
        console.warn('Error in usePortfolioV2, using fallback:', err);
        setError(null); // Don't show error to user, just use fallback
      }
    };

    fetchProjects();
  }, []);

  // Get unique categories
  const categories = [...new Set(projects.map((p) => p.category))].sort();

  return {
    projects,
    categories,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      // Trigger re-fetch
    },
  };
};

