import nodemailer from 'nodemailer'

async function getGraphAccessTokenFromRefresh(refreshToken) {
  const params = new URLSearchParams()
  params.append('client_id', process.env.MS_CLIENT_ID)
  params.append('client_secret', process.env.MS_CLIENT_SECRET)
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', refreshToken)

  const resp = await fetch(`https://login.microsoftonline.com/common/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  })
  if (!resp.ok) {
    const t = await resp.text()
    throw new Error('Token refresh failed: ' + resp.status + ' ' + t)
  }
  const data = await resp.json()
  return data.access_token
}

async function sendMailViaGraph(accessToken, ownerEmail, subject, text) {
  const body = {
    message: {
      subject,
      body: { contentType: 'Text', content: text },
      toRecipients: [{ emailAddress: { address: ownerEmail } }],
    },
    saveToSentItems: false
  }

  const res = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error('Graph send failed: ' + res.status + ' ' + t)
  }
  return true
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { name, email, phone, team, colors, quantity, notes, _debug } = req.body || {}
    if (!name || !team || !email || !phone) return res.status(400).json({ error: 'name, team, email, and phone are required' })

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Supabase not configured' })
    }

    const body = { name, email, phone, team, colors, quantity: quantity ? Number(quantity) : null, notes }

    // Insert into Supabase
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

    // Try Microsoft Graph delegated send if refresh token is present
    let graph_debug = null
    const MS_REFRESH_TOKEN = process.env.MS_REFRESH_TOKEN
    const OWNER_EMAIL = process.env.OWNER_EMAIL

    if (MS_REFRESH_TOKEN && OWNER_EMAIL && inserted) {
      try {
        const access = await getGraphAccessTokenFromRefresh(MS_REFRESH_TOKEN)
        const text = `New request:\nName: ${inserted.name}\nEmail: ${inserted.email}\nPhone: ${inserted.phone}\nTeam: ${inserted.team}\nColors: ${inserted.colors}\nQuantity: ${inserted.quantity}\nNotes: ${inserted.notes}\nSubmitted: ${inserted.created_at}`
        await sendMailViaGraph(access, OWNER_EMAIL, `New design request — ${inserted.team}`, text)
        graph_debug = { success: true }
      } catch (e) {
        console.error('Graph send error', e)
        graph_debug = { success: false, error: (e && e.message) ? e.message : String(e) }
      }
    } else {
      graph_debug = { success: false, error: 'MS refresh token or OWNER_EMAIL not configured' }
    }

    // Existing SMTP fallback (keeps previous behavior)
    let email_debug = null
    const SMTP_USER = process.env.EMAIL_SMTP_USER
    const SMTP_PASS = process.env.EMAIL_SMTP_PASS

    if (SMTP_USER && SMTP_PASS && OWNER_EMAIL && inserted) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.office365.com',
          port: 587,
          secure: false,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
          tls: { ciphers: 'TLSv1.2', rejectUnauthorized: false }
        })

        const text = `New request:\nName: ${inserted.name}\nEmail: ${inserted.email}\nPhone: ${inserted.phone}\nTeam: ${inserted.team}\nColors: ${inserted.colors}\nQuantity: ${inserted.quantity}\nNotes: ${inserted.notes}\nSubmitted: ${inserted.created_at}`

        const info = await transporter.sendMail({
          from: `Shop El Gato <${SMTP_USER}>`,
          to: OWNER_EMAIL,
          subject: `New design request — ${inserted.team}`,
          text
        })
        email_debug = { success: true, info }
      } catch (e) {
        console.error('SMTP send error', e)
        email_debug = { success: false, error: (e && e.message) ? e.message : String(e) }
      }
    } else {
      email_debug = { success: false, error: 'SMTP not configured (missing env vars)' }
    }

    // Forward to Zapier webhook if configured
    let webhook_debug = null
    const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL
    if (ZAPIER_WEBHOOK_URL && inserted) {
      try {
        const whRes = await fetch(ZAPIER_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inserted)
        })
        const whText = await whRes.text()
        webhook_debug = { success: whRes.ok, status: whRes.status, body: whText }
      } catch (e) {
        console.error('Zapier webhook error', e)
        webhook_debug = { success: false, error: (e && e.message) ? e.message : String(e) }
      }
    } else {
      webhook_debug = { success: false, error: 'ZAPIER_WEBHOOK_URL not configured' }
    }

    if (_debug) return res.status(200).json({ ok: true, inserted: result, graph_debug, email_debug, webhook_debug })

    return res.status(200).json({ ok: true, inserted: result })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal error' })
  }
}