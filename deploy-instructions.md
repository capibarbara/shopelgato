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
Vercel Postgres setup (quick):
1. In Vercel Dashboard, go to Integrations → Postgres and create a new Postgres database (Free tier available).
2. After provisioning, in the Vercel Project Settings > Integrations attach the Postgres instance to the shopelgato project so Vercel injects DATABASE_URL into the project env.
3. Run the migration SQL in the Vercel Postgres Console or using psql:
   - Console: open the database in Vercel and run the SQL in the SQL editor.
   - psql: connect using the DATABASE_URL and run migrations/001_create_submissions.sql
4. Deploy: Vercel will install @vercel/postgres during build. The serverless function /api/submit-postgres will be able to connect using the integration.
5. Update the site contact form to POST to /api/submit-postgres with JSON: { name, email, team, colors, quantity, notes }

Security notes:
- Keep the Postgres instance private; do not expose the DATABASE_URL publicly.
Email notifications and admin API:
- To enable email notifications on new submissions, add these environment variables in Vercel:
  - SENDGRID_API_KEY = <your SendGrid API key>
  - OWNER_EMAIL = <your email to receive notifications>
- To access the admin submissions list, set:
  - ADMIN_TOKEN = <secret string>
Then redeploy. Access admin UI at https://your-site/admin and enter the ADMIN_TOKEN to view submissions.