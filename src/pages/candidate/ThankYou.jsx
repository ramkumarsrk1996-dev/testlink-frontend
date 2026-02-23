import { CheckCircle2, Home, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        <div className="bg-white rounded-[3rem] p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
            <CheckCircle2 size={48} />
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Response Submitted
          </h1>
          
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            Thank you for completing the assessment. Your responses have been securely logged. 
            Our recruitment team will review your results and get back to you shortly.
          </p>
        </div>
        
        <p className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
          Session Closed Safely
        </p>
      </div>
    </div>
  );
};

export default ThankYou;