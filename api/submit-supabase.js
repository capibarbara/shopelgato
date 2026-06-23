import nodemailer from 'nodemailer'

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

    const inserted = result?.[0] || null

    const SMTP_USER = process.env.EMAIL_SMTP_USER
    const SMTP_PASS = process.env.EMAIL_SMTP_PASS
    const OWNER_EMAIL = process.env.OWNER_EMAIL

    if (SMTP_USER && SMTP_PASS && OWNER_EMAIL && inserted) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.office365.com',
          port: 587,
          secure: false,
          auth: { user: SMTP_USER, pass: SMTP_PASS }
        })

        const text = `New request:\nName: ${inserted.name}\nEmail: ${inserted.email}\nTeam: ${inserted.team}\nColors: ${inserted.colors}\nQuantity: ${inserted.quantity}\nNotes: ${inserted.notes}\nSubmitted: ${inserted.created_at}`

        await transporter.sendMail({
          from: `Shop El Gato <${SMTP_USER}>`,
          to: OWNER_EMAIL,
          subject: `New design request — ${inserted.team}`,
          text
        })
      } catch (e) {
        console.error('SMTP send error', e)
      }
    }

    // DEBUG: if _debug flag is provided in body, include email send status
if (req.body && req.body._debug) {
  return res.status(200).json({ ok: true, inserted: result, email_debug: 'See server logs for SMTP send details' })
}
return res.status(200).json({ ok: true, inserted: result })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal error' })
  }
}