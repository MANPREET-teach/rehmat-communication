import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowDown, ArrowDownRight, ArrowRight, BatteryMedium, Check, ChevronDown, CircleHelp,
  Clock3, Headphones, MapPin, Menu, MessageCircle, Mic2, Phone, PlugZap, ScanLine,
  ShieldCheck, Smartphone, Sparkles, Volume2, X,
} from 'lucide-react'

const phone = '+918572099802'
const address = '96MF+GMC, Thane Wali Gali, near Allahabad Bank, Sadhaura, Haryana 133204'
const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
const whatsapp = `https://wa.me/${phone.slice(1)}`

const issues = [
  { label: 'Broken screen', icon: ScanLine },
  { label: 'Battery problem', icon: BatteryMedium },
  { label: 'Charging issue', icon: PlugZap },
  { label: 'Speaker/microphone problem', icon: Mic2 },
  { label: 'Software issue', icon: Smartphone },
  { label: 'Other', icon: CircleHelp },
]

const services = [
  { number: '01', title: 'Screen & display', text: 'Cracks, touch issues, or display concerns? Tell us your phone model and what you’re seeing.', icon: ScanLine, className: 'service-screen', issue: 'Broken screen' },
  { number: '02', title: 'Battery', text: 'Ask about battery or power concerns. We’ll discuss your device before you visit.', icon: BatteryMedium, className: 'service-battery', issue: 'Battery problem' },
  { number: '03', title: 'Charging port', text: 'Having trouble charging? Describe what happens and ask the shop about next steps.', icon: PlugZap, className: 'service-charging', issue: 'Charging issue' },
  { number: '04', title: 'Sound & microphone', text: 'Enquire about speaker, microphone, or call audio problems with your device.', icon: Volume2, className: 'service-audio', issue: 'Speaker/microphone problem' },
  { number: '05', title: 'Software support', text: 'Discuss software questions or troubleshooting for your mobile device.', icon: Sparkles, className: 'service-software', issue: 'Software issue' },
  { number: '06', title: 'Accessories', text: 'Ask what everyday accessories are available at the shop in Sadhaura.', icon: Headphones, className: 'service-accessories', issue: 'Other' },
]

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '-70px' })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal${visible ? ' reveal-visible' : ''}${className ? ` ${className}` : ''}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  )
}

function App() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [issue, setIssue] = useState('')
  const [issueContext, setIssueContext] = useState('')
  const [model, setModel] = useState('')
  const [cursor, setCursor] = useState({ x: -100, y: -100, visible: false })
  const [cursorEnabled, setCursorEnabled] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const assistantRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    const update = () => setCursorEnabled(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!cursorEnabled) return
    const move = (event: MouseEvent) => setCursor({ x: event.clientX, y: event.clientY, visible: true })
    const leave = () => setCursor((current) => ({ ...current, visible: false }))
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
    }
  }, [cursorEnabled])

  useEffect(() => {
    const sections = ['home', 'services', 'assistant', 'pricing', 'about', 'visit']
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-30% 0px -55% 0px' })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const scrollToAssistant = (selectedIssue?: string, context = '') => {
    if (selectedIssue) {
      setIssue(selectedIssue)
      setIssueContext(context)
      setSubmitted(false)
    }
    assistantRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
    window.setTimeout(() => document.getElementById('issue-options')?.focus({ preventScroll: true }), reducedMotion ? 0 : 550)
  }

  const sendEnquiry = () => {
    if (!issue) {
      setSubmitted(true)
      document.getElementById('issue-options')?.focus()
      return
    }
    const message = [
      'Hello Rehmat Communication,',
      '',
      `I’d like to enquire about: ${issue}${issueContext ? ` (${issueContext})` : ''}.`,
      ...(model.trim() ? [`Phone model: ${model.trim()}.`] : []),
      '',
      'Could you please let me know the next steps?',
    ].join('\n')
    window.open(`${whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="site-shell">
      {cursorEnabled && <span className="custom-cursor" style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`, opacity: cursor.visible ? 1 : 0 }} aria-hidden="true" />}
      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Rehmat Communication home">
          <img className="brand-icon" src="./images/rehmat-icon.svg" alt="Metallic R, smartphone and lightning-bolt symbol" width="42" height="42" />
          <span className="brand-copy"><strong>REHMAT</strong><small>COMMUNICATION</small></span>
        </a>
        <nav className={`desktop-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
          <a className="mobile-menu-brand" href="#home" onClick={closeMenu}>
            <img src="./images/rehmat-icon.svg" alt="Metallic R, smartphone and lightning-bolt symbol" width="38" height="38" />
            <span>REHMAT COMMUNICATION</span>
          </a>
          {[['home', 'Overview'], ['services', 'Services'], ['assistant', 'Repair enquiry'], ['pricing', 'Estimates'], ['about', 'About'], ['visit', 'Find us']].map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>{label}</a>
          ))}
          <a className="nav-call" href={`tel:${phone}`} onClick={closeMenu}><Phone size={15} /> <span>Call the shop</span></a>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <main>
        <section className="hero section-grid" id="home">
          <div className="hero-copy">
            <Reveal>
              <p className="eyebrow"><span className="eyebrow-dot" /> MOBILE REPAIR & ACCESSORIES <span className="eyebrow-line" /></p>
              <h1>Your phone.<br /><span>Restored to</span><br /><em>perfection.</em></h1>
              <p className="hero-description">Mobile repair and accessories in Sadhaura. Tell us what your device needs, and contact our shop to discuss the next step.</p>
              <div className="hero-actions">
                <a className="button button-primary" href={`tel:${phone}`}><Phone size={16} /> CALL NOW <ArrowRight size={15} /></a>
                <a className="button button-quiet" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16} /> CHAT ON WHATSAPP</a>
              </div>
              <a className="hero-location" href={directions} target="_blank" rel="noreferrer"><MapPin size={14} /> SADHAURA, HARYANA <span>·</span> GET DIRECTIONS <ArrowDownRight size={13} /></a>
            </Reveal>
          </div>

          <div className="hero-visual" aria-label="Photographs of an iPhone 16 Pro and an OPPO Reno 6 Pro+ 5G">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="visual-ring"><span>DEVICE LAB</span><span>REPAIR · RESTORE · RECONNECT</span></div>
            <div className="visual-cross cross-a">+</div><div className="visual-cross cross-b">+</div>
            <div className="visual-coordinate">30.38° N<br />77.15° E</div>
            <div className="visual-index">RC — 001</div>
            <div className="hero-product-pair">
              <figure className="product-photo product-photo-iphone">
                <img src="./images/iphone-16-pro-back.jpg" alt="Real iPhone 16 Pro in white titanium, shown from the back" fetchPriority="high" />
                <figcaption><span>01 / IPHONE</span><strong>iPhone 16 Pro</strong></figcaption>
              </figure>
              <figure className="product-photo product-photo-oppo">
                <img src="./images/oppo-reno-6-pro-back.jpg" alt="Real OPPO Reno 6 Pro+ 5G in blue, shown from the back" fetchPriority="high" />
                <figcaption><span>02 / ANDROID</span><strong>OPPO Reno 6 Pro+ 5G</strong></figcaption>
              </figure>
            </div>
            <div className="visual-caption">FIG. 01 <span>EVERYDAY TECH, WITH CARE</span></div>
          </div>
          <a className="hero-scroll" href="#services"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
          <div className="hero-rail" aria-hidden="true"><span>01</span><span className="rail"></span><span>05</span></div>
        </section>

        <section className="services-section section-pad" id="services">
          <div className="section-topline"><span>01 / WHAT WE CAN HELP WITH</span><span>LOCAL CARE, STRAIGHTFORWARD ENQUIRIES</span></div>
          <div className="section-heading">
            <Reveal><p className="eyebrow">A DEVICE HAS A STORY</p><h2>Start with<br /><span>what’s not</span> working.</h2></Reveal>
            <Reveal delay={0.12}><p className="section-intro">Every phone is different. Choose a starting point and tell the shop what you’re experiencing—no automated diagnosis, just a direct conversation.</p></Reveal>
          </div>
          <div className="service-grid">
            {services.map(({ number, title, text, icon: Icon, className, issue: serviceIssue }, index) => (
              <Reveal key={title} className={`service-card ${className}`} delay={(index % 3) * 0.08}>
                <div className="service-top"><span className="service-number">{number} / 06</span><ArrowDownRight size={17} /></div>
                <div className="service-art"><div className="art-halo" /><Icon size={34} strokeWidth={1.2} /></div>
                <div className="service-info"><h3>{title}</h3><p>{text}</p></div>
                <button className="service-link" onClick={() => scrollToAssistant(serviceIssue, title === 'Accessories' ? 'Phone accessories' : title)} aria-label={`Enquire about ${title}`}>ASK ABOUT THIS <ArrowRight size={14} /></button>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="assistant-section" id="assistant" ref={assistantRef}>
          <div className="assistant-grid" />
          <div className="assistant-aside">
            <Reveal>
              <p className="eyebrow"><span className="eyebrow-dot" /> THE REPAIR ENQUIRY</p>
              <h2>What’s happening<br />to your <em>phone?</em></h2>
              <p>Pick the closest match and add your model if you know it. We’ll prepare a clear message for the shop on WhatsApp.</p>
              <div className="assistant-note"><ShieldCheck size={17} /><span>No automatic diagnosis or repair promises. Just a helpful place to start the conversation.</span></div>
            </Reveal>
          </div>
          <Reveal className="assistant-form-wrap" delay={0.13}>
            <div className="assistant-form">
              <div className="form-top"><span>NEW ENQUIRY <span className="form-live"><i /> READY</span></span><span>RC / 02</span></div>
              <fieldset id="issue-options" tabIndex={-1}>
                <legend>01 — Select an issue</legend>
                <div className="issue-options">
                  {issues.map(({ label, icon: Icon }) => (
                    <button className={`issue-option ${issue === label ? 'selected' : ''}`} key={label} onClick={() => { setIssue(label); setIssueContext(''); setSubmitted(false) }} aria-pressed={issue === label}>
                      <Icon size={16} strokeWidth={1.65} /><span>{label}</span>{issue === label && <Check size={14} className="issue-check" />}
                    </button>
                  ))}
                </div>
                {submitted && !issue && <p className="form-error" role="alert">Choose an issue to prepare your message.</p>}
              </fieldset>
              <label className="model-label" htmlFor="phone-model"><span>02 — Phone model <span className="optional">(OPTIONAL)</span></span><span className="model-hint">Helps us understand your enquiry</span></label>
              <input id="phone-model" className="model-input" value={model} onChange={(event) => setModel(event.target.value)} placeholder="e.g. Samsung Galaxy A54" maxLength={80} />
              <button className="button button-primary whatsapp-submit" onClick={sendEnquiry}><MessageCircle size={17} /> PREPARE WHATSAPP ENQUIRY <ArrowRight size={15} /></button>
              <p className="form-footnote">Your message opens in WhatsApp for you to review before sending.</p>
            </div>
          </Reveal>
        </section>

        <section className="pricing-section section-pad" id="pricing">
          <div className="section-topline"><span>02 / A CLEAR PLACE TO START</span><span>INDICATIVE ESTIMATES — NOT A QUOTE</span></div>
          <div className="pricing-heading">
            <Reveal><p className="eyebrow">HONEST ABOUT THE UNKNOWN</p><h2>Know the range.<br /><span>Ask about your model.</span></h2></Reveal>
            <Reveal delay={0.12}><p className="section-intro">A screen price depends on more than a category. These unverified figures are broad estimates only—not Rehmat Communication’s confirmed prices.</p></Reveal>
          </div>
          <div className="price-table">
            <div className="price-table-head"><span>COMPONENT / SERVICE</span><span>INDICATIVE ESTIMATE</span><span>ENQUIRE</span></div>
            {[
              ['01', 'Budget LCD', 'Entry-level display replacements', '₹1,500–₹3,500', 'Broken screen'],
              ['02', 'Mid-range OLED / AMOLED', 'Display type and model affect cost', '₹4,000–₹8,500', 'Broken screen'],
              ['03', 'Flagship screens', 'Premium models vary substantially', '₹12,000–₹20,000+', 'Broken screen'],
              ['04', 'Basic repairs / accessories', 'A broad range of everyday items', '₹250–₹1,200', 'Other'],
            ].map(([number, title, note, price, selectedIssue]) => (
              <Reveal key={number} className="price-row">
                <span className="price-title"><i>{number}</i><span><strong>{title}</strong><small>{note}</small></span></span>
                <strong className="price-amount">{price}</strong>
                <button onClick={() => scrollToAssistant(selectedIssue, title)} className="price-action" aria-label={`Ask for a confirmed quote about ${title}`}><ArrowDownRight size={18} /></button>
              </Reveal>
            ))}
          </div>
          <div className="price-disclaimer"><CircleHelp size={17} /><p>Unverified indicative estimates only. Not official shop quotations. Actual prices depend on your phone model, the component and the diagnosis. <button onClick={() => scrollToAssistant('Other', 'Price enquiry')}>Contact the shop for a confirmed quote <ArrowRight size={13} /></button></p></div>
        </section>

        <section className="process-section">
          <div className="section-topline"><span>03 / SIMPLE BY DESIGN</span><span>YOU’RE ALWAYS IN CONTROL</span></div>
          <Reveal><div className="process-intro"><p className="eyebrow">FROM QUESTION TO SHOP VISIT</p><h2>A small first step.<br /><span>A real conversation.</span></h2></div></Reveal>
          <div className="process-steps">
            {[
              ['01', 'Tell us what’s up', 'Choose an issue or describe it in your own words.'],
              ['02', 'Share your model', 'Add the phone model if you know it—this is optional.'],
              ['03', 'Contact the shop', 'Call or send your prepared WhatsApp enquiry.'],
              ['04', 'Plan a visit', 'Ask your questions, confirm details, then find the shop in Sadhaura.'],
            ].map(([number, title, text], index) => (
              <Reveal className="process-step" key={number} delay={index * 0.09}>
                <span className="step-number">{number}</span><span className="step-connector" /><h3>{title}</h3><p>{text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="about-brand-section" id="about">
          <div className="section-topline"><span>04 / ABOUT REHMAT COMMUNICATION</span><span>LOCAL MOBILE REPAIR & ACCESSORIES</span></div>
          <div className="about-brand-layout">
            <Reveal className="about-logo-panel">
              <img className="full-brand-logo about-full-logo" src="./images/rehmat-full-logo.svg" alt="Rehmat Communication — Mobile Repair & Accessories" width="980" height="270" />
            </Reveal>
            <Reveal className="about-brand-copy" delay={0.12}>
              <p className="eyebrow">YOUR LOCAL DEVICE CARE STOP</p>
              <h2>Personal help<br /><span>starts here.</span></h2>
              <p>Rehmat Communication is a mobile repair and accessories shop in Sadhaura. Contact the shop directly to discuss a device issue, ask about accessories, or get directions before you visit.</p>
              <a className="about-link" href={`tel:${phone}`}><Phone size={15} /> TALK TO THE SHOP <ArrowRight size={14} /></a>
            </Reveal>
          </div>
        </section>

        <section className="visit-section section-pad" id="visit">
          <div className="section-topline"><span>05 / FIND REHMAT COMMUNICATION</span><span>THANE WALI GALLI · SADHAURA</span></div>
          <div className="visit-layout">
            <Reveal className="visit-main">
              <p className="eyebrow">A LOCAL SHOP, RIGHT HERE</p>
              <h2>Good to know<br /><span>where to go.</span></h2>
              <p className="visit-address"><MapPin size={18} /> {address}</p>
              <div className="visit-actions">
                <a className="button button-primary" href={directions} target="_blank" rel="noreferrer"><MapPin size={16} /> GET DIRECTIONS <ArrowRight size={15} /></a>
                <a className="button button-quiet" href={`tel:${phone}`}><Phone size={16} /> +91 85720 99802</a>
              </div>
            </Reveal>
            <Reveal className="visit-side" delay={0.13}>
              <div className="map-visual" aria-hidden="true"><div className="map-grid" /><div className="map-route route-one" /><div className="map-route route-two" /><div className="map-route route-three" /><div className="map-pin"><MapPin size={19} fill="currentColor" /></div><div className="map-coordinate">SADHAURA<br /><span>HARYANA · INDIA</span></div><div className="map-label">MAIN MARKET</div></div>
              <a className="address-link" href={directions} target="_blank" rel="noreferrer">OPEN IN MAPS <ArrowUpRightIcon /></a>
            </Reveal>
          </div>
          <div className="hours-note"><Clock3 size={16} /><span>Opening hours are not yet confirmed. Please call or message the shop before visiting.</span><span className="provisional-tag">HOURS PROVISIONAL</span></div>
        </section>

        <section className="closing-section">
          <div className="closing-glow" />
          <Reveal>
            <p className="eyebrow"><span className="eyebrow-dot" /> READY WHEN YOU ARE</p>
            <h2>Let’s get your<br /><span>phone talking.</span></h2>
            <p>One quick call or message is a good place to start.</p>
            <div className="closing-actions"><a className="button button-primary" href={`tel:${phone}`}><Phone size={16} /> CALL REHMAT COMMUNICATION <ArrowRight size={15} /></a><a href={whatsapp} target="_blank" rel="noreferrer" className="closing-text-link">OR SAY HELLO ON WHATSAPP <ArrowRight size={14} /></a></div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-full-logo-link" href="#home" aria-label="Rehmat Communication home">
          <img className="full-brand-logo footer-full-logo" src="./images/rehmat-full-logo.svg" alt="Rehmat Communication — Mobile Repair & Accessories" width="980" height="270" />
        </a>
        <p>Mobile repair & accessories<br />Sadhaura, Haryana</p>
        <div className="footer-photo-credits">
          <span>PHONE PHOTOS:</span>
          <a href="https://commons.wikimedia.org/wiki/File:Back_of_iPhone_16_Pro_-_1.jpg" target="_blank" rel="noreferrer">iPhone — Kyu3a</a>
          <span>·</span>
          <a href="https://commons.wikimedia.org/wiki/File:OPPO_Reno_6_Pro%2B_back.jpg" target="_blank" rel="noreferrer">OPPO — 30000lightyears</a>
          <span>·</span>
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0 · cropped for layout</a>
        </div>
        <span className="footer-note">MADE FOR THE MOMENT YOUR PHONE NEEDS A HAND.</span>
        <a href="#home" className="back-top">BACK TO TOP <ChevronDown size={14} /></a>
      </footer>

      <div className="contact-dock" aria-label="Quick contact">
        <a href={`tel:${phone}`} aria-label="Call Rehmat Communication"><Phone size={17} /></a>
        <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle size={18} /></a>
      </div>

      {menuOpen && <button className="menu-scrim" aria-label="Close navigation" onClick={closeMenu} />}
    </div>
  )
}

function ArrowUpRightIcon() {
  return <ArrowRight size={14} />
}

export default App
