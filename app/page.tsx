const skills = [
  "React Native", "TypeScript", "Native iOS", "New Architecture", "Offline-first",
  "Payment systems", "Hardware integration", "Real-time systems", "CI/CD",
];

const projects = [
  {
    n: "01", title: "Multi-app Salon POS Ecosystem", company: "NailSoft · 2021—2026",
    text: "Owned mobile delivery across Merchant, SalonSoft, Booked By, Check-in and Retailer products—connecting complex daily operations in one reliable ecosystem.",
    tags: ["React Native", "Swift / Kotlin", "Native Modules", "New Architecture"],
    accent: "blue",
  },
  {
    n: "02", title: "Payments & In-store Hardware", company: "NailSoft · Platform integrations",
    text: "Built production integrations for Dejavoo, Star Micronics and Sunmi devices—connecting payment terminals and receipt printers over BLE, USB and Wi-Fi.",
    tags: ["Dejavoo", "Star Micronics", "Sunmi", "BLE", "USB", "Wi-Fi"],
    accent: "mint",
  },
  {
    n: "03", title: "Consumer Booking & Delivery", company: "Levinci Group · 2020—2021",
    text: "Delivered mobile features for Jollibee digital ordering applications—Consumer, Driver and Merchant—from technical planning through release.",
    tags: ["React Native", "GraphQL", "Google Maps", "Push Notifications"],
    accent: "amber",
  },
];

const experience = [
  ["2021—2026", "NailSoft", "Mobile Engineer", "Five-app salon POS ecosystem with native hardware integration and performance optimization."],
  ["2020—2021", "Levinci Group", "Mobile Engineer", "Digital ordering applications for Jollibee across consumer, driver and merchant workflows."],
  ["2018—2020", "SEA", "Full-stack / Mobile Engineer", "Cross-platform spa booking and game platform delivery."],
  ["2015—2018", "Creants", "Full-stack Engineer", "Cross-platform news application and backend services for game operations."],
  ["2012—2015", "Microgame Corp", "iOS Engineer", "iOS application for social chat platform with REST API integration."],
];

export default function Home() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="#top" aria-label="Tran Hoang Nha home"><span>TN</span> Tran Hoang Nha</a>
        <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#experience">Experience</a><a href="#about">About</a></nav>
        <a className="nav-cta" href="mailto:thediffest@gmail.com">Let&apos;s talk <span>↗</span></a>
      </header>

      <section id="top" className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">Senior React Native Engineer</p>
          <h1>Building mobile products that <em>work in the real world.</em></h1>
          <p className="lede">13+ years turning complex product, payment and hardware requirements into dependable mobile experiences.</p>
          <div className="hero-actions"><a className="button primary" href="#work">Explore my work <span>↓</span></a><a className="button ghost" href="mailto:thediffest@gmail.com">Get in touch <span>↗</span></a></div>
          <div className="proof"><div><strong>13+</strong><span>Years building software</span></div><div><strong>8</strong><span>Production apps shipped across the NailSoft and Jollibee ecosystems</span></div><div><strong>iOS + Android</strong><span>Cross-platform delivery</span></div></div>
        </div>
        <div className="hero-card" aria-label="Engineering profile summary">
          <div className="code-top"><span>mobile-engineer.ts</span><span>● ● ●</span></div>
          <pre><code><b>const</b> engineer = {`{`}<br/>  focus: <i>&quot;React Native&quot;</i>,<br/>  ships: [<i>&quot;iOS&quot;</i>, <i>&quot;Android&quot;</i>],<br/>  strengths: [<br/>    <i>&quot;architecture&quot;</i>,<br/>    <i>&quot;native integration&quot;</i>,<br/>    <i>&quot;production delivery&quot;</i><br/>  ],<br/>  mindset: <i>&quot;own the outcome&quot;</i><br/>{`}`};</code></pre>
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="float-chip chip-one">⌁ Real-time</div><div className="float-chip chip-two">✓ Production ready</div>
        </div>
      </section>

      <section className="ticker" aria-label="Core technologies"><div>{[...skills, ...skills].map((s,i)=><span key={`${s}-${i}`}>{s}<b>✦</b></span>)}</div></section>

      <section id="work" className="section shell">
        <div className="section-head"><div><p className="kicker">Selected work</p><h2>Complex systems.<br/><em>Clear experiences.</em></h2></div><p>A selection of product challenges where mobile architecture meets real-world operations.</p></div>
        <div className="projects">{projects.map((p)=><article className={`project ${p.accent}`} key={p.n}><div className="project-top"><span>{p.n}</span><span className="project-arrow">↗</span></div><div><p className="company">{p.company}</p><h3>{p.title}</h3><p>{p.text}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div></article>)}</div>
      </section>

      <section id="experience" className="section experience-wrap"><div className="shell"><div className="section-head light"><div><p className="kicker">Experience</p><h2>More than a decade<br/><em>shipping products.</em></h2></div><p>From native iOS to cross-platform architecture and technical ownership.</p></div><div className="timeline">{experience.map((e,i)=><article key={e[1]}><span className="year">{e[0]}</span><div className="role"><h3>{e[1]}</h3><p>{e[2]}</p></div><p className="summary">{e[3]}</p><span className="index">0{i+1}</span></article>)}</div></div></section>

      <section id="about" className="section shell about"><div><p className="kicker">How I work</p><h2>Engineering with<br/><em>product ownership.</em></h2></div><div className="about-copy"><p>I work best where mobile software meets operational complexity. I translate product needs into maintainable architecture, prototype uncertain integrations early, and stay close to production until the experience is dependable.</p><div className="pill-grid"><span>Architecture first</span><span>Prototype the risk</span><span>Measure in production</span><span>Own the release</span></div></div></section>

      <section id="education" className="section shell"><div className="section-head"><div><p className="kicker">Education</p><h2>Academic<br/><em>foundation.</em></h2></div></div><div className="timeline"><article><span className="year">2008—2012</span><div className="role"><h3>University of Science, VNU-HCM</h3><p>B.Sc. Information Technology</p></div><p className="summary">Foundation in computer science, software engineering and information systems.</p></article></div></section>

      <footer><div className="shell footer-inner"><p className="kicker">Start a conversation</p><h2>Let&apos;s build something<br/><em>people can rely on.</em></h2><a className="email" href="mailto:thediffest@gmail.com">thediffest@gmail.com <span>↗</span></a><p className="availability">Open to remote/hybrid · Available immediately</p><div className="footer-bottom"><span>© 2026 Tran Hoang Nha</span><div><a href="https://www.linkedin.com/in/nhatran1990" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/thnha" target="_blank" rel="noreferrer">GitHub ↗</a></div><span>Ho Chi Minh City, Vietnam</span></div></div></footer>
    </main>
  );
}
