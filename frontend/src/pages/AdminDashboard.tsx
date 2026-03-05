import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
const approvals = [
  { name: "Elena Rodriguez", role: "Coffee Producer • Huehuetenango, GT", time: "2 hours ago", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-qR7dlsehamJ62juf1bhNzWPkg4QZaKxdLu-84BhAPHy935xCZY-7CsYskIf45QmF7Ebx_YVHs1sUG1jFUkntj1Y-J0y3EHaIWc8d_Hx1FtM-q1p2Q-lclhfhsQcNApPV9EYtNEwzvF0fmG9vzof9k0pyalBkb87i9SD04ucwLZPxJxhvxM19hq-DQCxw11y1m6jViQxC4IzyOTyLIf5SGLeNkpBqSO5O-UAeb3xX4Q4CNyyIT0bLIDfrN23MYsUV7p_8Jj4GNIrj" },
  { name: "Marco Silva", role: "Manufacturer • São Paulo, BR", time: "5 hours ago", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2OBJLrTPSp6ilS5eppM81lpVY2XSi9BQ85XO3yXrQTVI2jYeYaF5OQHPBWr9klOUOtdmbttixRsvOWE9HTY_nUiijAh_x5dcBJQ8_VPUUS0y5lW8maChHxA1Q1-UgeHAVadwf_9nvqyvQbHWpoWuvgekaPtwmCaf_S5ucQQqbYWegUVJdZSiGd_8MMaevmphn4zt6g37OnZno3ldjGLofJkFCr0mYpet-9_YhAhUGFaLWU5DPYtHoEboMFjq41JUiKKhWLKOqBfk3" },
  { name: "Thomas Kenji", role: "Organic Cooperative • Kyoto, JP", time: "Yesterday", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA36zuKjObrK7T3jn4HMrU7vH1ZdLsQpMqseHlQMDD63NS2Dqzw6t_a7jcXhCMM8MHWjubFQuqfxQQG6u0Tc4c1H4tI9-gA8WEuUERI9j2NHbmwMnCahwMKYDSTXoKFWI5lqTICvCs5oKNM1mKWkCKuI0GpHar_w8B-5wW0lopyGgqHPUnLaPVzLIDKHSjRDQzyxemTyggQq3tdQKHnjCQVi9Oy_M5gHDNQ5nrLExpcPZMBkGu_O9ZY7oT0cxYH5etQYoClDqVppKS4" },
];

const logs = [
  { color: "bg-emerald-500", glow: "shadow-[0_0_8px_rgba(16,185,129,0.5)]", title: "New Batch Verified", desc: "Batch #AG-9421 processed via Blockchain Node 4.", time: "12 mins ago" },
  { color: "bg-blue-500", glow: "shadow-[0_0_8px_rgba(59,130,246,0.5)]", title: "Storage Optimization Complete", desc: "Automated database pruning routine finished successfully.", time: "45 mins ago" },
  { color: "bg-orange-500", glow: "shadow-[0_0_8px_rgba(245,158,11,0.5)]", title: "API Rate Limit Alert", desc: "Logistics-API-03 reaching 85% of allocated capacity.", time: "2 hours ago" },
  { color: "bg-primary", glow: "shadow-[0_0_8px_rgba(45,89,39,0.5)]", title: "New User Registration", desc: "Admin 'David' invited 'Sarah' to Manufacturer Portal.", time: "3 hours ago" },
  { color: "bg-emerald-500", glow: "", title: "Backup Completed", desc: "System state successfully mirrored to North Region.", time: "5 hours ago" },
];

const sidebarItems = [
  { icon: "dashboard", label: "System Overview", active: true },
  { icon: "group", label: "User Management" },
  { icon: "agriculture", label: "Farmer Submissions" },
  { icon: "factory", label: "Manufacturer Logs" },
];

const AdminDashboard = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [formData, setFormData] = useState({
    testId: `TEST-${Math.floor(Math.random() * 10000)}`,
    moisturePercentage: '12',
    pesticideStatus: 'Passed',
    labName: 'AgriTrace Core Lab',
    testDate: new Date().toISOString()
  });

  const { toast } = useToast();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchCollections = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.get(`${API_URL}/api/chain/all-collections`);
      setCollections(res.data);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: err.response?.data?.msg || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRunTest = (collectionId: string) => {
    setSelectedCollection(collectionId);
    setFormData({ ...formData, testId: `TEST-${Math.floor(Math.random() * 10000)}` });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, collectionId: selectedCollection };
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.post(`${API_URL}/api/chain/test`, payload);
      toast({ title: "Success", description: "Lab Quality Test certified on the blockchain!" });
      setIsModalOpen(false);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.response?.data?.error || err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-primary/10 bg-card flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-foreground text-2xl">eco</span>
          </div>
          <div>
            <h1 className="text-primary font-bold text-lg leading-tight">AgriTrace</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Admin Portal</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <a key={item.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${item.active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-primary/10 hover:text-primary"} transition-colors`} href="#">
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </a>
          ))}
          <div className="mt-4 pt-4 border-t border-primary/10">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Support & Admin</p>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors font-medium" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm">System Settings</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors font-medium" href="#">
              <span className="material-symbols-outlined">verified_user</span>
              <span className="text-sm">Security Logs</span>
            </a>
          </div>
        </nav>
        <div className="p-4 border-t border-primary/10">
          <div className="bg-primary/5 rounded-xl p-3 flex items-center gap-3">
            <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCZbpPBo6G8p1uWSBPzaDz_YDFeYTe6wrrQDFUnvL7pja5r4HY3JzDJt4Wbry1hyYHm24EGvWBTExFNs2n7NAj4cAgrW3rJgqeFqyTZpi28VrbSK9sOI2elaSZiQymaxqUJNa-H8JIXqEbnnNsGkb_BcEMIztcw3KejMh3t_0VCNaFJexGRUXWeCswqe02sGaDWw61oeCPba5Ux69QITcjlZB4y52BQLWwzrwj-t06hY0xD8CKL3ZeYcxxxBjZiuBucCsspvrbG14O-')` }}></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.name || "System Admin"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.role === 'lab' ? "Lab Auditor" : "System Admin"}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full mt-3 flex items-center justify-center gap-2 py-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-16 border-b border-primary/10 bg-card px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-background border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground outline-none" placeholder="Search for farmers, batches, or logs..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:bg-primary/5 rounded-lg transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 border-2 border-card rounded-full"></span>
            </button>
            <button className="p-2 text-muted-foreground hover:bg-primary/5 rounded-lg transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-8 w-[1px] bg-primary/10 mx-2"></div>
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-muted-foreground">SERVER STATUS</p>
              <div className="flex items-center justify-end gap-1.5">
                <span className="size-2 bg-emerald-500 rounded-full"></span>
                <span className="text-xs font-medium text-emerald-600">Operational</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">System Overview</h2>
            <p className="text-muted-foreground mt-1">Real-time agricultural traceability analytics and administrative monitoring.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Farmers", value: "1,240", change: "+12.5%", changeColor: "text-emerald-600", note: "vs last month", icon: "agriculture", iconBg: "bg-primary/10 text-primary" },
              { label: "Active Batches", value: "856", change: "+5.2%", changeColor: "text-emerald-600", note: "processing now", icon: "inventory_2", iconBg: "bg-primary/10 text-primary" },
              { label: "Pending Approvals", value: "14", change: "Urgent", changeColor: "text-orange-600", note: "requires review", icon: "pending_actions", iconBg: "bg-orange-100 text-orange-600" },
              { label: "System Uptime", value: "99.9%", change: "0 Downtime", changeColor: "text-muted-foreground", note: "past 30 days", icon: "dns", iconBg: "bg-blue-50 text-blue-600" },
            ].map((s) => (
              <div key={s.label} className="bg-card p-6 rounded-xl border border-primary/10 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground text-sm font-medium">{s.label}</span>
                  <div className={`p-2 rounded-lg ${s.iconBg}`}>
                    <span className="material-symbols-outlined">{s.icon}</span>
                  </div>
                </div>
                <p className="text-3xl font-black tracking-tight">{s.value}</p>
                <div className="flex items-center gap-1 mt-2 font-bold text-sm">
                  <span className={`material-symbols-outlined text-sm ${s.changeColor}`}>{s.change.startsWith("+") ? "trending_up" : s.change === "Urgent" ? "priority_high" : "history"}</span>
                  <span className={s.changeColor}>{s.change}</span>
                  <span className="text-muted-foreground font-normal ml-1">{s.note}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dialog Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
              <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl p-6 relative border border-primary/20 animate-in fade-in zoom-in-95 duration-200">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                  <span className="material-symbols-outlined">close</span>
                </button>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold">Lab Quality Certification</h3>
                  <p className="text-muted-foreground text-sm mt-1">Record purity parameters for Collection {selectedCollection}.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Test ID</label>
                      <input name="testId" value={formData.testId} className="w-full h-10 px-3 bg-muted border border-border rounded-lg outline-none text-muted-foreground text-sm" readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Lab Name</label>
                      <input name="labName" value={formData.labName} onChange={handleFormChange} required className="w-full h-10 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Moisture Percentage (%)</label>
                    <input type="number" step="0.1" name="moisturePercentage" value={formData.moisturePercentage} onChange={handleFormChange} required className="w-full h-10 px-3 bg-background border border-primary/30 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Pesticide Detection Status</label>
                    <select name="pesticideStatus" value={formData.pesticideStatus} onChange={handleFormChange} className="w-full h-10 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary">
                      <option value="Passed">Passed (Undetected)</option>
                      <option value="Warning">Warning (Trace amounts)</option>
                      <option value="Failed">Failed (Over limits)</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button disabled={isSubmitting} type="submit" className="shadow-lg">
                      {isSubmitting ? "Certifying..." : "Certify Quality"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Approvals + Logs */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-card rounded-xl border border-primary/10 overflow-hidden">
              <div className="px-6 py-5 border-b border-primary/10 flex items-center justify-between">
                <h3 className="font-bold text-lg">Farmer Submissions Pending Testing</h3>
                <Button variant="outline" size="sm" onClick={fetchCollections}>
                  <span className="material-symbols-outlined text-sm">refresh</span> Refresh
                </Button>
              </div>
              <div className="overflow-x-auto min-h-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center p-8 text-muted-foreground">Loading from blockchain...</div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Collection ID</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Herb</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Collector</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                      {collections.length > 0 ? collections.map((c: any) => (
                        <tr key={c.collectionId} className="hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-4 font-mono text-sm font-bold text-primary">{c.collectionId}</td>
                          <td className="px-6 py-4 text-sm font-medium">{c.herbName}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{c.collectorName}</td>
                          <td className="px-6 py-4 text-right">
                            <Button size="sm" onClick={() => handleRunTest(c.collectionId)}>Run Quality Test</Button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No pending collections found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-primary/10 flex flex-col">
              <div className="px-6 py-5 border-b border-primary/10">
                <h3 className="font-bold text-lg">System Health Logs</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-6">
                {logs.map((l, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`mt-1 flex-shrink-0 size-2 ${l.color} rounded-full ${l.glow}`}></div>
                    <div>
                      <p className="text-sm font-bold">{l.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{l.desc}</p>
                      <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">{l.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-primary/5 mt-auto">
                <button className="w-full py-2 bg-card text-muted-foreground font-bold text-xs rounded-lg border border-primary/10 hover:border-primary transition-colors uppercase tracking-wider">
                  Full Maintenance Report
                </button>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-8 bg-card rounded-xl border border-primary/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg">Global Batch Distribution</h3>
                <p className="text-sm text-muted-foreground">Live monitoring of active transit routes across regions.</p>
              </div>
              <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold flex items-center gap-2">
                <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                Live Traffic
              </div>
            </div>
            <div className="h-64 bg-muted rounded-lg relative overflow-hidden flex items-center justify-center border border-primary/5">
              <div className="relative z-10 text-center px-4">
                <p className="text-muted-foreground font-medium italic">Interactive Geographic Map UI would render here</p>
                <div className="mt-4 flex gap-8 justify-center">
                  {[{ v: "342", r: "Americas" }, { v: "511", r: "Africa" }, { v: "189", r: "Asia" }].map((d) => (
                    <div key={d.r} className="text-center">
                      <p className="text-2xl font-black text-primary">{d.v}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{d.r}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
