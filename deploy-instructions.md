Deploy to Vercel (quick)

1) Create a Vercel account at https://vercel.com and connect your GitHub account.
2) Import the repository or push code (see README for git push steps).
3) Build settings: Framework: Vite (auto-detected). Build command: npm run build. Output directory: dist
4) Add domain: shopelgato (or add a purchased domain). Follow Vercel DNS steps.

Forms & requests:
- Easiest: use Formspree or Vercel Forms to collect requests via email.
- Optional: Vercel Postgres or Vercel KV for storage (requires env vars and a small serverless API).

Notes for non-technical owners:
- I can deploy for you if you provide GitHub PAT and confirm the GitHub repo name and visibility.
- After deploy, share the Vercel project link and domain to test ordering workflow.