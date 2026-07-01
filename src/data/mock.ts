import { Plan, User, Tenant, SmartBio, Offer, AiSuggestion, QuizQuestion, RecommendationRule, PreviewChecklistItem, PublishState, PublicSmartBioData } from '../types';

export const landingData = {
  hero: {
    title: "Sua bio pode guiar, qualificar e converter visitantes. Sem você estar online.",
    subtitle: "A SmartBio transforma sua bio em uma jornada de conversão personalizada: entende o perfil do visitante, recomenda a oferta certa e entrega o próximo passo. Você responde o onboarding, aprova o preview e copia o link.",
    primaryCta: "Criar minha SmartBio",
    secondaryCta: "Ver como funciona",
    backgroundTypography: "SMARTBIO"
  },
  problem: {
    title: "Mostrar todos os links é deixar a decisão para o visitante.",
    subtitle: "A SmartBio transforma sua bio em uma jornada guiada: entende o visitante, recomenda o que faz sentido para ele e conduz para o próximo passo certo.",
    before: {
      title: "Como é hoje",
      items: ["Bio que lista tudo, não direciona nada", "Visitante decide sozinho — ou vai embora", "Você qualifica clientes no DM manualmente", "Não sabe qual link converte mais"]
    },
    after: {
      title: "Com SmartBio",
      items: ["Fluxo de diagnóstico com perguntas rápidas", "Recomendação personalizada por perfil", "Qualificação automática antes do CTA", "Link certo para o visitante certo", "Você aprova — a plataforma publica"]
    }
  },
  howItWorks: {
    title: "Como funciona a SmartBio?",
    subtitle: "Você não monta um site. Você descreve o seu negócio e a SmartBio gera uma experiência de conversão pronta para publicar.",
    steps: [
      { step: "1", title: "Escolha o plano", subtitle: "7 dias grátis, sem cartão de crédito." },
      { step: "2", title: "Crie sua conta", subtitle: "30 segundos. Só e-mail e senha." },
      { step: "3", title: "Responda o onboarding guiado", subtitle: "Perguntas diretas sobre seu negócio. Em média 15 minutos." },
      { step: "4", title: "Revise o preview gerado", subtitle: "Veja sua SmartBio montada antes de qualquer publicação." },
      { step: "5", title: "Aprove a publicação", subtitle: "Um clique. A plataforma publica automaticamente." },
      { step: "6", title: "Copie o link publicado", subtitle: "Cole na bio do Instagram. Pronto para receber visitas." }
    ]
  },
  blocks: [
    {
      title: "Você descreve, a SmartBio estrutura",
      description: "No onboarding guiado, você conta quem é, o que vende e para quem. A plataforma organiza tudo em ofertas, perguntas e regras."
    },
    {
      title: "Preview gerado, pronto para você aprovar",
      description: "Textos, estrutura e fluxo de recomendação montados automaticamente. Você revisa, aprova e publica — sem tocar em código."
    },
    {
      title: "Cada visitante recebe a recomendação certa",
      description: "Perguntas rápidas identificam o perfil e o sistema indica o melhor próximo passo para cada tipo de visitante."
    },
    {
      title: "Publicado, mensurável, sempre no ar",
      description: "Um link na bio, captura de leads, analytics de funil e seu painel de controle em tempo real."
    }
  ],
  demo: {
    title: "Veja como uma SmartBio é criada do zero",
    description: "Você responde o onboarding. A SmartBio monta a estrutura. Você aprova o preview. O link fica pronto para a bio. Do zero ao publicado em uma única sessão."
  },
  onboarding: {
    title: "Captura, estrutura e gera. Em minutos.",
    description: "A plataforma organiza suas informações em dados, ofertas e regras de recomendação. Tudo revisável antes da publicação.",
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
      id: "plan_solo",
      name: "Solo",
      price: "97",
      priceAnnual: "77",
      description: "Para profissionais e marcas com uma operação.",
      priceLabel: "97",
      currency: "R$",
      features: ["1 SmartBio publicada", "Até 5 ofertas", "Quiz de diagnóstico", "Recomendação personalizada", "Preview antes da publicação", "Leads com histórico de 60 dias", "Analytics de funil", "Meta Pixel, GA4 e GTM integrados"]
    },
    {
      id: "plan_agencia",
      name: "Agência",
      price: "247",
      priceAnnual: "197",
      description: "Para agências e profissionais que gerenciam múltiplos clientes.",
      priceLabel: "247",
      currency: "R$",
      features: ["Até 20 SmartBios publicadas", "Ofertas ilimitadas", "Quiz sem limite de perguntas", "Histórico de leads sem limite", "Analytics completo com exportação", "Meta Pixel, GA4 e GTM por SmartBio", "Domínio próprio (em breve)", "Suporte prioritário"],
      highlighted: true
    }
  ],
  faq: {
    title: "Perguntas Frequentes",
    items: [
      {
        question: "A SmartBio é só mais um link na bio?",
        answer: "Não é um Linktree ou lista de botões. A SmartBio é uma jornada de conversão: o visitante responde perguntas rápidas e recebe a recomendação certa para o perfil dele."
      },
      {
        question: "Quanto tempo leva para publicar?",
        answer: "Em média 20 a 30 minutos de onboarding. Depois é só aprovar o preview e copiar o link pronto."
      },
      {
        question: "Quem publica a página?",
        answer: "A SmartBio publica automaticamente após a sua aprovação do preview. Você não precisa configurar hospedagem nem mexer em código."
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
        answer: "Sim. O fluxo exige que você revise e aprove o preview antes da plataforma publicar no seu slug público."
      },
      {
        question: "Onde coloco o link publicado?",
        answer: "Na bio do Instagram, TikTok, YouTube, LinkedIn — ou em qualquer campanha de tráfego pago."
      },
      {
        question: "A SmartBio funciona com Meta Pixel e GA4?",
        answer: "Sim. Você cola o ID do Meta Pixel, GA4 ou GTM nas configurações — sem código. A SmartBio injeta os scripts automaticamente e dispara os eventos certos em cada etapa: visualização, início do quiz, lead capturado e clique no CTA."
      },
      {
        question: "Posso usar WhatsApp, agenda, formulário ou checkout?",
        answer: "Sim. A etapa final da recomendação pode direcionar o lead para qualquer um desses destinos de conversão."
      }
    ]
  },
  footer: {
    cta: "Sua próxima cliente pode estar chegando pela bio amanhã.",
    ctaButton: "Começar agora",
    links: ["Termos", "Privacidade", "Suporte"]
  },
  mockBio: {
    name: "Talita Pinheiro",
    bio: "Consultora de negócios para e-commerce. Ajudo marcas a venderem mais pelo Instagram."
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
    id: 'plan_solo',
    name: 'Solo',
    description: 'Para profissionais e marcas com uma operação.',
    priceLabel: 'R$97',
    currency: 'BRL',
    features: ['1 SmartBio publicada', 'Até 5 ofertas', 'Quiz de diagnóstico', 'Recomendação personalizada', 'Preview antes da publicação', 'Leads com histórico de 60 dias', 'Analytics de funil'],
    stripePriceId: 'price_solo_test',
  },
  {
    id: 'plan_agencia',
    name: 'Agência',
    description: 'Para agências e profissionais que gerenciam múltiplos clientes.',
    priceLabel: 'R$247',
    currency: 'BRL',
    features: ['Até 20 SmartBios publicadas', 'Ofertas ilimitadas', 'Quiz sem limite de perguntas', 'Histórico de leads sem limite', 'Analytics completo com exportação', 'Domínio próprio (em breve)', 'Suporte prioritário'],
    stripePriceId: 'price_agencia_test',
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
  planId: 'plan_solo',
  planName: 'Solo',
  status: 'active', // active, past_due, canceled
};

export const mockOffers: Offer[] = [
  {
    id: 'off_01',
    tenantId: 'tnt_01',
    title: 'Consulta de Diagnóstico',
    description: 'Sessão estratégica para identificar o caminho certo para o seu resultado.',
    url: 'https://cal.com/exemplo/consulta',
    price: 150,
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    objective: 'Agendamento de consultoria',
    targetPain: 'Não saber por onde começar',
    idealAudience: 'Quem está no início e quer direção clara',
    maturityLevel: 'Intermediário',
    format: 'consultoria',
    recommendedCta: 'agenda',
    ctaDestination: 'https://cal.com/exemplo/consulta',
    status: 'active',
    isConnectedToRule: true
  },
  {
    id: 'off_02',
    tenantId: 'tnt_01',
    title: 'Guia Gratuito de Primeiros Passos',
    description: 'Material exclusivo com os 5 erros mais comuns — e como corrigir agora.',
    url: 'https://exemplo.com/guia',
    price: 0,
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    objective: 'Captação de leads',
    targetPain: 'Não saber por onde começar',
    idealAudience: 'Iniciantes que querem resultado sem investimento inicial',
    maturityLevel: 'Iniciante',
    format: 'produto_digital',
    recommendedCta: 'formulario',
    ctaDestination: 'https://exemplo.com/guia',
    status: 'active',
    isConnectedToRule: true
  },
  {
    id: 'off_03',
    tenantId: 'tnt_01',
    title: 'Acompanhamento VIP',
    description: 'Mentoria mensal com acesso direto à equipe e plano personalizado.',
    url: 'https://wa.me/5511999999999',
    price: 1000,
    isActive: false,
    order: 3,
    createdAt: new Date().toISOString(),
    objective: 'Venda high-ticket',
    targetPain: 'Precisar de acompanhamento próximo para escalar',
    idealAudience: 'Quem já vende e quer crescer com suporte especializado',
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
  tenantName: 'Studio Exemplo',
  title: 'Studio Exemplo',
  bio: 'Ajudamos você a conquistar resultados reais com método personalizado e acompanhamento próximo.',
  theme: 'light',
  avatarUrl: null,
  socialLinks: {},
  offers: mockOffers,
  quizQuestions: mockQuizQuestions
};

