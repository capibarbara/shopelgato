// Placeholder serverless endpoint. Recommended: use Formspree or Vercel Forms.
// This endpoint returns 501 and documents next steps to enable a functional endpoint.
export default function handler(req, res){
  res.status(501).json({
    message: 'Not configured. Use Formspree, Vercel Postgres or Vercel Forms. See deploy-instructions.md for setup.'
  })
}