import React, { useState } from 'react'
import Logo from './logo.svg'

export default function App(){
  return (
    <div className="page">
      <header className="hero">
        <img src={Logo} alt="Shop El Gato logo" className="logo"/>
        <h1>Shop El Gato</h1>
        <p className="tag">Custom Gear for Teams That Play to Win</p>
        <p>At Shop El Gato, we bring your team vision to life. From the field to the stands, we specialize in high-quality custom items designed to make your team stand out.</p>
        <div className="cta-row">
          <a className="btn primary" href="#contact">Request a free design</a>
          <a className="btn" href="#products">See products</a>
        </div>
      </header>

      <section id="products" className="products">
        <h2>What We Offer</h2>
        <ul>
          <li>Custom Bags</li>
          <li>Custom Bracelets</li>
          <li>Apparel and Team Gear</li>
          <li>Sublimation Printing (full color, vibrant designs)</li>
          <li>Vinyl Designs</li>
          <li>Single-Color Screen Printing</li>
          <li>Embroidery</li>
        </ul>
      </section>

      <section id="design" className="design-services">
        <h2>Design Services</h2>
        <ul>
          <li>Custom design services available for a small fee</li>
          <li>Mockups provided for approval before production begins</li>
          <li>We work with you until your design is ready</li>
        </ul>
      </section>

      <section id="how" className="how">
        <h2>How It Works</h2>
        <ol>
          <li>Submit your idea or request</li>
          <li>Receive your custom mockup</li>
          <li>Approve your design</li>
          <li>Payment is collected</li>
          <li>Production begins</li>
        </ol>
      </section>

      <section id="payment" className="payment">
        <h2>Payment Options</h2>
        <p>We accept: Venmo, Zelle, Cash. Full payment is required after mockup approval to begin production.</p>
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
  const [form, setForm] = useState({name:'', email:'', phone:'', team:'', colors:'', quantity:'', notes:''})
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  function update(e){
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
  }
  function validatePhone(phone) {
  // Accept common US and international formats by counting digits after removing non-digits
  const digits = (phone || '').replace(/\D/g, '');
  // Accept typical 10-digit US numbers or international numbers up to 15 digits
  return digits.length === 10 || (digits.length >= 10 && digits.length <= 15);
}
function normalizePhone(phone){
  // Preserve leading + if present, store digits only otherwise
  const s = (phone || '').trim();
  const leadingPlus = s.startsWith('+') ? '+' : '';
  const digits = s.replace(/\D/g, '');
  return leadingPlus ? leadingPlus + digits : digits;
}

  async function submit(e){
    e.preventDefault()
    setStatus(null)
    if (!form.name || !form.team || !form.email || !form.phone) { setStatus({ error: 'Please provide name, team, email, and phone.' }); return }
    if (!validateEmail(form.email)) { setStatus({ error: 'Please enter a valid email address.' }); return }
    if (!validatePhone(form.phone)) { setStatus({ error: 'Please enter a valid phone number (digits, +, - allowed).' }); return }

    const payload = { ...form, phone: normalizePhone(form.phone) }

    setLoading(true)
    try {
      const res = await fetch('/api/submit-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ ok: 'Thanks! Your request was submitted. We will send a mockup.' })
        setForm({name:'', email:'', phone:'', team:'', colors:'', quantity:'', notes:''})
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
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={update} />
        <input name="phone" type="tel" inputMode="tel" placeholder="Phone number (required)" value={form.phone} onChange={update} />
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