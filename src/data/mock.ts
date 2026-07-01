import { Plan, User, Tenant, SmartBio, Offer, AiSuggestion, QuizQuestion, RecommendationRule, PreviewChecklistItem, PublishState, PublicSmartBioData } from '../types';

export const landingData = {
  hero: {
    title: "Crie uma bio inteligente, aprove o preview e publique em minutos.",
    subtitle: "A SmartBio guia seu onboarding, organiza suas ofertas, gera uma página pública de conversão e entrega um link pronto para colocar na bio das suas redes.",
    primaryCta: "Criar minha SmartBio",
    secondaryCta: "Ver como funciona",
    backgroundTypography: "SMARTBIO"
  },
  problem: {
    title: "Mostrar todos os links é deixar a decisão para o visitante.",
    subtitle: "A SmartBio transforma sua bio em uma jornada guiada: pergunta, entende, recomenda e converte.",
    before: {
      title: "Como é hoje",
      items: ["Muitos links na bio", "Visitante confuso", "Decisão manual", "Leads pouco qualificados"]
    },
    after: {
      title: "Com SmartBio",
      items: ["Onboarding guiado", "Página gerada automaticamente", "Visitante responde perguntas", "Recomendação clara", "CTA certo no final"]
    }
  },
  howItWorks: {
    title: "Como funciona a SmartBio?",
    subtitle: "Você não monta uma lista de links. Você responde um onboarding e a plataforma gera uma experiência de conversão.",
    steps: [
      { step: "1", title: "Escolha o plano" },
      { step: "2", title: "Crie sua conta" },
      { step: "3", title: "Responda o onboarding guiado" },
      { step: "4", title: "Revise o preview gerado" },
      { step: "5", title: "Aprove a publicação" },
      { step: "6", title: "Copie o link publicado" }
    ]
  },
  blocks: [
    {
      title: "Você responde o onboarding",
      description: "A plataforma coleta contexto, ofertas, público e objetivo do seu negócio."
    },
    {
      title: "A SmartBio estrutura tudo para você",
      description: "Montagem automática com copy persuasivo, módulos e fluxo."
    },
    {
      title: "O visitante recebe uma recomendação",
      description: "Diagnóstico inteligente faz perguntas e recomenda o próximo passo."
    },
    {
      title: "O SaaS publica e mede resultados",
      description: "Publicação em slug, captura de leads e envio para conversão."
    }
  ],
  demo: {
    title: "Veja uma SmartBio sendo criada de verdade",
    description: "O cliente aprova. A SmartBio publica. O link fica pronto para copiar. Tudo gerado automaticamente com base no seu onboarding."
  },
  onboarding: {
    title: "Captura, estrutura e gera. Em minutos.",
    description: "A plataforma sugere estrutura, copy, perguntas e CTAs. A SmartBio organiza tudo em dados, ofertas e regras revisáveis antes da publicação.",
    question: "Qual é o principal objetivo da sua SmartBio?",
    options: [
      "Vender uma oferta",
      "Captar leads",
      "Qualificar interessados",
      "Agendar atendimento"
    ],
    aiSuggestions: ["Headline", "Bio", "Perguntas", "CTA", "Ofertas", "Regras de recomendação"]
  },
  recommendation: {
    title: "Da recomendação ao próximo passo.",
    description: "O visitante acessa o link, responde perguntas rápidas, recebe uma recomendação com explicação e segue para o CTA certo."
  },
  pricing: [
    {
      id: "plan_essential",
      name: "Essencial",
      description: "Perfeito para criadores começando",
      priceLabel: "[PRICE_ESSENTIAL]",
      currency: "R$",
      features: ["SmartBio publicada em slug", "Perfil público e links sociais", "CTA principal", "Leads básicos", "Analytics básico"]
    },
    {
      id: "plan_intelligent",
      name: "Inteligente",
      description: "Para negócios em crescimento",
      priceLabel: "[PRICE_INTELLIGENT]",
      currency: "R$",
      features: ["Tudo do Essencial", "Onboarding guiado", "Quiz de diagnóstico", "Recomendação por regras", "Preview antes da publicação", "Leads qualificados"]
    },
    {
      id: "plan_premium",
      name: "Premium",
      description: "Para agências e grandes marcas",
      priceLabel: "[PRICE_PREMIUM]",
      currency: "R$",
      features: ["Tudo do Inteligente", "Agenda ou integração", "Analytics de funil", "CRM leve", "Suporte prioritário", "Templates e módulos avançados"]
    }
  ],
  faq: {
    title: "Perguntas Frequentes",
    items: [
      {
        question: "A SmartBio é só mais um link na bio?",
        answer: "Não é um Linktree ou lista de botões. A SmartBio é uma jornada guiada focada em conversão, onde o visitante responde perguntas e recebe a recomendação certa."
      },
      {
        question: "Quem publica a página?",
        answer: "O SaaS (SmartBio) publica a página automaticamente após a sua aprovação do preview. Você não precisa configurar hospedagem."
      },
      {
        question: "Preciso saber programar?",
        answer: "Não. Você responde ao onboarding guiado, aprova o resultado e copia o link final."
      },
      {
        question: "A plataforma decide tudo sozinha?",
        answer: "A plataforma sugere estrutura, textos e regras para acelerar o processo, mas tudo é 100% revisável por você antes da aprovação e publicação."
      },
      {
        question: "Posso revisar antes de publicar?",
        answer: "Sim. O fluxo obrigatório exige que você revise e aprove o preview antes da plataforma publicar no seu slug público."
      },
      {
        question: "Onde coloco o link publicado?",
        answer: "Na bio do seu Instagram, TikTok, YouTube, LinkedIn, ou em qualquer campanha de marketing."
      },
      {
        question: "Posso usar WhatsApp, agenda, formulário ou checkout?",
        answer: "Sim! A etapa final da recomendação pode direcionar o lead para qualquer um desses destinos de conversão."
      }
    ]
  },
  footer: {
    cta: "Pronta para criar sua SmartBio?",
    ctaButton: "Começar agora",
    links: ["Termos", "Privacidade", "Suporte"]
  },
  mockBio: {
    name: "[Nome do Especialista]",
    bio: "[Bio inteligente gerada pela IA focada em autoridade e clareza para o visitante]"
  }
};

export const mockUser: User = {
  id: 'usr_01',
  email: 'usuario@smartbio.app',
  fullName: '[NOME_USUARIO]',
  avatarUrl: 'https://i.pravatar.cc/150?u=usuario@smartbio.app',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockPlans: Plan[] = [
  {
    id: 'plan_essential',
    name: 'Essencial',
    description: 'Perfeito para criadores começando',
    priceLabel: '[PRICE_ESSENTIAL]',
    currency: 'BRL',
    features: ['SmartBio publicada em slug', 'Perfil público e links sociais', 'CTA principal', 'Leads básicos', 'Analytics básico'],
    stripePriceId: 'price_essential_test',
  },
  {
    id: 'plan_intelligent',
    name: 'Inteligente',
    description: 'Para negócios em crescimento',
    priceLabel: '[PRICE_INTELLIGENT]',
    currency: 'BRL',
    features: ['Tudo do Essencial', 'Onboarding guiado', 'Quiz de diagnóstico', 'Recomendação por regras', 'Preview antes da publicação', 'Leads qualificados'],
    stripePriceId: 'price_intelligent_test',
  },
  {
    id: 'plan_premium',
    name: 'Premium',
    description: 'Para agências e grandes marcas',
    priceLabel: '[PRICE_PREMIUM]',
    currency: 'BRL',
    features: ['Tudo do Inteligente', 'Agenda ou integração', 'Analytics de funil', 'CRM leve', 'Suporte prioritário', 'Templates e módulos avançados'],
    stripePriceId: 'price_premium_test',
  }
];

export const mockTenant: Tenant = {
  id: 'tnt_01',
  userId: 'usr_01',
  name: '[NOME_DA_MARCA]',
  slug: 'minha-smartbio',
  planId: 'plan_intelligent',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockSmartBio: SmartBio = {
  id: 'bio_01',
  tenantId: 'tnt_01',
  title: '[TITULO_DA_SMARTBIO]',
  bio: '[BIO_CURTA_GERADA_PELA_IA]',
  theme: 'light',
  status: 'preview_pending_approval',
  isPublished: false,
  publishedSlug: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const dashboardData = {
  auth: {
    login: {
      title: "Entrar na SmartBio",
      subtitle: "Acesse sua conta para continuar criando sua SmartBio inteligente.",
      emailLabel: "E-mail",
      passwordLabel: "Senha",
      submitButton: "Entrar",
      forgotPasswordLink: "Esqueci minha senha",
      noAccount: "Não tem uma conta?",
      createAccountLink: "Criar conta",
    },
    signup: {
      title: "Crie sua conta",
      subtitle: "Comece o onboarding e gere sua primeira SmartBio em minutos.",
      nameLabel: "Nome",
      emailLabel: "E-mail",
      passwordLabel: "Senha",
      submitButton: "Criar conta",
      hasAccount: "Já tenho conta?",
      loginLink: "Entrar",
    },
    forgotPassword: {
      title: "Recuperar acesso",
      subtitle: "Enviaremos instruções para redefinir sua senha.",
      emailLabel: "E-mail",
      submitButton: "Enviar instruções",
      remembered: "Lembrou da senha?",
      loginLink: "Voltar ao login",
    }
  },
  overview: {
    title: "Visão Geral",
    subtitle: "Acompanhe o status da sua SmartBio.",
    statusCard: {
      title: "Status da sua SmartBio",
      subtitle: "Continue o fluxo para gerar, aprovar e publicar sua SmartBio.",
      actions: {
        continueOnboarding: "Continuar onboarding",
        generating: "Gerando sua SmartBio...",
        viewPreview: "Ver preview completo",
        copyLink: "Copiar link publicado",
      },
      badges: {
        onboarding_pending: "Onboarding pendente",
        generating: "Gerando...",
        preview_pending_approval: "Preview aguardando aprovação",
        published: "Publicada",
      }
    },
    flowCard: {
      title: "Fluxo de Criação",
    },
    metricsCard: {
      views: "Visualizações",
      diagnosticsStarted: "Diagnósticos Inic.",
      diagnosticsCompleted: "Diagnósticos Concl.",
      ctaClicks: "Cliques no CTA",
    },
    publicLinkCard: {
      title: "Link Público",
      lockedText: "O link será liberado após aprovação e publicação.",
      copy: "Copiar",
      open: "Abrir",
    },
    previewCard: {
      title: "Preview",
      subtitle: "Este é o preview da página que será publicada após sua aprovação.",
      viewFull: "Ver preview completo",
      continueConfig: "Continuar configuração",
    },
    planCard: {
      title: "Plano Atual",
      active: "Ativo",
      manage: "Gerenciar assinatura",
      stripeNote: "Redireciona para Stripe Customer Portal",
    }
  }
};

export const mockDashboardMetrics = {
  views: 1245,
  diagnosticsStarted: 432,
  diagnosticsCompleted: 310,
  ctaClicks: 156,
};

export const mockCreationFlowSteps = [
  { step: 1, title: 'Plano contratado', status: 'complete' },
  { step: 2, title: 'Conta criada', status: 'complete' },
  { step: 3, title: 'Onboarding Guiado', status: 'complete' },
  { step: 4, title: 'Ofertas estruturadas', status: 'complete' },
  { step: 5, title: 'Quiz configurado', status: 'complete' },
  { step: 6, title: 'Preview gerado', status: 'current' },
  { step: 7, title: 'Aprovação do cliente', status: 'pending' },
  { step: 8, title: 'Publicação automática', status: 'pending' },
  { step: 9, title: 'Link pronto para copiar', status: 'pending' },
];

export const mockSubscription = {
  planId: 'plan_intelligent',
  planName: 'Inteligente',
  status: 'active', // active, past_due, canceled
};

export const mockOffers: Offer[] = [
  {
    id: 'off_01',
    tenantId: 'tnt_01',
    title: '[OFERTA_PRINCIPAL]',
    description: '[DESCRICAO_OFERTA]',
    url: 'https://cal.com/minha-smartbio',
    price: 150,
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    objective: 'Agendamento de consultoria',
    targetPain: '[DOR_RESOLVIDA]',
    idealAudience: '[PUBLICO_IDEAL]',
    maturityLevel: 'Intermediário',
    format: 'consultoria',
    recommendedCta: 'agenda',
    ctaDestination: 'https://cal.com/minha-smartbio',
    status: 'active',
    isConnectedToRule: true
  },
  {
    id: 'off_02',
    tenantId: 'tnt_01',
    title: '[OFERTA_DE_ENTRADA]',
    description: '[DESCRICAO_OFERTA]',
    url: 'https://minha-smartbio.com/entrada',
    price: 0,
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    objective: 'Captação de leads',
    targetPain: '[DOR_RESOLVIDA]',
    idealAudience: '[PUBLICO_IDEAL]',
    maturityLevel: 'Iniciante',
    format: 'produto_digital',
    recommendedCta: 'formulario',
    ctaDestination: 'https://minha-smartbio.com/entrada',
    status: 'active',
    isConnectedToRule: true
  },
  {
    id: 'off_03',
    tenantId: 'tnt_01',
    title: '[OFERTA_MENTORIA]',
    description: '[DESCRICAO_OFERTA]',
    url: 'https://wa.me/5511999999999',
    price: 1000,
    isActive: false,
    order: 3,
    createdAt: new Date().toISOString(),
    objective: 'Venda high-ticket',
    targetPain: '[DOR_RESOLVIDA]',
    idealAudience: '[PUBLICO_IDEAL]',
    maturityLevel: 'Avançado',
    format: 'mentoria',
    recommendedCta: 'whatsapp',
    ctaDestination: 'https://wa.me/5511999999999',
    status: 'draft',
    isConnectedToRule: false
  },
];

export const mockOnboardingSteps = [
  {
    id: 'step_identity',
    title: 'Identidade',
    description: 'Preencha como se estivesse escrevendo a bio do Instagram — direto ao ponto: quem você é, o que você faz e pra quem. Sua foto e nome aparecem no topo da SmartBio.',
    type: 'identity'
  },
  {
    id: 'step_objective',
    title: 'Objetivo',
    description: 'O que você quer que aconteça quando alguém acessa sua SmartBio? Escolha uma sugestão ou descreva com suas palavras — usamos isso para gerar a estrutura certa.',
    type: 'objective'
  },
  {
    id: 'step_audience',
    title: 'Público',
    description: 'Descreva o visitante que você quer atrair. Quanto mais específico você for, mais precisa será a recomendação gerada para cada perfil.',
    type: 'audience'
  },
  {
    id: 'step_offers',
    title: 'Ofertas',
    description: 'Qual é o produto, serviço ou experiência que você quer recomendar? Comece com a principal — você poderá adicionar mais depois na tela de Ofertas.',
    type: 'offers'
  },
  {
    id: 'step_diagnostic',
    title: 'Diagnóstico',
    description: 'Estas são as perguntas que seus visitantes vão responder ao acessar sua SmartBio. Com base nas respostas, a plataforma recomenda automaticamente a oferta certa para cada perfil.',
    type: 'diagnostic'
  },
  {
    id: 'step_conversion',
    title: 'Conversão',
    description: 'Defina o destino principal após a recomendação. Na tela de Quiz você poderá criar regras para enviar perfis diferentes para destinos diferentes — WhatsApp, agenda, checkout ou formulário.',
    type: 'conversion'
  },
  {
    id: 'step_style',
    title: 'Estilo',
    description: 'Use o HEX exato da sua identidade visual para manter consistência de marca na SmartBio.',
    type: 'style'
  },
  {
    id: 'step_review',
    title: 'Revisão',
    description: 'Revise todas as informações antes de gerar o preview.',
    type: 'review'
  }
];

export const mockOnboardingAnswers = [
  { stepId: 'step_1', answer: '[NICHO_DO_USUARIO]' },
  { stepId: 'step_2', answer: '[OFERTA_PRINCIPAL_DO_USUARIO]' },
  { stepId: 'step_3', answer: 'Captar leads qualificados' }
];

export const mockAiSuggestions: AiSuggestion[] = [
  {
    id: 'sug_1',
    type: 'bio',
    content: '[BIO_SUGERIDA_PELA_IA]',
    isAccepted: true
  },
  {
    id: 'sug_2',
    type: 'quiz',
    content: {
      question: '[PERGUNTA_DE_DIAGNOSTICO_GERADA_PELA_IA]',
      options: ['[OPCAO_A]', '[OPCAO_B]']
    },
    isAccepted: false
  }
];

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q_01',
    tenantId: 'tnt_01',
    question: 'Qual é o seu principal objetivo hoje?',
    type: 'choice',
    options: ['Organizar meus processos', 'Aumentar minhas vendas', 'Ter acompanhamento direto'],
    order: 1,
    isRequired: true,
    intention: 'Entender objetivo',
    status: 'active'
  },
  {
    id: 'q_02',
    tenantId: 'tnt_01',
    question: 'Qual é o seu nível atual de faturamento?',
    type: 'choice',
    options: ['Ainda não vendo', 'Até 5k/mês', 'Mais de 10k/mês'],
    order: 2,
    isRequired: true,
    intention: 'Identificar maturidade',
    status: 'active'
  }
];

export const mockRecommendationRules: RecommendationRule[] = [
  {
    id: 'rule_01',
    tenantId: 'tnt_01',
    name: 'Iniciantes querendo vender',
    description: 'Se o visitante está no início e quer clareza, recomendar a oferta de entrada.',
    condition: 'SE Objetivo = "Aumentar minhas vendas" E Faturamento = "Ainda não vendo"',
    offerId: 'off_02',
    recommendedOfferId: 'off_02',
    recommendationReason: 'Identificamos que você precisa dos primeiros passos para começar a vender.',
    finalCta: 'formulario',
    status: 'active',
    isActive: true
  },
  {
    id: 'rule_02',
    tenantId: 'tnt_01',
    name: 'Avançado precisando de mentoria',
    description: 'Se o visitante já sabe o que quer e precisa de acompanhamento, recomendar a mentoria.',
    condition: 'SE Objetivo = "Ter acompanhamento direto" E Faturamento = "Mais de 10k/mês"',
    offerId: 'off_03',
    recommendedOfferId: 'off_03',
    recommendationReason: 'Para o seu nível atual, a mentoria direta é o caminho mais rápido para escalar.',
    finalCta: 'whatsapp',
    status: 'active',
    isActive: true
  }
];

export const mockRecommendationPreview = {
  title: 'Recomendação para você',
  offerName: '[OFERTA_MENTORIA]',
  reason: 'Para o seu nível atual, a mentoria direta é o caminho mais rápido para escalar.',
  nextSteps: ['Clique no botão abaixo', 'Envie a mensagem no WhatsApp', 'Nossa equipe fará o agendamento'],
  buttonText: 'Falar no WhatsApp'
};

export const mockPreviewChecklist: PreviewChecklistItem[] = [
  { id: 'chk_1', label: 'Identidade revisada', isComplete: true },
  { id: 'chk_2', label: 'Ofertas estruturadas', isComplete: true },
  { id: 'chk_3', label: 'Quiz configurado', isComplete: true },
  { id: 'chk_4', label: 'Regras de recomendação ativas', isComplete: true },
  { id: 'chk_5', label: 'CTA final definido', isComplete: true },
  { id: 'chk_6', label: 'Preview validado', isComplete: true },
];

export const mockPublishState: PublishState = {
  status: 'pending', // pending, publishing, published, failed
  publishedAt: null,
  publicUrl: null
};

export const mockPublicSmartBioData: PublicSmartBioData = {
  tenantName: '[NOME_DA_MARCA]',
  title: '[TITULO_DA_SMARTBIO]',
  bio: '[BIO_CURTA_GERADA_PELA_IA]',
  theme: 'light',
  avatarUrl: 'https://i.pravatar.cc/150?u=usuario@smartbio.app',
  socialLinks: {
    instagram: 'https://instagram.com/[USUARIO]',
    linkedin: 'https://linkedin.com/in/[USUARIO]'
  },
  offers: mockOffers,
  quizQuestions: mockQuizQuestions
};

