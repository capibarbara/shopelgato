import React, { useEffect, useState } from 'react'

export default function Admin(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')

  async function fetchItems() {
    setLoading(true)
    try {
      const res = await fetch(`/api/list-submissions?admin_token=${encodeURIComponent(token)}`)
      const data = await res.json()
      if (res.ok) setItems(data.submissions || [])
      else alert(data.error || 'Failed to fetch')
    } catch (e) { alert('Network error') }
    setLoading(false)
  }

  return (
    <div style={{maxWidth:900, margin:'20px auto', padding:20}}>
      <h2>Admin — Submissions</h2>
      <div style={{marginBottom:12}}>
        <input placeholder="Admin token" value={token} onChange={e=>setToken(e.target.value)} style={{width:360}} />
        <button onClick={fetchItems} disabled={loading} style={{marginLeft:8}}>{loading ? 'Loading...' : 'Load submissions'}</button>
      </div>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr><th>Name</th><th>Email</th><th>Team</th><th>Quantity</th><th>Notes</th><th>When</th></tr></thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id} style={{borderTop:'1px solid #ddd'}}>
              <td>{it.name}</td>
              <td>{it.email}</td>
              <td>{it.team}</td>
              <td>{it.quantity}</td>
              <td>{it.notes}</td>
              <td>{new Date(it.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}