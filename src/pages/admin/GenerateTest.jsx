import { useEffect, useState } from "react";
import API from "../../api/api";
import {
  FilePlus,
  Clock,
  Briefcase,
  Link as LinkIcon,
  Copy,
  CheckCircle2,
  ChevronRight,
  Loader2
} from "lucide-react";

const TOTAL_QUESTIONS = 15;

const GenerateTest = () => {
  const [positions, setPositions] = useState([]);
  const [positionId, setPositionId] = useState("");
  const [duration, setDuration] = useState(30);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [distribution, setDistribution] = useState({
    single: 7,
    multiple: 4,
    true_false: 2,
    written: 2
  });

  const totalSelected = Object.values(distribution).reduce(
    (sum, v) => sum + v,
    0
  );

  useEffect(() => {
    API.get("/positions").then(r => setPositions(r.data));
  }, []);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await API.post("/create-tests", {
        position_id: positionId,
        duration_minutes: duration,
        total_questions: TOTAL_QUESTIONS,
        distribution
      });
      setLink(res.data.test_link);
    } catch (err) {
      console.error("Error generating link", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const questionTypes = [
    { key: "single", label: "Single Choice" },
    { key: "multiple", label: "Multiple Answer" },
    { key: "true_false", label: "True / False" },
    { key: "written", label: "Written" }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-100">
          <FilePlus className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
            Test Generator
          </h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
            Configure & Deploy Assessments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="space-y-8">

              {/* Position */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Briefcase size={14} /> Target Position
                </label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold"
                  onChange={e => setPositionId(e.target.value)}
                >
                  <option value="">Select a role...</option>
                  {positions.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Clock size={14} /> Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold"
                />
              </div>

              {/* Distribution */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Question Distribution (Total: {TOTAL_QUESTIONS})
                </label>

                {questionTypes.map(t => (
                  <div
                    key={t.key}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-xs font-black text-slate-600">
                      {t.label}
                    </span>

                    <input
                      type="number"
                      min={0}
                      max={TOTAL_QUESTIONS}
                      value={distribution[t.key]}
                      onChange={e => {
                        const value = Number(e.target.value);
                        const updated = {
                          ...distribution,
                          [t.key]: value
                        };

                        const sum = Object.values(updated).reduce(
                          (a, b) => a + b,
                          0
                        );

                        if (sum <= TOTAL_QUESTIONS) {
                          setDistribution(updated);
                        }
                      }}
                      className="w-20 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-black text-center"
                    />
                  </div>
                ))}

                {totalSelected !== TOTAL_QUESTIONS && (
                  <p className="text-[10px] font-black text-rose-500 uppercase">
                    Total must equal {TOTAL_QUESTIONS}
                  </p>
                )}
              </div>

              {/* Generate */}
              <button
                onClick={generate}
                disabled={!positionId || loading || totalSelected !== TOTAL_QUESTIONS}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : "GENERATE SECURE LINK"}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-2">
          {link ? (
            <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white h-full flex flex-col justify-center">
              <CheckCircle2 className="text-emerald-400 mb-4" size={40} />
              <h3 className="text-2xl font-black mb-2">Link Ready!</h3>
              <p className="text-indigo-200 text-xs mb-6">
                Share this link with the candidate.
              </p>

              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 break-all text-xs font-mono mb-6">
                {link}
              </div>

              <button
                onClick={copyToClipboard}
                className={`w-full py-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-indigo-900"
                }`}
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? "COPIED" : "COPY LINK"}
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] h-full flex items-center justify-center text-center p-10">
              <LinkIcon className="text-slate-300" size={32} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateTest;
