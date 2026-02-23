import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api/api";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  ArrowRight, 
  AlertCircle,
  Loader2,
  CheckCircle2
} from "lucide-react";

const CandidateForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    father_name: "",
    dob: "",
    email: "",
    phone: ""
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (Object.values(form).some(v => !v)) {
      setError("Please complete all fields to proceed.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await API.post("/candidate/register", {
        test_id: state.id,
        ...form
      });

      navigate("/terms", {
        state: {
          test: state,
          candidate_id: res.data.candidate_id
        }
      });
    } catch (err) {
      setError("System was unable to register your details. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-[100px] opacity-40"></div>
      
      <div className="max-w-xl w-full z-10">
        {/* Progress Stepper UI */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-100">
              <CheckCircle2 size={16} />
            </div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Verify</span>
          </div>
          <div className="w-12 h-[2px] bg-indigo-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-indigo-50">2</div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Profile</span>
          </div>
          <div className="w-12 h-[2px] bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">3</div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam</span>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          <div className="p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Profile</h1>
              <p className="text-slate-400 text-sm font-medium mt-1">Provide your details to initialize the assessment.</p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl animate-shake">
                <AlertCircle size={18} />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    name="name"
                    placeholder="John Doe" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    onChange={handleChange} 
                  />
                </div>
              </div>

              {/* Father Name & DOB - Two Column on Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Father's Name</label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      name="father_name"
                      placeholder="Robert Doe" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Date of Birth</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      type="date"
                      name="dob"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contact Details</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      name="email"
                      placeholder="email@example.com" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      name="phone"
                      placeholder="+1 234 567 890" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 group mt-4"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    PROCEED TO TERMS
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        <p className="text-center mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Step 2 of 3: Identity Verification</p>
      </div>
    </div>
  );
};

export default CandidateForm;