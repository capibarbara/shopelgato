export default async function handler(req, res) {
  const code = req.query.code
  if (!code) return res.status(400).send('Missing code')
  const clientId = process.env.MS_CLIENT_ID
  const clientSecret = process.env.MS_CLIENT_SECRET
  const redirect = process.env.MS_REDIRECT_URI || `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''}/api/ms-callback`
  if (!clientId || !clientSecret) return res.status(500).send('MS_CLIENT_ID or MS_CLIENT_SECRET not configured')

  const params = new URLSearchParams()
  params.append('client_id', clientId)
  params.append('client_secret', clientSecret)
  params.append('grant_type', 'authorization_code')
  params.append('code', code)
  params.append('redirect_uri', redirect)

  try {
    const tokenRes = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })
    const tokenData = await tokenRes.json()
    // tokenData contains access_token, refresh_token, etc.
    // Instruct user to copy refresh_token into Vercel env MS_REFRESH_TOKEN
    res.setHeader('Content-Type', 'text/html')
    res.end(`<h1>Authorization complete</h1><p>Copy this refresh token into your Vercel env as <code>MS_REFRESH_TOKEN</code> (Project Settings -> Environment Variables):</p><pre>${tokenData.refresh_token}</pre><p>Also set <code>MS_CLIENT_ID</code>, <code>MS_CLIENT_SECRET</code>, <code>MS_REDIRECT_URI</code> and <code>OWNER_EMAIL</code>. After that, the site will be able to send email via Microsoft Graph.</p>`)
  } catch (e) {
    console.error(e)
    res.status(500).send('Token exchange failed: ' + e.message)
  }
}