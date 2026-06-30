import { Plan, User, Tenant, SmartBio, Offer } from '../types';

export const landingData = {
  hero: {
    title: "Crie uma bio inteligente com IA, aprove o preview e publique em minutos.",
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
      items: ["Onboarding guiado por IA", "Página gerada automaticamente", "Visitante responde perguntas", "Recomendação clara", "CTA certo no final"]
    }
  },
  howItWorks: {
    title: "Como funciona a SmartBio?",
    subtitle: "Você não monta uma lista de links. Você responde um onboarding e a plataforma gera uma experiência de conversão.",
    steps: [
      { step: "1", title: "Escolha o plano" },
      { step: "2", title: "Crie sua conta" },
      { step: "3", title: "Responda o onboarding com IA" },
      { step: "4", title: "Revise o preview gerado" },
      { step: "5", title: "Aprove a publicação" },
      { step: "6", title: "Copie o link publicado" }
    ]
  },
  blocks: [
    {
      title: "Você responde o onboarding",
      description: "A IA coleta contexto, ofertas, público e objetivo do seu negócio."
    },
    {
      title: "A IA estrutura sua SmartBio",
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
    description: "O cliente aprova. A SmartBio publica. O link fica pronto para copiar. Tudo gerado automaticamente pela nossa IA baseada no seu onboarding."
  },
  onboarding: {
    title: "Captura, estrutura e gera. Em minutos.",
    description: "A IA sugere estrutura, copy, perguntas e CTAs. A SmartBio organiza tudo em dados, ofertas e regras revisáveis antes da publicação.",
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
      price: "[PRICE_ESSENTIAL]",
      currency: "R$",
      features: ["SmartBio publicada em slug", "Perfil público e links sociais", "CTA principal", "Leads básicos", "Analytics básico"]
    },
    {
      id: "plan_intelligent",
      name: "Inteligente",
      description: "Para negócios em crescimento",
      price: "[PRICE_INTELLIGENT]",
      currency: "R$",
      features: ["Tudo do Essencial", "Onboarding assistido por IA", "Quiz de diagnóstico", "Recomendação por regras", "Preview antes da publicação", "Leads qualificados"]
    },
    {
      id: "plan_premium",
      name: "Premium",
      description: "Para agências e grandes marcas",
      price: "[PRICE_PREMIUM]",
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
        answer: "Não. Você apenas responde ao onboarding guiado por IA, aprova o resultado e copia o link final."
      },
      {
        question: "A IA decide tudo sozinha?",
        answer: "A IA sugere a estrutura, textos e regras para acelerar o processo, mas tudo é 100% revisável por você antes da aprovação e publicação."
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
  email: 'admin@smartbio.io',
  fullName: 'Admin User',
  avatarUrl: 'https://i.pravatar.cc/150?u=admin@smartbio.io',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockPlans: Plan[] = [
  {
    id: 'plan_starter',
    name: 'Starter',
    description: 'Perfect for creators starting out',
    price: 9,
    currency: 'USD',
    features: ['1 SmartBio', 'Basic Analytics', 'Standard Support'],
    stripePriceId: 'price_starter_test',
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    description: 'For growing businesses and agencies',
    price: 29,
    currency: 'USD',
    features: ['Unlimited SmartBios', 'Advanced AI Onboarding', 'Priority Support', 'Custom Domains'],
    stripePriceId: 'price_pro_test',
  },
];

export const mockTenant: Tenant = {
  id: 'tnt_01',
  userId: 'usr_01',
  name: 'My Awesome Brand',
  slug: 'awesome-brand',
  planId: 'plan_pro',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockSmartBio: SmartBio = {
  id: 'bio_01',
  tenantId: 'tnt_01',
  title: 'Awesome Brand Official Links',
  bio: 'Welcome to our official link page. Discover our products and services!',
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
      subtitle: "Comece o onboarding e gere sua primeira SmartBio com IA.",
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
        generating: "Gerando com IA...",
        viewPreview: "Ver preview completo",
        copyLink: "Copiar link publicado",
      },
      badges: {
        onboarding_pending: "Onboarding pendente",
        generating: "Gerando com IA",
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
  { step: 3, title: 'Onboarding IA', status: 'complete' },
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
    title: 'Book a Consultation',
    description: '1-on-1 Strategy Session',
    url: 'https://cal.com/awesome-brand',
    price: 150,
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'off_02',
    tenantId: 'tnt_01',
    title: 'Download Ultimate Guide',
    description: 'Free PDF Guide to scale your brand',
    url: 'https://awesome-brand.com/guide',
    price: 0,
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
];
