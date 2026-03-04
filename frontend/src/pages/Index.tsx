import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-background/60 backdrop-blur-xl px-6 py-4 lg:px-20 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-primary rounded-lg p-1.5 text-primary-foreground shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <span className="material-symbols-outlined text-2xl">eco</span>
          </div>
          <h2 className="text-foreground text-xl font-bold tracking-tight">HerbChain</h2>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors" href="#">Solutions</a>
          <a className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors" href="#">Traceability</a>
          <a className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors" href="#">Security</a>
          <a className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors" href="#">About</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" className="hidden sm:flex border-primary/20 text-primary hover:bg-primary/10">Login</Button>
          </Link>
          <Link to="/login">
            <Button className="shadow-lg shadow-primary/20">Register</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 lg:px-20 py-10">
          <div
            className="relative overflow-hidden rounded-xl lg:rounded-3xl min-h-[500px] lg:min-h-[600px] flex flex-col items-center justify-center text-center px-4"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuC5rfihjeetYcrzeaD9osiNjwDv4eS5lxKF8xPMMHI1S5QA4u-MUHS2-3anWSYGmYt4U4RRWJjd8ip6ONVo4JuUaamvMUq2e_D3TsvPy1nwKReEvaNOA46ZQ41OLnFZbyfbXkHpGD9Q736Mx1q3Tw8C03REdBSKUcVxsx603MEkzqfrKSoWUl0FiMtd2Ecz5VQgTfeqliIzjRKcHmICAE51pfkGdp6dd0F0Ewr63NtCD2jnZCn8AyoIvYkyyvr-2NTBqNL23NQ8rxNi")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="max-w-4xl space-y-6">
              <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                Blockchain Traceability for <span className="text-green-400">Sustainable</span> Agriculture
              </h1>
              <p className="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto font-normal">
                Empowering farmers and consumers with transparent, secure, and verifiable food supply chains from farm to fork.
              </p>
              <div className="flex flex-col sm:flex-row w-full max-w-2xl mx-auto bg-white rounded-xl lg:rounded-2xl p-2 shadow-2xl">
                <div className="flex items-center px-4 text-slate-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input className="flex-1 border-none focus:ring-0 text-slate-900 px-2 py-4 font-medium outline-none bg-transparent" placeholder="Enter Product ID or Batch Number" type="text" />
                <Link to="/traceability">
                  <Button className="px-8 py-4 h-auto rounded-lg lg:rounded-xl font-bold">Check Product</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="px-6 lg:px-20 py-20 bg-card">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black">How it Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Our end-to-end blockchain integration ensures total visibility across the supply chain.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {[
                { icon: "potted_plant", title: "Farmer Registration", desc: "Crops are harvested and logged on the blockchain with integrated IoT soil and weather sensors." },
                { icon: "factory", title: "Manufacturer Verification", desc: "Processing and packaging details are immutable, time-stamped, and cryptographically signed." },
                { icon: "shopping_cart", title: "Consumer Transparency", desc: "Scan QR codes at retail points to see the entire verified journey of your food products." },
              ].map((step) => (
                <div key={step.title} className="flex flex-col items-center text-center space-y-6 relative z-10 group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-8 ring-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <span className="material-symbols-outlined text-4xl">{step.icon}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
              <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-0"></div>
            </div>
          </div>
        </section>

        {/* Blockchain Security */}
        <section className="px-6 lg:px-20 py-20">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black leading-tight">
                  Advanced Blockchain <br /><span className="text-primary">Security Architecture</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our decentralized ledger ensures that agricultural data remains tamper-proof, transparent, and instantly accessible to all authorized stakeholders in the ecosystem.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {[
                  { icon: "shield_lock", title: "Immutable Records", desc: "Once data is logged, it cannot be altered by any single party, preventing fraud." },
                  { icon: "public", title: "Real-time Global Tracking", desc: "Monitor global logistics and storage conditions with live sensor integration." },
                  { icon: "description", title: "Smart Contracts", desc: "Automated escrow payments and compliance checks for ethical fair trade." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-sm border border-primary/5 hover:shadow-md hover:border-primary/20 transition-all duration-300 hover:translate-x-1 cursor-default">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-square bg-primary/5 flex items-center justify-center p-8 border border-primary/10">
                <img alt="Blockchain technology abstract network" className="rounded-2xl object-cover w-full h-full grayscale opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGj4VGh6YvFgMZnTnl3sPgACXegTALPz1VcUf0P3Su5MJ-FV5nFxtSx7x2C3TgkYZetSWRBjTVEHVvhjEWewvj6Tc04-rhDdPa4KQLNKOXahbFH1I7SSDx2lF0QFwdGAycFjodNKaPko6n-XFpB_nGkwHsHYgU459U0RCKvA0oDXnCiBf_ZpA9TciKiXLkMbnNua2t1z7JsExPw38u8OIyqU3ITsvXZOx56HvmMuDEW-lTzLFMKn92FiOEJyXTdZ4FKaZYWJb27rxt" />
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-md p-6 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.15)] border border-primary/30 w-3/4 animate-in slide-in-from-bottom-4 duration-1000 ease-out">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-green-500 w-3 h-3 rounded-full animate-ping"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary drop-shadow-sm">Live Network Sync</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-2 w-4/5 bg-primary rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground font-mono">
                      <span>BLK: #4,829,102</span>
                      <span className="text-primary">TPS: 2,400</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl -z-0"></div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 lg:px-20 py-20">
          <div className="max-w-6xl mx-auto bg-primary rounded-3xl p-10 lg:p-20 text-center space-y-8 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl lg:text-5xl font-black text-primary-foreground">Ready to Secure Your Supply Chain?</h2>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">Join thousands of farmers and distributors who trust AgriTrace for transparent agricultural commerce.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="bg-white text-primary px-10 py-4 h-auto rounded-xl font-bold text-lg hover:bg-slate-100 shadow-xl">Get Started Now</Button>
                </Link>
                <Button variant="outline" size="lg" className="border-white/20 text-primary-foreground px-10 py-4 h-auto rounded-xl font-bold text-lg hover:bg-white/10 bg-transparent">Schedule Demo</Button>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"></path>
                  </pattern>
                </defs>
                <rect fill="url(#grid)" height="100%" width="100%"></rect>
              </svg>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-primary/10 px-6 lg:px-20 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center bg-primary rounded-lg p-1.5 text-primary-foreground">
                <span className="material-symbols-outlined text-xl">eco</span>
              </div>
              <h2 className="text-primary text-xl font-bold tracking-tight">AgriTrace</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">The future of sustainable and transparent food supply chains powered by decentralized technology.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a className="hover:text-primary transition-colors" href="#">Traceability Engine</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">IoT Integration</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Farmer Portal</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">API Access</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Sustainability</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Partners</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Newsletter</h4>
            <p className="text-sm text-muted-foreground">Stay updated on agricultural tech trends.</p>
            <div className="flex gap-2">
              <Input className="bg-muted border-none rounded-lg text-sm flex-1" placeholder="Email" type="email" />
              <Button size="icon" className="rounded-lg">
                <span className="material-symbols-outlined">send</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-12 mt-12 border-t border-muted flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium">
          <p>© 2024 AgriTrace Blockchain Solutions. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-primary transition-colors" href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
