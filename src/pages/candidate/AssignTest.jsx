import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/api";
import { 
  Loader2,
  MoveRight,
  Clock3,
  Briefcase
} from "lucide-react";

const AssignTest = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      try {
        const res = await API.get(`/test/${token}`);
        setTest(res.data);
      } catch (err) {
        setError("This invitation has expired or is no longer valid.");
      } finally {
        setLoading(false);
      }
    };
    validate();
  }, [token]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="animate-spin text-slate-900" size={24} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-4">Expired.</h1>
        <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">{error}</p>
        <button onClick={() => window.location.reload()} className="text-xs font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1">Refresh Authorization</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 md:p-12 font-sans antialiased text-slate-900">
      <div className="max-w-3xl w-full border-l border-slate-100 pl-8 md:pl-16 relative">
        
        {/* Decorative Vertical Line Accent */}
        <div className="absolute left-0 top-0 w-[2px] h-20 bg-indigo-600"></div>

        {/* Header Section */}
        <header className="mb-24">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Official Secure Invite</p>
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic italic">
            ASSESS<br />MENT<span className="text-indigo-600">.</span>
          </h1>
        </header>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          
          {/* Role Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <Briefcase size={16} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Target Role</h2>
            </div>
            <p className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              {test.position}
            </p>
          </section>

          {/* Timing Info */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <Clock3 size={16} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Schedule Details</h2>
            </div>
            
            <div className="flex gap-12">
              <div>
                <p className="text-4xl font-bold tracking-tight">{test.duration_minutes}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Minutes Net</p>
              </div>
              <div>
                <p className="text-4xl font-bold tracking-tight">15</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Check-in Prior</p>
              </div>
            </div>
          </section>

        </div>

        {/* Action Section */}
        <footer className="pt-12 border-t border-slate-50">
          <button
            onClick={() => navigate("/candidate-info", { state: test })}
            className="group flex items-center gap-8 text-left"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-500">
                <MoveRight size={32} className="group-hover:text-white group-hover:translate-x-1 transition-all duration-500" />
              </div>
              {/* Spinning text or additional ring could go here */}
            </div>
            
            <div>
              <p className="text-lg font-bold tracking-tight mb-1">Begin Secure Registration</p>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">
                Accept invite & finalize candidate profile
              </p>
            </div>
          </button>
        </footer>

      </div>
    </div>
  );
};

export default AssignTest;