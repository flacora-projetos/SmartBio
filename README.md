# SmartBio - Aplicação

Este repositório contém a primeira versão da interface da SmartBio gerada no AI Studio/Gemini.

A SmartBio é um SaaS para criação, aprovação e publicação de páginas públicas de bio inteligente com apoio de IA. O produto não é uma lista de links, não é um Linktree melhorado e não é uma bio avulsa feita manualmente. A plataforma guia o cliente, gera a página, mostra preview, recebe aprovação e publica automaticamente em um slug público.

## Fluxo principal do produto

```text
Landing -> Plano -> Pagamento -> Conta -> Onboarding IA ->
Geração da SmartBio -> Preview -> Aprovação ->
Publicação automática pelo SaaS -> Link pronto para copiar
```

O cliente aprova. A SmartBio publica. O cliente copia o link publicado e coloca na bio das redes sociais.

## Estado atual da aplicação

O projeto clonado atualmente é uma aplicação Vite/React, não Next.js.

Stack observada:

- Vite;
- React;
- TypeScript;
- Tailwind CSS;
- react-router-dom;
- lucide-react;
- shadcn/ui ou componentes compatíveis;
- motion;
- estrutura de mocks em `src/data/mock.ts`;
- tipos em `src/types/index.ts`.

Arquivos principais:

```text
vercel.json
index.html
src/App.tsx
src/main.tsx
src/index.css
src/data/mock.ts
src/types/index.ts
src/pages/Landing.tsx
src/pages/auth/Login.tsx
src/pages/auth/Signup.tsx
src/pages/auth/ForgotPassword.tsx
src/pages/dashboard/Overview.tsx
src/pages/dashboard/Onboarding.tsx
src/pages/dashboard/Offers.tsx
src/pages/dashboard/Quiz.tsx
src/pages/dashboard/Preview.tsx
src/pages/public/SmartBioPage.tsx
src/components/landing/
src/components/auth/
src/components/dashboard/
src/components/onboarding/
src/components/public/
components/ui/
```

## Rotas atuais

As rotas estão configuradas em `src/App.tsx` com `react-router-dom`.

Rotas existentes:

```text
/
/login
/signup
/forgot-password
/app
/app/onboarding
/app/preview
/s/:slug
```

Observações:

- `/` renderiza a landing comercial.
- `/login`, `/signup` e `/forgot-password` renderizam telas de autenticação.
- `/app` renderiza a visão geral do dashboard.
- `/app/onboarding` renderiza a tela real de onboarding IA.
- `/app/offers` renderiza a tela real de ofertas.
- `/app/quiz` renderiza a tela real de quiz e recomendação.
- `/app/preview` renderiza a tela real de preview, aprovação e publicação simulada.
- `/s/:slug` renderiza a página pública da SmartBio.

## Landing comercial

A landing está em:

```text
src/pages/Landing.tsx
```

Componentes usados:

```text
LandingNavbar
LandingHero
ProblemComparison
HowItWorks
ConversionBlocks
SmartBioCreationDemo
AiOnboardingSection
RecommendationToConversionSection
PricingCards
FAQ
FinalCTA
Footer
```

O objetivo da landing é explicar que a SmartBio é uma plataforma que:

- guia o cliente por onboarding com IA;
- organiza ofertas;
- gera uma página pública inteligente;
- mostra preview;
- publica após aprovação;
- entrega um link pronto para uso nas redes sociais.

## Autenticação

Telas criadas:

```text
src/pages/auth/Login.tsx
src/pages/auth/Signup.tsx
src/pages/auth/ForgotPassword.tsx
src/components/auth/AuthLayout.tsx
```

As telas já possuem integração inicial com Supabase Auth.

Integrações implementadas:

- login com Supabase;
- cadastro com Supabase;
- recuperação de senha;
- leitura de sessão;
- proteção de rotas internas;
- logout;
- criação/garantia de tenant inicial após autenticação.

Integrações futuras:

- persistência real das telas internas;
- fluxos avançados de confirmação e troca de senha.

## Dashboard interno

Tela principal:

```text
src/pages/dashboard/Overview.tsx
```

Layout:

```text
src/components/dashboard/DashboardLayout.tsx
```

O dashboard funciona como central de progresso da SmartBio, não como dashboard genérico de links.

Elementos atuais:

- status da SmartBio;
- ação recomendada conforme status;
- fluxo visual de criação;
- preview da SmartBio;
- estado do link público;
- métricas secundárias;
- plano atual.

Fluxo visual exibido:

1. Plano contratado;
2. Conta criada;
3. Onboarding IA;
4. Ofertas estruturadas;
5. Quiz configurado;
6. Preview gerado;
7. Aprovação do cliente;
8. Publicação automática;
9. Link pronto para copiar.

Essa sequência está correta e deve ser preservada.

### Correção de pipeline real após cadastro

Pagamento está pausado nesta fase. Ninguém deve ser conduzido para compra ou cobrança enquanto o fluxo principal do produto não estiver confiável.

Fluxo correto para conta nova:

1. Cliente cria conta.
2. SaaS cria ou recupera o tenant do usuário no Supabase.
3. SaaS cria uma SmartBio em rascunho quando ainda não existe.
4. Dashboard mostra status de onboarding pendente.
5. Cliente completa o onboarding guiado.
6. SaaS gera uma base inicial de preview e grava SmartBio, oferta, pergunta e regra no Supabase.
7. Preview só permite aprovação quando houver identidade, oferta ativa, pergunta ativa, regra ativa e preview gerado.
8. Ao aprovar, o SaaS altera a SmartBio real para publicada.
9. O link público é liberado somente depois da publicação.

Mudanças implementadas para remover o salto indevido para aprovação:

- `src/lib/smartbio-flow.ts` centraliza leitura, criação de rascunho, verificação de prontidão, geração inicial e publicação da SmartBio.
- `src/pages/dashboard/Overview.tsx` deixou de usar `mockSmartBio.status` para decidir a próxima ação.
- `src/pages/dashboard/Preview.tsx` bloqueia aprovação quando o fluxo real não está completo.
- `src/pages/dashboard/Onboarding.tsx` grava uma primeira base de preview no Supabase antes de navegar para aprovação.
- `src/components/dashboard/PublishApprovalPanel.tsx` recebeu bloqueio explícito de aprovação.

Observação técnica: a geração atual ainda não é IA definitiva. Ela cria uma base inicial revisável para validar o pipeline. A IA real deve entrar por backend seguro, preferencialmente Supabase Edge Function, porque a chave da OpenAI não pode ir para o frontend Vite.

### Onboarding com persistência real

O onboarding deixou de ser apenas navegação visual. A tela `/app/onboarding` agora mantém um objeto de respostas do cliente durante o fluxo e envia essas respostas para o Supabase ao gerar o preview.

Dados coletados nesta etapa:

- nome da marca ou profissional;
- bio curta;
- nicho ou posicionamento;
- objetivo principal;
- público ideal;
- principal dor do visitante;
- oferta principal;
- descrição da oferta;
- título do diagnóstico;
- primeira pergunta do diagnóstico;
- opções de resposta;
- destino do CTA;
- texto do botão;
- mensagem ou destino do CTA;
- tema visual;
- cor de destaque.

Ao finalizar o onboarding, a aplicação:

1. grava respostas em `onboarding_answers`;
2. atualiza a SmartBio com título, bio curta, configuração pública e tema;
3. cria ou atualiza a oferta principal;
4. cria ou atualiza a primeira pergunta do diagnóstico;
5. cria ou atualiza a primeira regra de recomendação;
6. muda a SmartBio para `preview_pending_approval`;
7. libera a ida para `/app/preview`.

Importante: nenhuma chamada de IA real foi feita nesta etapa. A geração ainda é determinística e barata para validar o pipeline sem gastar tokens. A IA real será plugada depois, com chamadas pequenas e limite de tokens.

## Onboarding IA

Tela:

```text
src/pages/dashboard/Onboarding.tsx
```

Componentes relacionados:

```text
src/components/onboarding/OnboardingStepper.tsx
src/components/onboarding/AiSuggestionsPanel.tsx
src/components/dashboard/SmartBioPreviewMock.tsx
```

A tela implementa o fluxo guiado em 8 etapas:

1. Identidade;
2. Objetivo;
3. Público;
4. Ofertas;
5. Diagnóstico;
6. Conversão;
7. Estilo;
8. Revisão.

Ela usa sugestões simuladas da IA e preview mobile para demonstrar como a SmartBio será preenchida durante o processo.

## Ofertas

Tela:

```text
src/pages/dashboard/Offers.tsx
```

Componentes relacionados:

```text
src/components/dashboard/OffersSummaryCards.tsx
src/components/dashboard/OffersTable.tsx
src/components/dashboard/OfferFormPanel.tsx
src/components/dashboard/OfferStatusBadge.tsx
src/components/dashboard/OfferRecommendationUsage.tsx
```

A tela estrutura ofertas como insumos comerciais para recomendação. Ela não deve ser tratada como lista de links.

Campos adicionados ao tipo `Offer`:

- objetivo;
- dor que resolve;
- público ideal;
- nível de maturidade;
- formato;
- CTA recomendado;
- destino do CTA;
- status;
- conexão com regra de recomendação.

## Quiz e recomendação

Tela:

```text
src/pages/dashboard/Quiz.tsx
```

Componentes relacionados:

```text
src/components/dashboard/QuizSummaryCards.tsx
src/components/dashboard/QuestionList.tsx
src/components/dashboard/QuestionEditor.tsx
src/components/dashboard/QuestionStatusBadge.tsx
src/components/dashboard/RecommendationRulesPanel.tsx
src/components/dashboard/RecommendationPreview.tsx
src/components/dashboard/RecommendationLogicExplainer.tsx
src/components/dashboard/RuleStatusBadge.tsx
```

A tela mostra perguntas, opções, regras e prévia da recomendação. As regras se conectam às ofertas por identificador e deixam explícito que a recomendação é revisável e explicável.

## Preview e aprovação

Tela:

```text
src/pages/dashboard/Preview.tsx
```

Componentes relacionados:

```text
src/components/dashboard/PublishChecklist.tsx
src/components/dashboard/PublishApprovalPanel.tsx
src/components/dashboard/PreviewSummary.tsx
```

A tela permite revisar a SmartBio gerada, validar checklist de prontidão e simular a aprovação/publicação.

Fluxo simulado:

1. Estado inicial: aguardando aprovação;
2. Cliente clica em “Aprovar e publicar”;
3. Interface mostra estado publicando;
4. Após simulação, estado muda para publicada;
5. URL pública é revelada;
6. botões “Copiar link publicado” e “Abrir SmartBio pública” ficam disponíveis.

Regra preservada: o cliente aprova, o SaaS publica.

## Página pública

Tela:

```text
src/pages/public/SmartBioPage.tsx
```

Componentes relacionados:

```text
src/components/public/PublicSmartBioHeader.tsx
src/components/public/QuizFlowMock.tsx
src/components/public/RecommendationResult.tsx
```

A rota `/s/:slug` representa a SmartBio publicada pelo SaaS.

Fluxo do visitante:

1. Estado inicial com identidade, bio curta e CTA para diagnóstico;
2. Fluxo de perguntas uma por tela;
3. Resultado com recomendação personalizada;
4. CTA final conforme configuração mockada.

A página é mobile-first, centralizada no desktop e não usa `DashboardLayout`.

## Dados e mocks

Arquivo principal:

```text
src/data/mock.ts
```

Dados já centralizados:

- conteúdo da landing;
- perguntas frequentes;
- planos da landing;
- mock da SmartBio;
- dados do dashboard;
- métricas;
- etapas do fluxo;
- assinatura mockada;
- ofertas mockadas.

Tipos:

```text
src/types/index.ts
```

Tipos existentes:

- `User`;
- `Tenant`;
- `SmartBioStatus`;
- `SmartBio`;
- `Offer`;
- `QuizQuestion`;
- `RecommendationRule`;
- `Lead`;
- `Plan`.

## Banco de dados

Foi criada e aplicada a migration inicial:

```text
supabase/migrations/20260630123000_initial_schema.sql
```

Tabelas criadas:

```text
profiles
tenants
tenant_members
subscriptions
smartbios
offers
quiz_questions
recommendation_rules
leads
analytics_events
ai_generations
```

Tabela adicionada na segunda migration:

```text
onboarding_answers
```

Migration aplicada:

```text
supabase/migrations/20260630143000_onboarding_answers.sql
```

Responsabilidade da tabela:

- guardar respostas do onboarding por tenant, SmartBio e etapa;
- permitir retomar e auditar a origem do preview;
- separar dados coletados do cliente da SmartBio já gerada.

Também foram criados:

- tipos enum para status e papéis;
- função `set_updated_at`;
- gatilho de criação de perfil a partir de `auth.users`;
- função `is_tenant_member`;
- políticas de RLS iniciais;
- índices básicos por tenant.

Validação executada:

- migration aplicada no banco remoto Supabase;
- consulta de contagem nas principais tabelas via service role;
- todas as tabelas responderam com sucesso.

## Sessão e tenant

Arquivos adicionados:

```text
src/contexts/AuthContext.tsx
src/components/auth/ProtectedRoute.tsx
src/lib/tenant.ts
```

Responsabilidades:

- carregar sessão atual do Supabase;
- ouvir mudanças de autenticação;
- proteger rotas internas `/app/*`;
- redirecionar usuário não autenticado para `/login`;
- criar tenant inicial quando o usuário autenticado ainda não possui workspace;
- exibir usuário, tenant e logout no `DashboardLayout`.

### Correções já realizadas pelo Gemini

Segundo a última atualização do Gemini, os seguintes ajustes foram concluídos:

- remoção de termos antigos em inglês na interface e nos mocks;
- troca de `Admin User`, `My Awesome Brand`, `Starter`, `Pro` e equivalentes por placeholders em português;
- padronização de `mockUser` com `[NOME_USUARIO]` e e-mail placeholder;
- padronização de `mockTenant` com `[NOME_DA_MARCA]` e slug `minha-smartbio`;
- substituição de planos antigos por `Essencial`, `Inteligente` e `Premium`;
- remoção de valores em dólar dos planos;
- uso de placeholders de preço, como `[PRICE_ESSENTIAL]`;
- alteração do tipo `Plan`, substituindo `price` por `priceLabel`;
- atualização de `PricingCards.tsx` para usar `priceLabel`;
- troca de URL hardcoded `awesome-brand` por referência a `mockTenant.slug`;
- adaptação de `mockOffers` para placeholders em português, como `[OFERTA_PRINCIPAL]`;
- manutenção do conceito de gerador de conversão, não gerenciador de links.

## Pendências técnicas observadas

Estas pendências devem ser validadas no código atualizado após o commit das correções do Gemini.

### 1. Stack diferente da recomendada

A recomendação original do projeto era Next.js com App Router. O código atual está em Vite com `react-router-dom`.

Decisão pendente:

- manter Vite para acelerar MVP visual;
- ou migrar para Next.js antes de integrar Supabase, Stripe e publicação por slug.

### 2. README original estava em inglês

O README foi substituído por esta documentação em português BR.

### 3. Deploy de rotas SPA na Vercel

O projeto usa Vite com `react-router-dom`. Para suportar acesso direto a rotas internas na Vercel, foi criado:

```text
vercel.json
```

Configuração:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Status: corrigido e validado em produção.

### 4. Rotas internas ainda pendentes

Ainda faltam telas reais para:

```text
/app/leads
/app/analytics
/app/billing
/app/settings
```

### 5. Integrações ainda não existem

Ainda não há integração real com:

- Stripe;
- IA;
- Sentry;
- Upstash;
- Resend.

Integração Supabase iniciada:

- cliente Supabase criado em `src/lib/supabase.ts`;
- login/cadastro/recuperação conectados ao Supabase Auth;
- migration inicial aplicada no banco remoto.

### 6. Aviso de build CSS

O aviso sobre a posição do `@import` de fontes foi corrigido movendo o import do Google Fonts para a primeira linha de:

```text
src/index.css
```

Status: corrigido. O build local passou sem o aviso anterior.

### 7. Metadata herdada do AI Studio

O arquivo `index.html` foi corrigido:

```text
<html lang="pt-BR">
<title>SmartBio</title>
```

Status: corrigido.

## Próximas etapas recomendadas

1. Conectar tela de Ofertas a CRUD real no Supabase.
2. Conectar tela de Quiz e Recomendação a CRUD real no Supabase.
3. Fazer `/s/:slug` buscar dados reais da SmartBio publicada.
4. Criar Supabase Edge Function para IA com prompts curtos e limite de tokens.
5. Criar rotas reais de leads e analytics.
6. Só depois retomar Stripe e cobrança.

## Verificação local

Após sincronizar o repositório até o commit `9881163`, foram executados:

```bash
npm install
npm run lint
npm run build
```

Resultado:

- dependências instaladas com sucesso;
- `npm run lint` passou;
- `npm run build` passou;
- nenhuma vulnerabilidade foi encontrada no `npm install`;
- há apenas um aviso de CSS relacionado à posição do `@import` de fontes.

Também foi feita checagem básica da publicação:

```text
https://smart-bio-pi.vercel.app/
```

A raiz responde. A rota direta `/s/minha-smartbio` retornou 404 na Vercel, pendente de rewrite SPA.

Após o commit `a4c589c`, o rewrite foi adicionado em `vercel.json`.

Validação em produção concluída:

```text
https://smart-bio-pi.vercel.app/s/minha-smartbio
```

Resultado:

- HTTP 200;
- título HTML `SmartBio`;
- aplicação React carregada.

## Deploy

URL publicada:

```text
https://smart-bio-pi.vercel.app/
```

Status:

- landing publicada;
- aplicação SPA publicada;
- rota pública existe no código;
- rewrite de rotas SPA adicionado no código;
- acesso direto a `/s/minha-smartbio` validado em produção.

## Regras de produto

Estas regras não devem ser quebradas:

- a SmartBio não é um gerenciador de links;
- a página pública não deve parecer uma lista de botões;
- o cliente aprova, o SaaS publica;
- o link só é liberado após publicação;
- a IA ajuda a criar, mas tudo deve ser revisável;
- a recomendação deve ser explicável;
- analytics é consequência, não o centro do produto;
- toda interface visível ao usuário deve estar em português BR.

## Como rodar localmente

Pré-requisito:

- Node.js instalado.

Comandos:

```bash
npm install
npm run dev
```

O servidor local sobe na porta configurada pelo script:

```text
http://localhost:3000
```

## Variáveis de ambiente atuais

O arquivo `.env.example` foi atualizado para refletir as variáveis esperadas do SaaS:

```text
VITE_APP_URL
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
OPENAI_API_KEY
VITE_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_ESSENTIAL
STRIPE_PRICE_INTELLIGENT
STRIPE_PRICE_PREMIUM
RESEND_API_KEY
VITE_SENTRY_DSN
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Como o projeto atual está em Vite, variáveis públicas usam o prefixo `VITE_`.

## Credenciais locais

Existe um arquivo local chamado:

```text
credeciais.md
```

Esse arquivo contém credenciais sensíveis e não deve ser versionado. Ele foi adicionado ao `.gitignore`, junto com variações comuns de nome:

```text
credenciais.md
credeciais.md
credentials.md
secrets.md
```

As credenciais devem ser transferidas para variáveis de ambiente locais e para as variáveis do projeto na Vercel/Supabase conforme a integração for implementada. Nunca colar valores de chave em componentes React, mocks, README público ou arquivos versionados.

Um `.env.local` local foi criado a partir desse arquivo sem versionar segredos. Ele deve continuar fora do Git.
