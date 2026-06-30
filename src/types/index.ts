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
};

export type QuizQuestion = {
  id: string;
  tenantId: string;
  question: string;
  type: 'text' | 'choice' | 'multiple_choice';
  options: string[] | null;
  order: number;
  isRequired: boolean;
};

export type RecommendationRule = {
  id: string;
  tenantId: string;
  name: string;
  condition: string; // JSON logic or simple string rule
  offerId: string;
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

export type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  stripePriceId: string;
};
