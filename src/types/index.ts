export type User = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Tenant = {
  id: string;
  userId: string;
  name: string;
  slug: string;
  planId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SmartBioStatus = 
  | "onboarding_pending"
  | "generating"
  | "preview_pending_approval"
  | "published";

export type SmartBio = {
  id: string;
  tenantId: string;
  title: string;
  bio: string | null;
  theme: 'light' | 'dark' | 'premium';
  status: SmartBioStatus;
  isPublished: boolean;
  publishedSlug: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Offer = {
  id: string;
  tenantId: string;
  title: string;
  description: string | null;
  url: string;
  price: number | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  // Novos campos para estruturação de ofertas (Etapa 4.3)
  objective?: string;
  targetPain?: string;
  idealAudience?: string;
  maturityLevel?: string;
  format?: 'consultoria' | 'mentoria' | 'produto_digital' | 'servico' | 'agenda' | 'diagnostico' | 'comunidade' | 'outro' | string;
  recommendedCta?: 'whatsapp' | 'agenda' | 'formulario' | 'checkout' | string;
  ctaDestination?: string;
  status?: 'active' | 'draft' | 'paused';
  isConnectedToRule?: boolean;
};

export type QuizQuestion = {
  id: string;
  tenantId: string;
  question: string;
  type: 'text' | 'choice' | 'multiple_choice';
  options: string[] | null;
  order: number;
  isRequired: boolean;
  intention?: string;
  status?: 'active' | 'draft' | 'paused';
};

export type RecommendationRule = {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  condition: string; // JSON logic or simple string rule
  offerId: string;
  recommendedOfferId?: string; // duplicate of offerId, but added just in case
  recommendationReason?: string;
  finalCta?: string;
  status?: 'active' | 'draft' | 'paused';
  isActive: boolean;
};

export type Lead = {
  id: string;
  tenantId: string;
  name: string | null;
  email: string;
  phone: string | null;
  answers: Record<string, any>; // JSON mapping question IDs to answers
  createdAt: string;
};

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'choice' | 'multiple_choice' | 'identity' | 'objective' | 'audience' | 'offers' | 'diagnostic' | 'conversion' | 'style' | 'review';
  options?: string[];
};

export type OnboardingAnswer = {
  stepId: string;
  answer: string | string[];
};

export type AiSuggestion = {
  id: string;
  type: 'bio' | 'offer' | 'quiz' | 'theme';
  content: string | Record<string, any>;
  isAccepted: boolean;
};

export type PublishState = {
  status: 'pending' | 'publishing' | 'published' | 'failed';
  publishedAt: string | null;
  publicUrl: string | null;
};

export type PreviewChecklistItem = {
  id: string;
  label: string;
  isComplete: boolean;
};

export type PublicSmartBioData = {
  tenantName: string;
  title: string;
  bio: string | null;
  theme: string;
  avatarUrl: string | null;
  socialLinks: Record<string, string>;
  offers: Offer[];
  quizQuestions: QuizQuestion[];
};

export type Plan = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  currency: string;
  features: string[];
  stripePriceId: string;
};
