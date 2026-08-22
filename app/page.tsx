"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowUpRight, Banknote, BriefcaseBusiness, Building2, CarFront, CheckCircle2, FileCheck2, HardHat, House, Phone, ShieldCheck, Sparkles } from "lucide-react";

const Arrow = () => <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.2}/>;
const phone = "+17188441340";
const email = "insurancefinancialrealty@gmail.com";

const services = [
  { icon:CarFront, title:"Auto Insurance", group:"Insurance", blurb:"Protection for every mile.", detail:"Coverage guidance for personal vehicles, commercial autos, trucks, and more. We help you review the options and find protection that fits your needs and budget." },
  { icon:BriefcaseBusiness, title:"Business Owners", group:"Insurance", blurb:"Built around your business.", detail:"Business owner policies and commercial coverage designed to protect your property, operations, customers, and future growth." },
  { icon:HardHat, title:"Contractors", group:"Insurance", blurb:"Coverage made for the job.", detail:"Insurance solutions for contractors and trade professionals, including guidance around liability and job-related coverage needs." },
  { icon:Building2, title:"Property", group:"Insurance", blurb:"Protect every property.", detail:"Explore coverage for homes, rental properties, offices, and commercial spaces with personal help from a local broker." },
  { icon:ShieldCheck, title:"Surety Bonds", group:"Insurance", blurb:"Bonding without the confusion.", detail:"Support with surety bonds for licensing, contracts, permits, and other business obligations." },
  { icon:FileCheck2, title:"Corporate Filing", group:"Business services", blurb:"Start and maintain your company.", detail:"Practical help with business formation paperwork and corporate filings so you can stay focused on running your business." },
  { icon:Banknote, title:"Payroll", group:"Business services", blurb:"Simple support for your team.", detail:"Straightforward payroll support for small businesses, with responsive help when questions come up." },
  { icon:House, title:"Real Estate", group:"Real Estate", blurb:"Buy and sell with confidence.", detail:"Professional guidance for residential real estate buying and selling—from the first conversation to the closing table." },
];

const faqs = [
  ["What types of insurance do you offer?", "We help with auto, business owner, contractor, and property insurance, along with surety bonds. Call or send a quote request to discuss your specific situation."],
  ["Can I request a quote online?", "Yes. Complete the secure quote form and your request will be saved immediately with a reference number for follow-up."],
  ["Do I need an appointment?", "Calling or texting before your visit is recommended, especially for notary, filing, payroll, and document services."],
  ["Do you help with real estate?", "Yes. Insurance & Financial Realty LLC helps clients with residential real estate buying and selling."],
];

const finderOptions = [
  { label:"Protect my vehicle", service:"Auto Insurance", icon:CarFront },
  { label:"Protect my business", service:"Business Owners", icon:BriefcaseBusiness },
  { label:"Cover contracting work", service:"Contractors", icon:HardHat },
  { label:"Protect a property", service:"Property", icon:Building2 },
  { label:"Get a bond", service:"Surety Bonds", icon:ShieldCheck },
  { label:"Set up business operations", service:"Corporate Filing", icon:FileCheck2 },
  { label:"Buy or sell a home", service:"Real Estate", icon:House },
];

export default function Home() {
  const [menuOpen,setMenuOpen]=useState(false);
  const [selected,setSelected]=useState<(typeof services)[number] | null>(null);
  const [openFaq,setOpenFaq]=useState<number | null>(0);
  const [finderChoice,setFinderChoice]=useState("");
  const [formState,setFormState]=useState<{status:"idle"|"sending"|"success"|"error";reference?:string;notificationStatus?:string}>({status:"idle"});
  const SelectedIcon=selected?.icon;

  useEffect(()=>{
    const elements=document.querySelectorAll(".reveal");
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("is-visible")}),{threshold:.12});
    elements.forEach(el=>observer.observe(el));
    return()=>observer.disconnect();
  },[]);

  async function submitQuote(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    setFormState({status:"sending"});
    try{
      const response=await fetch("/api/quote-requests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(data))});
      const result=await response.json() as {reference?:string;error?:string;notificationStatus?:string};
      if(!response.ok) throw new Error(result.error||"Request failed");
      form.reset();
      setFormState({status:"success",reference:result.reference,notificationStatus:result.notificationStatus});
    }catch{
      setFormState({status:"error"});
    }
  }

  const closeMenu=()=>setMenuOpen(false);

  return <main>
    <div className="topbar"><span>Licensed broker · Bristol, Connecticut</span><div><a href="#quote">Request online</a><a href={`tel:${phone}`}>Call/Text (718) 844-1340</a></div></div>
    <header className="site-header">
      <a className="brand" href="#top" onClick={closeMenu}><span className="logo-shell"><img src="/logo-exact.png" alt="Insurance and Financial Realty umbrella logo"/></span><span><strong>INSURANCE &amp; FINANCIAL</strong><small>REALTY LLC</small></span></a>
      <nav className={menuOpen?"nav-open":""} aria-label="Main navigation"><a href="#services" onClick={closeMenu}>Services</a><a href="#process" onClick={closeMenu}>How it works</a><a href="#about" onClick={closeMenu}>About</a><a href="#faq" onClick={closeMenu}>FAQs</a><a href="#contact" onClick={closeMenu}>Contact</a></nav>
      <a className="button button-small desktop-cta" href="#quote">Get a free quote <Arrow/></a>
      <button className={`menu-button ${menuOpen?"active":""}`} onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}><i/><i/><i/></button>
    </header>

    <section className="hero" id="top"><div className="hero-grid"/><div className="hero-glow"/><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
      <div className="hero-content reveal is-visible"><p className="eyebrow"><span/> BRISTOL'S ALL-IN-ONE LOCAL OFFICE</p><h1>Protection that<br/><em>moves with you.</em></h1><p className="hero-copy">Insurance, business services, and real estate guidance—made personal, clear, and refreshingly simple.</p><div className="hero-actions"><a className="button magnetic" href="#finder">Find my service <Arrow/></a><a className="text-link" href="#quote">Request a quote <span>↓</span></a></div><div className="trust-row"><div className="initial-badge">ZC</div><p><strong>Zain Chughtai · Owner</strong><br/>Licensed Broker · Direct, personal guidance</p></div></div>
      <div className="hero-console reveal is-visible" aria-label="Agency highlights"><div className="console-top"><span><Sparkles size={15}/> PERSONAL COVERAGE DESK</span><i>AVAILABLE</i></div><div className="console-main"><img src="/logo-exact.png" alt=""/><div><small>ONE RELATIONSHIP</small><strong>8 services.<br/>Zero runaround.</strong></div></div><div className="console-grid"><div><strong>01</strong><span>Local owner<br/>access</span></div><div><strong>8</strong><span>Services<br/>together</span></div><div><strong>100%</strong><span>Human<br/>guidance</span></div></div><div className="console-proof"><CheckCircle2 size={17}/><span>Licensed broker in Bristol, Connecticut</span></div></div>
    </section>

    <div className="ticker" aria-label="Services"><div>{[...services,...services].map((s,i)=><span key={`${s.title}-${i}`}>{s.title}<b>✦</b></span>)}</div></div>

    <section className="finder-section section" id="finder"><div className="finder-heading reveal"><p className="eyebrow dark"><span/> SMART SERVICE FINDER</p><h2>What can we<br/><em>help with today?</em></h2><p>Choose what sounds closest. We’ll point you to the right service in one tap.</p></div><div className="finder-panel reveal"><div className="finder-options" role="list" aria-label="Choose what you need">{finderOptions.map(option=>{const Icon=option.icon;return <button key={option.label} className={finderChoice===option.service?"active":""} onClick={()=>setFinderChoice(option.service)}><Icon size={20}/><span>{option.label}</span><i>{finderChoice===option.service?"✓":"→"}</i></button>})}</div><div className={`finder-result ${finderChoice?"show":""}`} aria-live="polite">{finderChoice?<><div><small>YOUR BEST STARTING POINT</small><strong>{finderChoice}</strong><p>{services.find(s=>s.title===finderChoice)?.blurb}</p></div><a href="#quote" className="button" onClick={()=>setTimeout(()=>{const select=document.querySelector<HTMLSelectElement>('select[name="service"]');if(select){select.value=finderChoice;select.dispatchEvent(new Event("change",{bubbles:true}))}},50)}>Continue to free request <Arrow/></a></>:<><Sparkles size={26}/><strong>Select one option</strong><p>Your recommendation appears here instantly.</p></>}</div></div></section>

    <section className="services-section section" id="services"><div className="section-heading reveal"><div><p className="eyebrow dark"><span/> EVERYTHING IN ONE PLACE</p><h2>One office.<br/><em>Eight ways to help.</em></h2></div><p>Choose any service to see details. When you’re ready, request a quote or connect directly with Zain.</p></div><div className="service-grid">{services.map((s,i)=>{const Icon=s.icon;return <button className="service-card reveal" style={{transitionDelay:`${Math.min(i,4)*70}ms`}} onClick={()=>setSelected(s)} key={s.title}><span className="service-number">{String(i+1).padStart(2,"0")}</span><span className="plan-icon"><Icon aria-hidden="true" size={25} strokeWidth={1.8}/></span><span className="service-group">{s.group}</span><h3>{s.title}</h3><p>{s.blurb}</p><span className="card-arrow"><Arrow/></span></button>})}</div></section>

    <section className="process section" id="process"><div className="process-intro reveal"><p className="eyebrow"><span/> SIMPLE FROM START TO FINISH</p><h2>From question<br/>to covered.</h2><p>No complicated process. Just direct guidance and clear next steps.</p><a href="#quote" className="button light-button">Start now <Arrow/></a></div><div className="process-steps"><article className="reveal"><b>01</b><div><h3>Tell us what you need</h3><p>Call, text, or complete the online request with a few basic details.</p></div></article><article className="reveal"><b>02</b><div><h3>Review your options</h3><p>Zain helps you understand the choices and identify the right fit.</p></div></article><article className="reveal"><b>03</b><div><h3>Move forward confidently</h3><p>Get help completing the next steps without unnecessary confusion.</p></div></article></div></section>

    <section className="about-section" id="about"><div className="about-art reveal"><div className="service-cloud"><span className="cloud-core">ONE<br/><b>LOCAL</b><br/>EXPERT</span><span className="cloud-chip c1">INSURANCE</span><span className="cloud-chip c2">BONDS</span><span className="cloud-chip c3">PAYROLL</span><span className="cloud-chip c5">REAL ESTATE</span><span className="cloud-chip c6">FILING</span></div><span className="about-badge"><strong>LOCAL</strong><small>BRISTOL, CT</small></span></div><div className="about-copy reveal"><p className="eyebrow dark"><span/> YOUR LOCAL BROKER</p><h2>A real person.<br/><em>A complete solution.</em></h2><p>Zain Chughtai, owner and licensed broker, brings insurance, financial, business, and real estate services together under one roof.</p><div className="feature-list"><div><b>01</b><span><strong>Direct access</strong>Call or text the owner—not a call center.</span></div><div><b>02</b><span><strong>Wide-ranging help</strong>One relationship for insurance, business, and real estate needs.</span></div><div><b>03</b><span><strong>Local convenience</strong>Visit Suite 5 at 1019 Farmington Avenue.</span></div></div><a className="outline-button" href="#quote">Contact Zain <Arrow/></a></div></section>

    <section className="quote-section section" id="quote"><div className="quote-intro reveal"><p className="eyebrow"><span/> FREE QUOTE REQUEST</p><h2>Let’s find your<br/>best next step.</h2><p>Send your request securely. It will be saved immediately so our office can follow up with you directly.</p><div className="direct-contact"><a href={`tel:${phone}`}><small>CALL OR TEXT</small><strong>(718) 844-1340</strong></a><a href="#quote-form"><small>ONLINE REQUEST</small><strong>Send your details securely</strong></a></div></div><form className="full-form reveal" id="quote-form" onSubmit={submitQuote}><div className="field-row"><label>Full name<input name="name" required maxLength={100} autoComplete="name" placeholder="Your name"/></label><label>Phone number<input name="phone" required maxLength={40} autoComplete="tel" type="tel" placeholder="(000) 000-0000"/></label></div><div className="field-row"><label>Email address<input name="email" required maxLength={160} autoComplete="email" type="email" placeholder="you@email.com"/></label><label>Service<select name="service" required defaultValue=""><option value="" disabled>Choose a service</option>{services.map(s=><option key={s.title}>{s.title}</option>)}</select></label></div><label className="website-field" aria-hidden="true">Company website<input name="company" tabIndex={-1} autoComplete="off"/></label><label>How can we help?<textarea name="message" required minLength={5} maxLength={2000} rows={5} placeholder="Tell us a little about what you need..."/></label><button className="button form-submit" type="submit" disabled={formState.status==="sending"}>{formState.status==="sending"?"Sending securely…":"Submit my request"} <Arrow/></button>{formState.status==="success"&&<p className={`form-note${formState.notificationStatus==="sent"?"":" form-error"}`} role="status"><strong>{formState.notificationStatus==="sent"?"Request received and emailed.":"Request received successfully."}</strong> Your reference is {formState.reference}.{formState.notificationStatus!=="sent"&&" Automatic email delivery to the office is temporarily unavailable. Please call or text for immediate help."}</p>}{formState.status==="error"&&<p className="form-note form-error" role="alert">We couldn’t save your request. Please call or text (718) 844-1340.</p>}<small>Your details are used only to respond to this request.</small></form></section>

    <section className="faq-section section" id="faq"><div className="faq-title reveal"><p className="eyebrow dark"><span/> GOOD TO KNOW</p><h2>Questions,<br/>answered.</h2><p>Need something else? Call or text us directly.</p></div><div className="faq-list">{faqs.map((f,i)=><article className={`faq-item reveal ${openFaq===i?"open":""}`} key={f[0]}><button onClick={()=>setOpenFaq(openFaq===i?null:i)} aria-expanded={openFaq===i}><span>{f[0]}</span><b>{openFaq===i?"−":"+"}</b></button><div><p>{f[1]}</p></div></article>)}</div></section>

    <section className="visit-section"><div className="visit-copy reveal"><p className="eyebrow"><span/> VISIT THE OFFICE</p><h2>Right here in<br/>Bristol.</h2><p>1019 Farmington Avenue, Suite 5<br/>Bristol, CT 06010</p><a className="button light-button" target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=1019+Farmington+Ave+Suite+5+Bristol+CT+06010">Get directions <Arrow/></a></div><div className="map-art" aria-hidden="true"><span className="road r1"/><span className="road r2"/><span className="road r3"/><div className="map-pin"><i/><strong>IFR</strong></div><b>FARMINGTON AVE</b></div></section>

    <footer id="contact"><div className="footer-main"><div><a className="footer-wordmark" href="#top"><strong>INSURANCE &amp; FINANCIAL</strong><small>REALTY LLC</small></a><p>Solutions that fit your world.</p></div><div><small>CONTACT</small><a href={`tel:${phone}`}>(718) 844-1340</a><a href="#quote">Send an online request</a><p>{email}</p></div><div><small>VISIT</small><p>1019 Farmington Ave<br/>Suite 5<br/>Bristol, CT 06010</p></div><div><small>EXPLORE</small><a href="#services">Services</a><a href="#about">About</a><a href="#quote">Free quote</a></div></div><div className="footer-bottom"><p>© 2026 Insurance &amp; Financial Realty LLC</p><p>Zain Chughtai · Owner · Licensed Broker</p><a href="#top">Back to top ↑</a></div></footer>

    <a className="floating-call" href="#quote" aria-label="Open the quote request form"><span><Phone aria-hidden="true" size={17} strokeWidth={2.2}/></span><b>Request help</b></a>
    {selected&&SelectedIcon&&<div className="modal-backdrop" role="presentation" onClick={()=>setSelected(null)}><article className="service-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)} aria-label="Close service details">×</button><span className="plan-icon"><SelectedIcon aria-hidden="true" size={25} strokeWidth={1.8}/></span><small>{selected.group}</small><h2 id="modal-title">{selected.title}</h2><p>{selected.detail}</p><div><a className="button" href="#quote" onClick={()=>setSelected(null)}>Request help <Arrow/></a><a className="outline-button" href={`tel:${phone}`}>Call now</a></div></article></div>}
  </main>;
}
