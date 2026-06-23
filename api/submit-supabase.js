export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { name, email, team, colors, quantity, notes } = req.body || {}
    if (!name || !team) return res.status(400).json({ error: 'name and team are required' })

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Supabase not configured' })
    }

    const body = { name, email, team, colors, quantity: quantity ? Number(quantity) : null, notes }

    const r = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(body)
    })

    const result = await r.json()
    if (!r.ok) return res.status(500).json({ error: 'Supabase insert failed', details: result })

    return res.status(200).json({ ok: true, inserted: result })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal error' })
  }
}