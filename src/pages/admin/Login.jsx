import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/api";
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await API.post("/login", { email, password });
      login(res.data.token);
      // Using window.location is fine, but navigate() is usually smoother in SPA
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="w-full max-w-[440px] z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-200 mb-4">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter italic text-slate-900">
            ADMIN<span className="text-indigo-600">LOGIN</span>
          </h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Secure Management Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-slate-100">
          <form onSubmit={submit} className="space-y-6">
            
            {error && (
              <div className="bg-rose-50 text-rose-600 text-xs font-bold p-4 rounded-xl border border-rose-100 animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="email"
                  placeholder="admin@worksync.com" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  SIGN IN TO DASHBOARD
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
          Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};

export default Login;