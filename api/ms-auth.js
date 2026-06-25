export default function handler(req, res) {
  const clientId = process.env.MS_CLIENT_ID
  const redirect = process.env.MS_REDIRECT_URI || `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''}/api/ms-callback`
  if (!clientId) return res.status(500).send('MS_CLIENT_ID not configured in env')
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirect,
    response_mode: 'query',
    scope: 'offline_access Mail.Send openid profile',
    prompt: 'consent'
  })
  const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`
  res.writeHead(302, { Location: url })
  res.end()
}