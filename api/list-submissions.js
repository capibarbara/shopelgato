export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const token = req.headers['x-admin-token'] || req.query.admin_token
  if (!token || token !== process.env.ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' })

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'Supabase not configured' })

  try {
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/submissions?select=*&order=created_at.desc&limit=200`
    const r = await fetch(url, { headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` } })
    const data = await r.json()
    if (!r.ok) return res.status(500).json({ error: 'Supabase fetch failed', details: data })
    return res.status(200).json({ ok: true, submissions: data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal error' })
  }
}