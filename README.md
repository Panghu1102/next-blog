# Next.js Framework Starter

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/next-starter-template)

<!-- dash-content-start -->

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It's deployed on Cloudflare Workers as a [static website](https://developers.cloudflare.com/workers/static-assets/).

This template uses [OpenNext](https://opennext.js.org/) via the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare), which works by taking the Next.js build output and transforming it, so that it can run in Cloudflare Workers.

<!-- dash-content-end -->

Outside of this repo, you can start a new project with this template using [C3](https://developers.cloudflare.com/pages/get-started/c3/) (the `create-cloudflare` CLI):

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/next-starter-template
```

A live public deployment of this template is available at [https://next-starter-template.templates.workers.dev](https://next-starter-template.templates.workers.dev)

## Getting Started

First, run:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then run the development server (using the package manager of your choice):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Deploying To Production

| Command                           | Action                                       |
| :-------------------------------- | :------------------------------------------- |
| `npm run build`                   | Build your production site                   |
| `npm run preview`                 | Preview your build locally, before deploying |
| `npm run build && npm run deploy` | Deploy your production site to Cloudflare    |
| `npm wrangler tail`               | View real-time logs for all Workers          |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Payload CMS on Cloudflare D1

Payload is integrated into the existing App Router without changing the public, locale-prefixed blog routes. The admin application is available at `/admin`; it has its own `(payload)` route group so it is not handled by the `next-intl` middleware. The existing `posts/` Markdown files and their generated frontend data remain the public-blog source during this reversible first phase.

### Required Cloudflare setup

The Worker requires a D1 binding named **`blogcms`** and a Worker secret named **`PAYLOAD_SECRET`**. No database ID or secret is committed to this repository.

```bash
npx wrangler d1 create next-blog-cms
```

Copy the returned `database_id` into the commented `d1_databases` entry in `wrangler.jsonc`, then uncomment that array. The resulting binding must remain named `blogcms`. Generate the binding types after updating Wrangler configuration:

```bash
npm run cf-typegen
npx wrangler secret put PAYLOAD_SECRET
```

For local development, copy `.dev.vars.example` to `.dev.vars`, generate a unique value with `openssl rand -base64 48`, and keep the file untracked. OpenNext/Wrangler then provides a local D1 binding; do not point ordinary development at the production database.

### Payload workflow

Payload's initial first-user flow at `/admin` creates the first administrator. The `users` collection enables Payload authentication. The `posts` collection maps the existing Markdown metadata: `title`, `description`, `date` (`publishedAt`), `categories`, and `tags`, plus status, pinned, Lexical content, and optional SEO fields. Markdown has intentionally not been deleted or imported automatically.

```bash
# Install the declared dependencies, then generate Payload artifacts.
npm install
npm run payload:generate:types
npm run payload:generate:importmap

# Review the generated migration before applying it.
npm run payload:migrate:create
npm run payload:migrate

# Existing application checks and OpenNext workflow.
npm run lint
npx tsc --noEmit
npm run build
npm run preview
npm run deploy
```

Run migrations only against the intended environment after reviewing the generated migration. `wrangler d1 list` and remote deployment require an authenticated `CLOUDFLARE_API_TOKEN`; do not commit it. Before a full frontend cutover, use a deterministic import script to map every Markdown slug and verify titles, dates, categories, tags, and rendered content in D1.
