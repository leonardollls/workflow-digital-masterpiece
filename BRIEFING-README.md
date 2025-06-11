# Formulário de Briefing - Workflow Digital

## 📋 Visão Geral

Este formulário foi desenvolvido especificamente para coletar todas as informações necessárias dos clientes que aceitaram propostas da Workflow Digital na plataforma Workana. O objetivo é garantir que tenhamos todos os dados essenciais para criar landing pages altamente eficazes e personalizadas.

## 🚀 Acesso ao Formulário

O formulário está disponível na rota: `/briefing`

## 🔍 Estrutura do Formulário

O formulário é dividido em 5 etapas principais:

### 1. **Informações da Empresa** 🏢
- Nome da empresa/marca
- Segmento/nicho de atuação 
- Descrição detalhada do negócio
- Definição do público-alvo
- Diferencial competitivo
- Objetivo principal da landing page

### 2. **Produto/Serviço** 🎯
- Dados de contato do responsável
- Informações detalhadas do produto/serviço
- Principais benefícios oferecidos
- Faixa de preço
- Garantias disponíveis

### 3. **Marketing & Design** 🎨
- Call-to-action principal
- Destino dos leads (WhatsApp, formulário, etc.)
- Cores da marca
- Status do logo da empresa
- Referências visuais de inspiração

### 4. **Configurações Técnicas** ⚙️
- Domínio desejado
- Integrações necessárias (CRM, email marketing, etc.)
- Códigos de analytics e tracking

### 5. **Timeline & Orçamento** 📅
- Prazo de entrega desejado
- Orçamento aprovado
- Data de início preferida
- Observações adicionais

## ✨ Características Técnicas

### Design e UX
- **Responsivo**: Otimizado para desktop, tablet e mobile
- **Multi-step**: Interface dividida em etapas para não sobrecarregar
- **Progress Bar**: Indicador visual do progresso
- **Validação em Tempo Real**: Feedback imediato sobre erros
- **Design System**: Utiliza a mesma identidade visual do projeto principal

### Tecnologias Utilizadas
- **React Hook Form**: Gerenciamento de formulário
- **Zod**: Validação de dados robusta
- **Tailwind CSS**: Estilização responsiva
- **Shadcn/UI**: Componentes de interface
- **Lucide React**: Ícones modernos

### Funcionalidades
- ✅ Validação completa de todos os campos obrigatórios
- ✅ Navegação entre etapas com controle de estado
- ✅ Tela de sucesso após envio
- ✅ Design profissional alinhado com a marca
- ✅ Campos adaptáveis para diferentes tipos de negócio

## 📱 Campos de Formulário Detalhados

### Campos Obrigatórios (*)
1. **Nome da Empresa/Marca** - Identificação da marca
2. **Segmento/Nicho** - Categoria do negócio
3. **Descrição do Negócio** - Mínimo 50 caracteres
4. **Público-Alvo** - Definição detalhada dos clientes ideais
5. **Diferencial Competitivo** - O que diferencia dos concorrentes
6. **Objetivo da Landing Page** - Meta principal (vendas, leads, etc.)
7. **Nome do Responsável** - Pessoa de contato
8. **Email** - Contato principal
9. **Telefone/WhatsApp** - Para comunicação direta
10. **Nome do Produto/Serviço** - Oferta principal
11. **Descrição do Produto** - Detalhes completos
12. **Principais Benefícios** - Resultados para o cliente
13. **Faixa de Preço** - Categoria de investimento
14. **Call-to-Action** - Ação desejada do visitante
15. **Destino dos Leads** - Para onde direcionar interessados
16. **Status do Logo** - Se possui logo profissional
17. **Prazo de Entrega** - Urgência do projeto
18. **Orçamento** - Valor aprovado
19. **Data de Início** - Quando pode começar

### Campos Opcionais
- Site atual (se houver)
- Garantias oferecidas
- Cores da marca
- Referências visuais
- Domínio desejado
- Integrações necessárias
- Códigos de analytics
- Observações adicionais

## 🎯 Benefícios para o Cliente

### O que está incluído no projeto:
- ✅ Design responsivo para mobile e desktop
- ✅ Otimização para conversão
- ✅ SEO básico implementado
- ✅ Integração com ferramentas de marketing
- ✅ Hospedagem gratuita por 1 ano
- ✅ Suporte pós-entrega

## 🔄 Fluxo de Uso

1. **Cliente acessa** `/briefing`
2. **Preenche informações** nas 5 etapas
3. **Validação automática** dos dados
4. **Envio do briefing** completo
5. **Confirmação visual** de recebimento
6. **Workflow Digital** recebe os dados estruturados
7. **Retorno em até 24h** com cronograma

## 🛠️ Para Desenvolvedores

### Estrutura do Código
```
src/pages/ClientBrief.tsx
├── Schema de validação (Zod)
├── Componente principal
├── 5 Steps condicionais
├── Navegação entre etapas
├── Tela de sucesso
└── Integração com React Hook Form
```

### Principais Hooks Utilizados
- `useForm` - Gerenciamento do formulário
- `useState` - Controle de etapas e submissão
- `zodResolver` - Validação com Zod

### Personalização
Para modificar campos ou adicionar novas etapas:
1. Atualize o schema `clientBriefSchema`
2. Adicione/modifique os steps no array `steps`
3. Implemente a nova etapa no JSX
4. Atualize as validações necessárias

## 📞 Suporte

Para dúvidas sobre o formulário ou sugestões de melhoria, entre em contato com a equipe da Workflow Digital.

---

**Desenvolvido com ❤️ pela Workflow Digital** 