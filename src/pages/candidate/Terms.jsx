import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  ShieldAlert, 
  Clock, 
  RefreshCcw, 
  MousePointer2, 
  CheckCircle2, 
  FileText,
  AlertTriangle,
  Play
} from "lucide-react";

const Terms = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);

  const rules = [
    {
      icon: ShieldAlert,
      title: "Integrity Policy",
      desc: "Any attempt to use external help, AI tools, or search engines will result in immediate disqualification.",
      color: "text-rose-500",
      bg: "bg-rose-50"
    },
    {
      icon: Clock,
      title: "Automatic Submission",
      desc: "Once the timer hits zero, your answers will be captured and submitted automatically.",
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    {
      icon: RefreshCcw,
      title: "Session Persistence",
      desc: "Do not refresh or close the browser tab. Doing so may invalidate your current session.",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: MousePointer2,
      title: "Proctored Environment",
      desc: "Tab switching and window resizing are monitored. Keep the test window active at all times.",
      color: "text-indigo-500",
      bg: "bg-indigo-50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative">
      <div className="max-w-2xl w-full z-10">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center"><CheckCircle2 size={16}/></div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Verify</span>
          </div>
          <div className="w-12 h-[2px] bg-emerald-500"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center"><CheckCircle2 size={16}/></div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Profile</span>
          </div>
          <div className="w-12 h-[2px] bg-indigo-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center ring-4 ring-indigo-50">3</div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Rules</span>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
          <div className="p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-slate-900 p-3 rounded-2xl text-white">
                <FileText size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Examination Rules</h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Please read carefully</p>
              </div>
            </div>

            {/* Rules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {rules.map((rule, i) => (
                <div key={i} className={`${rule.bg} p-6 rounded-[2rem] border border-white transition-all hover:shadow-sm`}>
                  <rule.icon className={`${rule.color} mb-3`} size={24} />
                  <h3 className="text-sm font-black text-slate-900 mb-1">{rule.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>

            {/* Warning Alert */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 mb-10">
              <AlertTriangle className="text-amber-600 shrink-0" size={20} />
              <p className="text-[11px] font-bold text-amber-800 leading-normal">
                By starting the test, you acknowledge that you are ready and are in a distraction-free environment. 
                The countdown will begin immediately on the next screen.
              </p>
            </div>

            {/* Agreement & Action */}
            <div className="flex flex-col items-center gap-6">
              <label className="flex items-center gap-3 group cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none w-6 h-6 border-2 border-slate-200 rounded-lg checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                    onChange={e => setAgree(e.target.checked)} 
                  />
                  <CheckCircle2 className="absolute text-white opacity-0 peer-checked:opacity-100 left-1 transition-all pointer-events-none" size={16} />
                </div>
                <span className="text-xs font-black text-slate-600 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                  I confirm that I have read and understood the rules
                </span>
              </label>

              <button
                disabled={!agree}
                onClick={() => navigate("/test", { state })}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl shadow-xl shadow-slate-200 hover:bg-emerald-600 hover:shadow-emerald-100 transition-all flex items-center justify-center gap-3 group disabled:opacity-20 disabled:grayscale"
              >
                INITIALIZE ASSESSMENT
                <Play size={18} fill="currentColor" className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;