<h1 align="center">
    <img alt="project" title="#About" src="./public/assets/images/dashboard.png" />
</h1>

<h1 align="center">
  <a href="#"> Notifier </a>
</h1>

<p align="center">
  <img alt="Stars" src="https://img.shields.io/github/stars/roberpili/notifier-front">
  <a href="https://github.com/roberpili/notifier-front">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/roberpili/notifier-front">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen">
</p>

<p align="center">
 <a href="#about">About</a> •
 <a href="#how-it-works">How it works</a> • 
 <a href="#tech-stack">Tech Stack</a> •  
 <a href="#user-content-license">License</a>
</p>

## About

Frontend for the payment notification system

## How it works

The project is divided into two parts:

1. Backend (another repo)
2. Frontend (this repo)

But this repository is referring only to the Frontend part. Frontend need the Backend to be running to work.

> **Port conflict:** the backend base URL is hardcoded to `http://localhost:3000` in
> [`src/services/payment.ts`](./src/services/payment.ts). Since the Next.js dev server
> also defaults to port `3000`, run the frontend on a different port:
>
> ```bash
> $ bun run dev --port 3001
> ```

### Pre-requisites

Before you begin, you will need to have the following tools installed on your machine:
[Git](https://git-scm.com), [Bun](https://bun.com/).

#### Running the web application (Frontend)

```bash
$ git clone https://github.com/roberpili/notifier-front.git
$ cd notifier-front
$ bun install
$ bun run dev --port 3001
# The application will open on the port: 3001 - go to http://localhost:3001
```

#### Production build (Frontend)

```bash
$ bun run build
$ bun run start
```

## Architecture

This is a Next.js App Router application. Data flows one way:

```text
page / component -> server action -> service -> backend
```

| Location          | Responsibility                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| `src/app/`        | Routes. Server Components by default; `page.tsx` fetches data directly and `loading.tsx` shows pending   |
| `src/proxy.ts`    | Route guard. Redirects unauthenticated traffic away from `/dashboard` and `/payments`                    |
| `src/actions/`    | `"use server"` mutations. Read/write the session cookie, call a service, `revalidatePath`               |
| `src/services/`   | The only place that talks to the backend                                                                |
| `src/lib/`        | Pure, framework-free logic: session cookie helpers, form invariants, validation                           |
| `src/components/` | Presentational components. `"use client"` only where interactivity is required                            |

Authentication uses an httpOnly session cookie written by the login Server Action, so
server-side reads can authorize requests without any client-side state. There is no
client-side auth store and no `localStorage` usage.

## Tech Stack

The following tools were used in the construction of the project:

#### **Platform** ([Next.js](https://nextjs.org/) + [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/))

- **[Next.js App Router](https://nextjs.org/docs/app)** with Server Components, Server Actions and Proxy
- **[React 19](https://reactjs.org/)** (`useActionState`, `useReducer`)
- **[Prime Icons](https://www.npmjs.com/package/primeicons)**
- **[Tailwind CSS](https://tailwindcss.com/)**

## License

This project is under the license [MIT](./LICENSE).
