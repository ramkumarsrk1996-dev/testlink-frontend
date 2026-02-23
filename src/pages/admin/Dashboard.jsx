import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  HelpCircle, 
  FilePlus, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  Users
} from "lucide-react";

const Dashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Positions", path: "/admin/positions", icon: Briefcase, color: "text-blue-500" },
    { label: "Questions", path: "/admin/questions", icon: HelpCircle, color: "text-amber-500" },
    { label: "Generate Test", path: "/admin/generate-test", icon: FilePlus, color: "text-emerald-500" },
     { label: "Results", path: "/admin/results", icon: Users, color: "text-violet-500" },
  ];

  const stats = [
    { label: "Positions", val: "0", icon: Briefcase, bg: "border-l-blue-500" },
    { label: "Questions", val: "0", icon: HelpCircle, bg: "border-l-amber-500" },
    { label: "Tests", val: "0", icon: Users, bg: "border-l-emerald-500" },
    { label: "Results", val: "0", icon: Users, bg: "border-l-emerald-500" },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-sans">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
        <div className="p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter italic leading-none">
                TEST<span className="text-indigo-600">LINK</span>
              </h2>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
                Admin Controller
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">

            <div className="pt-6 pb-2 px-5">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Management</p>
            </div>

            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                  {item.label}
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="mt-auto p-8 border-t border-slate-50">
          <button 
            type="button"
            onClick={() => navigate("/admin")}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black tracking-widest hover:bg-rose-600 transition-all uppercase shadow-lg shadow-slate-200"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC] relative">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-[#F8FAFC]/80 backdrop-blur-md px-10 py-6 flex justify-between items-center border-b border-slate-200/50">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Control Center</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator Active</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 pr-4 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-900 leading-none">{user?.name || "Admin"}</p>
                <p className="text-[9px] font-bold text-indigo-500 uppercase mt-1">Super User</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="p-10 max-w-[1400px] mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className={`bg-white p-8 rounded-2xl border-l-4 ${stat.bg} shadow-md hover:shadow-xl transition-all duration-300 group`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{stat.val}</span>
                  <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                    <stat.icon size={28} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Generate Test CTA */}
          <div className="bg-indigo-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 group">
            <div className="relative z-10 max-w-xl">
              <span className="bg-indigo-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">
                Primary Tool
              </span>
              <h2 className="text-5xl font-black mb-6 leading-[1.1] tracking-tighter">
                Generate a New <br/>Assessment Test
              </h2>
              <p className="text-indigo-200/80 mb-10 font-medium text-lg leading-relaxed">
                Instantly compile optimized testing links by selecting difficulty, technology stacks, and candidate positions.
              </p>
              <button 
                type="button"
                onClick={() => navigate("/admin/generate-test")}
                className="bg-white text-indigo-900 px-10 py-5 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl"
              >
                OPEN GENERATOR <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Design Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="absolute bottom-[-20%] right-[15%] w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-30"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
