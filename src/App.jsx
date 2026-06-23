import React from 'react'
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
        <a className="btn primary" href="mailto:hello@shopelgato?subject=Design%20Request&body=Hi%20Shop%20El%20Gato%2C%0A%0AI%20want%20a%20free%20design%20for...">Email to request</a>
        <p className="small">Or DM @shopelgato on Instagram. URL: shopelgato</p>
      </section>

      <footer className="site-footer">
        © {new Date().getFullYear()} Shop El Gato — Los Gatos, CA — Cash only · Local delivery
      </footer>
    </div>
  )
}