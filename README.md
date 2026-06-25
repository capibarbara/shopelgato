Shop El Gato — Local handcrafted team goods

Quick start (local):
1. Install Node.js (16+)
2. In a terminal: cd C:\Users\barbaraa\shopelgato
3. npm install
4. npm run dev

To deploy to Vercel:
- Create a Vercel account and import the repo (build: npm run build, output: dist)
- Follow deploy-instructions.md for forms and DB options

Files created:
- src/: React app
- brand-guide.md, business-plan.md, deploy-instructions.md: docs

If you want, provide a GitHub personal access token (repo scope) and I will push and create the GitHub repo for you.\n\n[deploy-trigger] Trigger redeploy by updating README\n[deploy-trigger-2]\n\n[ci] Update: switch to Supabase REST API\n[ci] admin & email features added\n[ci] add smtp envs\n[ci] redeploy to pick up ZAP webhook env var\n[ci] update: logo and copy\n[ci] add microsoft graph oauth endpoints
[ci] require email+phone on contact form
[ci] client validation & logo update
[ci] relax phone validation
[ci] fix phone validation syntax
[ci] fix phone newlines