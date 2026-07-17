# WC Almanac

Project setup in progress.

## Local development

Install dependencies and start Vite:

```sh
pnpm install
pnpm run dev
```

Create `.env.local` with the local API URL:

```env
VITE_ALMANAC_API=http://localhost:3000
```

AI-assisted development in this repository follows the code taste workflow documented in:

- `AGENTS.md`
- `docs/code-taste/README.md`
- `docs/code-taste/ai-agent-workflow.md`

## Netlify deployment

The frontend is hosted on Netlify. Its build settings are defined in
`netlify.toml`:

- Build command: `pnpm run build`
- Publish directory: `dist`
- SPA routes fall back to `index.html`

Add the production API URL in the Netlify site's environment variables:

```env
VITE_ALMANAC_API=https://api.wc-almanac.com
```

Trigger a new deployment after changing the variable. Vite embeds environment
variables during the build, and values prefixed with `VITE_` are exposed to the
browser, so they must not contain secrets.
