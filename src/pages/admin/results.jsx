import { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  Mail,
  Phone,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  Info
} from "lucide-react";

/* ---------- helpers ---------- */
const renderAnswer = (text) => {
  if (!text) {
    return <span className="italic text-slate-400">Not Answered</span>;
  }
  return <span>{text}</span>;
};

const statusBadge = (status) => {
  if (status === "Correct") {
    return (
      <div className="bg-emerald-50 p-1.5 rounded-full">
        <CheckCircle2 size={16} className="text-emerald-500" />
      </div>
    );
  }
  if (status === "Pending") {
    return (
      <div className="bg-amber-50 p-1.5 rounded-full">
        <ShieldCheck size={16} className="text-amber-500" />
      </div>
    );
  }
  return (
    <div className="bg-rose-50 p-1.5 rounded-full">
      <XCircle size={16} className="text-rose-400" />
    </div>
  );
};
/* ---------- helpers ---------- */

const Results = () => {
  const { token } = useContext(AuthContext);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  useEffect(() => {
    API.get("/results", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const filteredResults = results.filter((r) => {
    const appliedPosition =
      r.review?.find(q => q.position_name)?.position_name || "";

    return (
      r.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appliedPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.candidate.father_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredResults.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredResults.length / recordsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Results Hub</h1>
            <p className="text-slate-500 font-medium mt-1">Review candidate performance and assessment analytics.</p>
          </div>

          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              className="pl-12 pr-4 py-3 border border-slate-200 rounded-xl w-80 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Search candidate or position"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* RESULTS */}
        {currentRecords.map((r, idx) => {
          const appliedPosition =
            r.review?.find(q => q.position_name)?.position_name || "General";
          
          // Logic for written question counting
          const writtenCount = r.review?.filter(q => q.question_type.toLowerCase() === 'written').length || 0;

          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 mb-16 shadow-sm overflow-hidden"
            >
              {/* Candidate Info Header */}
              <div className="p-8 border-b border-slate-100">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">
                      {r.candidate.name}
                    </h2>

                    <p className="text-xs font-bold text-indigo-600 uppercase mt-1 tracking-wider">
                      Applied: {appliedPosition}
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <UserCheck size={14} className="text-slate-400" />
                        {r.candidate.father_name || "N/A"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(r.candidate.dob).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-500 font-medium lg:border-l lg:pl-8 border-slate-100">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      {r.candidate.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      {r.candidate.phone}
                    </div>
                  </div>

                  {/* SCORE SECTION - UPDATED UI */}
                  <div className="text-right flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-end gap-2 group relative">
                            <p className="text-4xl font-black text-slate-900">
                            {r.score} <span className="text-slate-300 text-2xl">/</span> {r.total}
                            </p>
                        </div>
                        <div className="mt-2 text-[10px] uppercase font-bold text-indigo-500 flex items-center justify-end gap-1">
                            <ShieldCheck size={12} />
                            System Calculated
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                        <p className="text-[11px] font-bold text-slate-500 mb-1">
                            Progress: {r.attempted} Questions Attempted
                        </p>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] text-slate-400 italic leading-tight max-w-[200px]">
                                *Objective scores (Single/Multi/TF) are final.
                            </span>
                            {writtenCount > 0 && (
                                <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-[10px] font-bold border border-amber-100">
                                    <AlertCircle size={10} />
                                    {writtenCount} Written Answer(s) excluded from total
                                </span>
                            )}
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Review Grid */}
              <div className="p-8 bg-slate-50/50">
                <div className="grid md:grid-cols-2 gap-6">
                  {r.review.map((q, i) => (
                    <div
                      key={i}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between mb-3">
                        <span className="text-xs font-bold text-indigo-400 px-2 py-1 bg-indigo-50 rounded-lg">
                          Q{i + 1} · {q.question_type.toUpperCase()}
                        </span>
                        {statusBadge(q.status)}
                      </div>

                      <p className="text-sm font-semibold text-slate-800 mb-4 leading-relaxed">
                        “{q.question}”
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                            Candidate Answer
                          </p>
                          <p className="text-xs font-bold text-slate-700">
                            {renderAnswer(q.candidate_answer)}
                          </p>
                        </div>

                        <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                          <p className="text-[10px] uppercase font-bold text-emerald-500 mb-1">
                            Correct Answer
                          </p>
                          <p className="text-xs font-bold text-emerald-700">
                            {q.question_type.toLowerCase() === 'written' 
                                ? <span className="text-amber-600 italic font-medium">Manual Check Required</span> 
                                : renderAnswer(q.correct_answer)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-12 pb-12">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                  setCurrentPage(p => p - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 border border-slate-200 rounded-xl hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="bg-white px-6 py-2 rounded-full border border-slate-200 shadow-sm">
                <span className="font-bold text-slate-600">
                Page {currentPage} <span className="text-slate-300 mx-1">of</span> {totalPages}
                </span>
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                  setCurrentPage(p => p + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 border border-slate-200 rounded-xl hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;