import type { LandingPageBriefing } from '@/services/briefingService'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Exporta um briefing de landing page para formato JSON
 */
export const exportBriefingToJSON = (briefing: LandingPageBriefing): void => {
  const jsonContent = JSON.stringify(briefing, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `briefing-${briefing.company_name || 'landing-page'}-${format(new Date(), 'yyyy-MM-dd')}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Exporta um briefing de landing page para formato Markdown
 */
export const exportBriefingToMarkdown = (briefing: LandingPageBriefing): void => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR
      })
    } catch {
      return dateString
    }
  }

  const formatArray = (arr: string[] | null | undefined): string => {
    if (!arr || arr.length === 0) return 'Não informado'
    return arr.map((item, index) => `${index + 1}. ${item}`).join('\n')
  }

  const formatValue = (value: string | null | undefined): string => {
    return value || 'Não informado'
  }

  const markdown = `# Briefing de Landing Page

## Informações Gerais

- **Empresa/Marca:** ${formatValue(briefing.company_name)}
- **Segmento/Nicho:** ${formatValue(briefing.business_segment)}
- **Responsável:** ${formatValue(briefing.responsible_name)}
- **Data de Recebimento:** ${formatDate(briefing.created_at)}
- **Desenvolvedor:** Leonardo Lopes

---

## Step 1: Informações da Empresa

### Nome da Empresa/Marca
${formatValue(briefing.company_name)}

### Segmento/Nicho
${formatValue(briefing.business_segment)}

### Descrição do Negócio
${formatValue(briefing.business_description)}

### Público-Alvo
${formatValue(briefing.target_audience)}

### Diferencial Competitivo
${formatValue(briefing.competitive_differential)}

### Objetivo da Landing Page
${formatValue(briefing.landing_page_goal)}

---

## Step 2: Estratégia & Mercado

### Principais Concorrentes
${formatValue(briefing.main_competitors)}

### Principais Dores do Cliente
${formatValue(briefing.customer_pain_points)}

### Histórias de Sucesso
${formatValue(briefing.success_stories)}

### Prova Social Disponível
${formatValue(briefing.social_proof)}

---

## Step 3: Produto/Serviço

### Responsável
${formatValue(briefing.responsible_name)}

### Site Atual
${briefing.current_website ? `[${briefing.current_website}](${briefing.current_website})` : 'Não informado'}

### Nome do Produto
${formatValue(briefing.product_name)}

### Descrição Detalhada
${formatValue(briefing.product_description)}

### Principais Benefícios
${formatValue(briefing.main_benefits)}

### Quantidade de Ofertas
${formatValue(briefing.number_of_offers)}

### Modelo de Cobrança
${formatValue(briefing.pricing_model)}

### Detalhes das Ofertas
${formatValue(briefing.offer_details)}

### Garantias
${formatValue(briefing.guarantees)}

### Diferenciais do Produto
${formatValue(briefing.product_differentials)}

---

## Step 4: Conversão & Argumentos

### Resultados Esperados
${formatValue(briefing.target_results)}

### Fatores de Urgência
${formatValue(briefing.urgency_factors)}

### Objeções dos Clientes
${formatValue(briefing.objections)}

### CTA Principal
${formatValue(briefing.call_to_action)}

### Destino dos Leads
${formatValue(briefing.lead_destination)}

### Principais Argumentos de Venda
${formatValue(briefing.sales_arguments)}

---

## Step 5: Design & Identidade

### Cores da Marca
${formatValue(briefing.brand_colors)}

### Logo
${formatValue(briefing.has_logo)}

### Arquivos de Logo Enviados
${briefing.logo_files && briefing.logo_files.length > 0 
  ? briefing.logo_files.map((url, index) => `${index + 1}. [Logo ${index + 1}](${url})`).join('\n')
  : 'Nenhum arquivo enviado'}

### Referências Visuais
${formatValue(briefing.visual_references)}

### Arquivos de Referências Visuais
${briefing.visual_files && briefing.visual_files.length > 0 
  ? briefing.visual_files.map((url, index) => `${index + 1}. [Referência ${index + 1}](${url})`).join('\n')
  : 'Nenhum arquivo enviado'}

### Materiais para Landing
${formatValue(briefing.content_materials)}

### Arquivos de Materiais Enviados
${briefing.material_files && briefing.material_files.length > 0 
  ? briefing.material_files.map((url, index) => `${index + 1}. [Material ${index + 1}](${url})`).join('\n')
  : 'Nenhum arquivo enviado'}

### Personalidade da Marca
${formatValue(briefing.brand_personality)}

### Tom de Comunicação
${formatValue(briefing.communication_tone)}

### Mensagens-Chave
${formatValue(briefing.key_messages)}

---

## Step 6: Estrutura & Funcionalidades

### Seções da Landing Page
${formatValue(briefing.landing_page_sections)}

### Requisitos Específicos
${formatValue(briefing.specific_requirements)}

### Domínio Desejado
${formatValue(briefing.desired_domain)}

### Hospedagem
${formatValue(briefing.hosting_preference)}

### Integrações Necessárias
${formatValue(briefing.integrations)}

### Analytics e Tracking
${formatValue(briefing.analytics_tracking)}

---

## Step 7: Finalização

### Observações Adicionais
${formatValue(briefing.additional_notes)}

### Prazo de Entrega
${formatValue(briefing.deadline)}

### Orçamento
${formatValue(briefing.budget)}

### Data de Início
${formatValue(briefing.start_date)}

---

## Informações Administrativas

${briefing.proposal_value ? `### Proposta Comercial
- **Valor:** R$ ${briefing.proposal_value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
${briefing.proposal_date ? `- **Data da Proposta:** ${formatDate(briefing.proposal_date)}` : ''}
` : ''}

### Metadados
- **ID do Briefing:** ${briefing.id}
- **Criado em:** ${formatDate(briefing.created_at)}
- **Atualizado em:** ${formatDate(briefing.updated_at)}
- **Termos Aceitos:** ${briefing.agreed_terms ? 'Sim' : 'Não'}

---

*Documento gerado automaticamente em ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}*
`

  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `briefing-${briefing.company_name || 'landing-page'}-${format(new Date(), 'yyyy-MM-dd')}.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Exporta múltiplos briefings para JSON
 */
export const exportMultipleBriefingsToJSON = (briefings: LandingPageBriefing[]): void => {
  const jsonContent = JSON.stringify(briefings, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `briefings-landing-pages-${format(new Date(), 'yyyy-MM-dd')}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
