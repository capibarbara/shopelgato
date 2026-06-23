import { connect } from '@vercel/postgres'

const client = connect()

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { name, email, team, colors, quantity, notes } = req.body || {}
    if (!name || !team) return res.status(400).json({ error: 'name and team are required' })

    const result = await client.sql`
      INSERT INTO submissions (name, email, team, colors, quantity, notes)
      VALUES (${name}, ${email}, ${team}, ${colors}, ${quantity}, ${notes})
      RETURNING id, created_at
    `

    const row = result?.rows?.[0] || null
    return res.status(200).json({ ok: true, id: row?.id, created_at: row?.created_at })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Database error' })
  }
}