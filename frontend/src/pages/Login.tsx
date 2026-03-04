import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'collector'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let data;
      if (isRegistering) {
        data = await register(formData.name, formData.email, formData.password, formData.role);
        toast({
          title: "Registration successful",
          description: "Welcome to HerbChain!",
        });
      } else {
        data = await login(formData.email, formData.password);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }

      // Redirect based on backend role enum
      const role = data.role === 'farmer' ? 'collector' : data.role;
      if (role === 'collector') navigate('/farmer');
      else if (role === 'manufacturer') navigate('/manufacturer');
      else if (role === 'lab') navigate('/admin');
      else navigate('/');

    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: err.response?.data?.msg || "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-primary/10 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <span className="material-symbols-outlined text-xl">eco</span>
          </div>
          <h1 className="text-foreground text-xl font-bold tracking-tight">HerbChain</h1>
        </Link>
        <div className="flex items-center gap-4">
          <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">Support</a>
          <Button size="sm">System Status</Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-card rounded-xl overflow-hidden shadow-2xl border border-primary/5">
          {/* Left Image Panel */}
          <div className="hidden lg:block relative min-h-[600px]">
            <div className="absolute inset-0 bg-primary/10 flex flex-col justify-end p-12 text-white z-10">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
              <div className="relative z-20">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4">Sustainability First</span>
                <h2 className="text-4xl font-black leading-tight mb-4">Transparency from Seed to Store</h2>
                <p className="text-white/90 text-lg font-light leading-relaxed">
                  Join thousands of producers and distributors in the global effort to ensure sustainable agricultural practices through blockchain-verified data.
                </p>
              </div>
            </div>
            <img alt="Lush green rows of crops in a field" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAASs3zBnJbg8ICBXWEcNO3AJaCfEiE8LHOk03AZvH8-WadLFSC5KTLn7rhJlDg96zD9GurvIBbVIYFp3KDi0CtwMTsXtRghNs_qo9UCvur_AlTfjvhP_AJ_-B2XwJQ667ljDULEd062d7kghUC4R1KzzwZ4N6QFvR3mGalXhcjztetNTRcPV7-3BTSIUfdPQUgSG8zEDRB7viVxqLkSo7JYWb4eJAR7i_qx7_KRZ1JvgRgR6qCfGRlNm9TETFH3kyRhp8uWJ_iWBbC" />
          </div>

          {/* Right Form Panel */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-3xl font-black leading-tight">{isRegistering ? "Create Account" : "Welcome Back"}</h3>
              <p className="text-muted-foreground mt-2">
                {isRegistering ? "Join our agricultural supply chain network." : "Log in to manage your agricultural supply chain network."}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {isRegistering && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Full Name</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">person</span>
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full h-14 bg-background border border-border rounded-xl pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="John Doe" type="text" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Your Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full h-14 bg-background border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none">
                  <option disabled value="">Select your professional role</option>
                  <option value="collector">Farmer / Producer (Collector)</option>
                  <option value="manufacturer">Distributor / Manufacturer</option>
                  <option value="lab">Environmental Auditor (Lab)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">mail</span>
                  <input name="email" value={formData.email} onChange={handleChange} required className="w-full h-14 bg-background border border-border rounded-xl pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="name@company.com" type="email" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold">Password</label>
                  {!isRegistering && <a className="text-xs font-bold text-primary hover:underline" href="#">Forgot password?</a>}
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">lock</span>
                  <input name="password" value={formData.password} onChange={handleChange} required className="w-full h-14 bg-background border border-border rounded-xl pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="••••••••" type="password" />
                </div>
              </div>

              {!isRegistering && (
                <div className="flex items-center gap-2 px-1">
                  <input className="rounded border-border text-primary focus:ring-primary" id="remember" type="checkbox" />
                  <label className="text-sm text-muted-foreground" htmlFor="remember">Keep me logged in for 30 days</label>
                </div>
              )}

              <Button disabled={isLoading} className="w-full h-14 rounded-xl font-bold shadow-lg shadow-primary/20 group" type="submit">
                {isLoading ? "Processing..." : (isRegistering ? "Create Account" : "Sign In to AgriTrace")}
                {!isLoading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-4 text-muted-foreground font-bold tracking-widest">
                    {isRegistering ? "Already have an account?" : "New to the platform?"}
                  </span>
                </div>
              </div>

              <Button onClick={() => setIsRegistering(!isRegistering)} variant="outline" className="w-full h-14 border-2 border-primary/20 hover:border-primary/40 text-primary rounded-xl font-bold" type="button">
                <span className="material-symbols-outlined">{isRegistering ? "login" : "person_add"}</span>
                {isRegistering ? "Sign In Instead" : "Create Partner Account"}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-8">
              By logging in, you agree to our <a className="underline" href="#">Terms of Service</a> and <a className="underline" href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full px-6 py-8 flex flex-col md:flex-row items-center justify-between text-muted-foreground text-sm">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <p>© 2026 HerbChain Systems Inc.</p>
          <div className="flex items-center gap-2">
            <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium">All systems operational</span>
          </div>
        </div>
        <div className="flex gap-6">
          <a className="hover:text-primary transition-colors" href="#">Global Network</a>
          <a className="hover:text-primary transition-colors" href="#">Security</a>
          <a className="hover:text-primary transition-colors" href="#">Resources</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
