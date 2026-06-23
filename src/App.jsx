import React, { useState } from 'react'
import Logo from './logo.svg'

export default function App(){
  const products = [
    {id:1, name:'Team Bracelet', price:'$10', desc:'Hand-knotted, team colors'},
    {id:2, name:'Custom Bag', price:'$28', desc:'Canvas, printed name'},
    {id:3, name:'Keychain', price:'$6', desc:'Acrylic, team logo'}
  ]

  return (
    <div className="page">
      <header className="hero">
        <img src={Logo} alt="Shop El Gato logo" className="logo"/>
        <h1>shop el gato</h1>
        <p className="tag">Handcrafted for your hometown — free custom designs</p>
        <div className="cta-row">
          <a className="btn primary" href="#contact">Request a free design</a>
          <a className="btn" href="#products">See products</a>
        </div>
      </header>

      <section id="products" className="products">
        <h2>Featured items</h2>
        <div className="grid">
          {products.map(p=>(
            <div key={p.id} className="card">
              <div className="card-body">
                <h3>{p.name}</h3>
                <p className="desc">{p.desc}</p>
                <p className="price">{p.price} — cash on delivery</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="how">
        <h2>How ordering works</h2>
        <ol>
          <li>Reach out and request a free design</li>
          <li>Approve the mockup</li>
          <li>We make it and deliver locally — pay cash on delivery</li>
        </ol>
      </section>

      <section id="contact" className="contact">
        <h2>Contact / Request a free design</h2>
        <p>Local delivery only. Cash only. Include team, colors, quantity, event date.</p>
        <ContactForm />
        <p className="small">Or DM @shopelgato on Instagram. URL: shopelgato</p>
      </section>

      <footer className="site-footer">
        © {new Date().getFullYear()} Shop El Gato — Los Gatos, CA — Cash only · Local delivery
      </footer>
    </div>
  )
}

function ContactForm(){
  const [form, setForm] = useState({name:'', email:'', team:'', colors:'', quantity:'', notes:''})
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  function update(e){
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function submit(e){
    e.preventDefault()
    setStatus(null)
    if (!form.name || !form.team) { setStatus({ error: 'Please provide your name and team.' }); return }
    setLoading(true)
    try {
      const res = await fetch('/api/submit-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ ok: 'Thanks! Your request was submitted. We will send a mockup.' })
        setForm({name:'', email:'', team:'', colors:'', quantity:'', notes:''})
      } else {
        setStatus({ error: data.error || 'Submission failed. Try again.' })
      }
    } catch (err) {
      setStatus({ error: 'Network error. Try again.' })
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} style={{maxWidth:540, margin:'0 auto'}}>
      <div style={{display:'grid', gap:8}}>
        <input name="name" placeholder="Your name" value={form.name} onChange={update} />
        <input name="email" placeholder="Email (optional)" value={form.email} onChange={update} />
        <input name="team" placeholder="Team or group name" value={form.team} onChange={update} />
        <input name="colors" placeholder="Team colors (e.g., yellow/black)" value={form.colors} onChange={update} />
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={update} />
        <textarea name="notes" placeholder="Notes / event date / special requests" value={form.notes} onChange={update} />
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Request free design'}</button>
          {status?.ok && <span style={{color:'green'}}>{status.ok}</span>}
          {status?.error && <span style={{color:'red'}}>{status.error}</span>}
        </div>
      </div>
    </form>
  )
}