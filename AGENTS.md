# AGENTS.md

## Project

This is a TypeScript React application currently built with Vite. The project is being migrated from React + Vite to Next.js.

The migration should preserve existing application behavior, routes, API contracts, authentication behavior, styling, and user-facing functionality unless explicitly requested otherwise.

The target architecture is Next.js using the App Router.

## Primary Migration Goals

1. Replace Vite with Next.js.
2. Migrate routing from `src/router.tsx` to the Next.js App Router.
3. Migrate route-level components from `src/pages/` to `app/`.
4. Preserve existing reusable components in `src/components/`.
5. Preserve service/API logic in `src/services/` unless Next.js-specific changes are required.
6. Preserve application state behavior in `src/store/`.
8. Preserve existing TypeScript types and domain models.
9. Remove React/Vite-specific infrastructure only after the equivalent Next.js implementation is working.
10. Keep the migration incremental and buildable. Do not perform a large rewrite without validating intermediate states.

## Current Structure

The existing application roughly follows:

```text
src/
├── App.tsx
├── App.css
├── components/
├── constants/
├── main.tsx
├── requireAuth.tsx
├── router.tsx
├── services/
├── store/
├── styles/
└── types/
```

Important existing responsibilities:

* `src/router.tsx` owns client-side routing.
* `src/requireAuth.tsx` protects authenticated routes.
* `src/components/` contains reusable UI and feature components.
* `src/services/` contains API/authentication operations.
* `src/store/` contains client-side application state.
* `src/types/` contains domain and external integration types.
* `src/constants/` contain static configuration.
* `src/main.tsx` is the Vite application entry point.
* `src/App.tsx` is the current application root.

## Target Next.js Structure

Prefer the following structure:

```text
.
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── payment/
│   │   ├── create/
│   │   │   └── page.tsx
│   │   ├── update/
│   │   │   └── page.tsx
│   │   └── delete/
│   │       └── page.tsx
│   └── terms-and-conditions/
│       └── page.tsx
├── components/
├── constants/
├── services/
├── styles/
├── store/
├── types/
├── public/
├── next.config.ts
├── tsconfig.json
├── eslint.config.js
├── package.json
└── Dockerfile
```

The exact route hierarchy should be determined from the existing router and page behavior. Do not invent routes merely because filenames suggest them.

If keeping application code under `src/` is preferable, use:

```text
src/
├── app/
├── components/
├── constants/
├── services/
├── store/
└── types/
```

Pick one convention and use it consistently. Do not create both `app/` and `src/app/`.

## Routing Migration

The existing `src/router.tsx` is the source of truth for current routes.

Before modifying routing:

1. Inspect `src/router.tsx`.
2. Inspect every component imported as a route.
3. Identify public routes.
4. Identify authenticated routes.
5. Identify route parameters and query parameters.
6. Identify redirects and fallback behavior.
7. Reproduce the same URL structure in the Next.js App Router.

Do not implement React Router inside Next.js unless there is a specific architectural requirement.

Use Next.js routing primitives:

* `app/**/page.tsx` for routes.
* `app/**/layout.tsx` for shared layouts.
* `not-found.tsx` for not-found handling where appropriate.
* `redirect()` for server-side redirects.
* `useRouter()` / `usePathname()` / `useSearchParams()` only in Client Components when necessary.
* `<Link>` for internal navigation.

Avoid manually manipulating `window.location` for normal application navigation.

## Server vs Client Components

Use Next.js Server Components by default.

Do NOT add `"use client"` globally or to every migrated component.

A component should be a Client Component only when it requires browser/client functionality such as:

* React state/effects.
* Event handlers.
* Browser APIs.
* Client-side stores.
* Client-only authentication SDKs.
* Client-only third-party libraries.

Keep static layouts, page composition, configuration, and server-compatible UI as Server Components whenever possible.

When a Client Component is required, put `"use client"` at the smallest appropriate boundary.

Example:

```tsx
"use client";

export function PaymentForm() {
  // client-side state and event handling
}
```

Do not convert an entire route to a Client Component merely because one nested component needs client-side behavior.

## Existing Components

Preserve `src/components/` or move it to the selected top-level `components/` location.

Do not unnecessarily rewrite existing components during the migration.

Keep component APIs stable unless Next.js requires a change.

Avoid introducing a new UI framework, component library, CSS framework, or state-management library unless explicitly requested.

## Pages

Existing page components should be treated as route-level presentation/business composition.

Do not simply rename:

```text
src/pages/home_page.tsx
```

to:

```text
app/home_page/page.tsx
```

Instead map the component to the correct URL from the existing router.

For example:

```text
src/pages/home_page.tsx
```

may become:

```text
app/page.tsx
```

while:

```text
src/pages/login_page.tsx
```

may become:

```text
app/login/page.tsx
```

Use the actual existing route definitions as the authority.

If a page component contains substantial client-side logic, it may remain a Client Component initially. Optimize the server/client boundary later rather than complicating the migration.

## Authentication

Authentication is a critical migration area.

First inspect:

* `src/requireAuth.tsx`
* `src/store/authStore.ts`
* `src/services/login.ts`
* `src/services/auth_google.ts`
* `src/services/register.ts`
* any authentication-related hooks
* all routes that depend on authentication

Preserve the existing authentication semantics before attempting architectural improvements.

Do not blindly replace the current authentication system with NextAuth/Auth.js, middleware, server sessions, cookies, or another authentication mechanism unless explicitly requested.

If authentication currently depends on browser state or a client-side store, keep that behavior working during the initial migration.

If moving authentication to server-side protection later, do so as a separate deliberate change.

Never expose secrets or private credentials through `NEXT_PUBLIC_*` environment variables.

## State Management

Inspect `src/store/` before changing state management.

Current stores include:

```text
src/store/
├── authStore.ts
└── paymentStore.ts
```

Preserve the existing state-management library and semantics unless migration requirements explicitly call for a change.

Client-side stores generally require Client Components in Next.js.

Do not introduce global state solely because Next.js Server Components are being introduced.

Avoid duplicating state between:

* server data
* client stores
* component state

unless there is a clear reason.

## Services / API Layer

Preserve `services/` as the application boundary for backend/API operations.

Current services include:

```text
services/
├── auth_google.ts
├── login.ts
├── payment.ts
└── register.ts
```

Do not scatter API calls throughout components.

Prefer:

```text
component -> hook/action -> service -> API
```

over:

```text
component -> fetch(...)
```

Do not automatically convert existing API calls to Next.js Server Actions.

Server Actions should only be introduced when there is a concrete benefit and the resulting authentication/error/data-flow semantics are understood.

Be careful with code that accesses:

* `window`
* `document`
* `localStorage`
* `sessionStorage`
* browser-only authentication SDKs

Such code cannot execute in a Server Component.

## Data Fetching

During the initial migration, preserve existing data-fetching behavior unless it is incompatible with Next.js.

Do not perform a broad "Next.js optimization" at the same time as the framework migration.

Once functionality is preserved, server-side data fetching can be introduced selectively.

When using Next.js server-side fetching:

* understand caching behavior explicitly;
* do not assume every `fetch()` is uncached;
* use explicit revalidation/caching semantics where appropriate;
* avoid accidentally serving user-specific data from a shared cache.

User-specific payment or authentication data must not be cached/shared incorrectly.

## Environment Variables

Audit the existing environment variables before migration.

Use:

```text
NEXT_PUBLIC_*
```

only for values that are intentionally exposed to browser code.

Private secrets must remain server-only.

Do not rename environment variables unnecessarily. If renaming is required, update all references and document the change.

Search for:

```text
import.meta.env
```

and migrate appropriate usages to:

```text
process.env
```

Do not mechanically replace every environment variable with `NEXT_PUBLIC_*`.

## Assets

Existing static assets under:

```text
public/
```

should remain under `public/` unless there is a specific reason to move them.

Existing Vite references such as:

```text
import.meta.env.BASE_URL
```

or Vite-specific asset handling must be audited.

Use normal Next.js public asset paths where appropriate:

```tsx
<img src="/assets/images/example.png" />
```

or Next.js `<Image>` when its optimization behavior is desirable.

Do not replace every `<img>` blindly. Preserve behavior first.

## CSS

Preserve the current styling approach.

Inspect:

* `src/App.css`
* component-level CSS
* any imported stylesheets
* Vite-specific CSS behavior

Move global styles to the appropriate Next.js global stylesheet and import them from the root layout.

Do not introduce Tailwind or another styling system during the framework migration unless explicitly requested.

## Layouts

Existing `components/Layouts/` should be inspected before creating Next.js layouts.

Use Next.js `layout.tsx` when the layout is genuinely route-segment-wide and benefits from Next.js nested layouts.

Do not duplicate existing layout logic.

A typical root layout should own:

* `<html>`
* `<body>`
* global styles
* truly global providers

Feature-specific layouts should remain close to their route segment.

## Providers

If the application uses client-side providers, stores, or context, create a small dedicated client provider boundary.

For example:

```text
app/
├── layout.tsx
└── providers.tsx
```

Prefer:

```tsx
// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Keep `layout.tsx` server-compatible when possible.

## Vite Removal

After the Next.js application is working, remove Vite-specific infrastructure.

Candidates include:

```text
vite.config.ts
index.html
src/main.tsx
```

Also remove Vite-specific dependencies and configuration after verifying they are no longer used.

Do not delete these files at the beginning of the migration if they are still needed as references.

Inspect `package.json` and all imports before removing dependencies.

## Next.js Configuration

Use the current stable Next.js conventions supported by the project's installed Next.js version.

Prefer:

```text
next.config.ts
```

when TypeScript configuration is appropriate.

Do not add experimental Next.js flags unless required.

Keep configuration minimal.

## TypeScript

Preserve strictness and existing compiler guarantees.

Do not weaken TypeScript settings to make the migration compile.

Avoid introducing:

```ts
any
```

as a migration shortcut.

If an existing type is incorrect, fix the type at its source rather than suppressing the error.

Ensure path aliases continue to work after changing the project structure.

## Naming

Prefer idiomatic Next.js route names:

```text
app/login/page.tsx
app/register/page.tsx
app/dashboard/page.tsx
```

rather than:

```text
app/login_page.tsx
app/register_page.tsx
app/dashboard_page.tsx
```

Route directory names should represent URLs, not component implementation names.

Existing component naming conventions can remain unchanged unless there is a clear reason to normalize them.

## Error Handling

Preserve existing error behavior.

Do not silently swallow errors during migration.

For Next.js routes, consider:

```text
error.tsx
loading.tsx
not-found.tsx
```

where they provide meaningful behavior.

Do not add these files everywhere automatically.

## Docker / Deployment

Inspect the existing:

```text
Dockerfile
nginx.conf
```

before changing them.

A Next.js application does not need the same deployment architecture as a Vite SPA.

Determine whether the application will use:

* Next.js standalone output;
* a Node.js server;
* a managed Next.js platform;
* another existing deployment target.

Do not preserve an Nginx SPA configuration blindly if it depends on Vite's static SPA output.

The Docker image must run the actual Next.js production application.

## Package Management

The project currently contains:

```text
bun.lock
```

Use Bun consistently unless there is an explicit reason to migrate package managers.

Do not generate competing lockfiles such as:

```text
package-lock.json
yarn.lock
pnpm-lock.yaml
```

If Bun is retained, prefer:

```bash
bun install
bun run dev
bun run build
bun run start
```

Use the project's existing scripts where possible.

## Dependency Changes

Before adding a dependency:

1. Check whether the functionality already exists.
2. Check whether Next.js provides the required functionality.
3. Check whether an existing project dependency can solve the problem.
4. Avoid adding dependencies solely to make migration code easier.

Remove dependencies that become unused after the migration, but only after verifying there are no remaining imports.

## Migration Strategy

Work in these phases.

### Phase 1: Understand

Inspect:

```text
package.json
src/router.tsx
src/App.tsx
src/main.tsx
src/requireAuth.tsx
src/store/*
src/services/*
src/hooks/*
src/pages/*
src/components/*
```

Understand routing, authentication, state, API behavior, and styling before making structural changes.

### Phase 2: Establish Next.js

Add Next.js and the minimum required configuration.

Create the App Router root:

```text
app/layout.tsx
app/page.tsx
```

Make the application build successfully.

### Phase 3: Migrate Routes

Map every route from the old router to the App Router.

Verify:

* URLs
* redirects
* authentication requirements
* route parameters
* query parameters
* navigation
* 404 behavior

### Phase 4: Migrate Application Shell

Move the existing application shell, navbar, footer, layouts, providers, and global CSS into the appropriate Next.js boundaries.

### Phase 5: Migrate Client Behavior

Move client-side hooks, stores, forms, authentication SDK usage, and interactive components behind appropriate `"use client"` boundaries.

### Phase 6: Remove Vite

Once the Next.js application is functionally equivalent:

* remove Vite entry points;
* remove Vite configuration;
* remove Vite dependencies;
* remove obsolete SPA configuration;
* update Docker/deployment configuration;
* update README instructions.

### Phase 7: Validate

Run:

```bash
bun run lint
bun run build
```

Also manually verify all important routes and flows.

## Required Validation

Before considering the migration complete, verify at minimum:

### Public pages

* Home
* Login
* Register
* Terms and Conditions

### Authenticated pages

* Dashboard
* Create payment
* Update payment
* Delete payment

### Authentication

* unauthenticated access to protected routes
* authenticated access
* login
* logout, if present
* Google authentication, if present
* registration
* auth persistence/refresh behavior

### Payments

* fetching payments
* creating payments
* updating payments
* deleting payments
* validation
* loading states
* error states
* success/status messages

### UI

* navigation
* navbar
* footer
* forms
* responsive behavior
* images/assets
* global styles

## Important Rules for Agents

Do not perform a framework migration and a product rewrite simultaneously.

Do not change backend API contracts unless explicitly required.

Do not change authentication architecture merely because Next.js provides server-side authentication capabilities.

Do not replace the state-management solution merely because Next.js introduces Server Components.

Do not introduce Server Actions, middleware, React Server Components, caching, or server-side data fetching indiscriminately.

Do not add `"use client"` to every file.

Do not duplicate business logic between old and new implementations.

Do not leave two competing routing systems active after the migration is complete.

Do not keep dead Vite code after the Next.js migration has been validated.

Do not suppress TypeScript or ESLint errors just to complete the migration.

Do not use `any` as a migration escape hatch.

Do not make unrelated refactors while migrating.

Prefer small, independently verifiable changes.

After each major migration step, run the type checker, linter, and production build.

If a migration decision is ambiguous, inspect the existing implementation and preserve current behavior rather than inventing new behavior.

## Definition of Done

The migration is complete when:

1. Next.js is the application's runtime and build system.
2. The App Router owns all application routes.
3. Vite is no longer required.
4. Existing application functionality is preserved.
5. Authentication works correctly.
6. Payment CRUD flows work correctly.
7. Existing API contracts remain intact.
8. Client/server boundaries are intentional.
9. No unnecessary `"use client"` directives remain.
10. TypeScript passes without new unsafe suppressions.
11. ESLint passes.
12. The production Next.js build passes.
13. Docker/deployment configuration runs the Next.js application correctly.
14. README documentation reflects the new development and deployment workflow.
15. No obsolete Vite configuration or dependencies remain.
