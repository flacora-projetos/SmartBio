// Supabase client placeholder
export const supabase = {
  auth: {},
  from: () => ({ select: () => ({}) }),
  storage: {},
};

// Stripe client placeholder
export const stripe = {
  checkout: { sessions: { create: () => ({}) } },
};

// OpenAI placeholder
export const openai = {
  chat: { completions: { create: () => ({}) } },
};

// Resend placeholder
export const resend = {
  emails: { send: () => ({}) },
};

// Upstash Redis placeholder
export const redis = {
  get: () => ({}),
  set: () => ({}),
};
