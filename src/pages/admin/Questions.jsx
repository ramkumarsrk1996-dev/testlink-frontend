import { useEffect, useState } from "react";
import API from "../../api/api";
import {
  HelpCircle,
  Plus,
  CheckCircle2,
  BookOpen,
  Trash2,
  Filter,
  Layers,
  Save,
  Loader2,
  AlignLeft,
  CheckSquare,
  ToggleLeft,
  XCircle
} from "lucide-react";

const QUESTION_TYPES = [
  { value: "single", label: "Single Choice", icon: CheckSquare },
  { value: "multiple", label: "Multiple Answer", icon: CheckSquare },
  { value: "true_false", label: "True / False", icon: ToggleLeft },
  { value: "written", label: "Written", icon: AlignLeft }
];

const Questions = () => {
  const [positions, setPositions] = useState([]);
  const [positionId, setPositionId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    question: "",
    type: "single",
    options: { a: "", b: "", c: "", d: "" },
    correct: "A",
    correctMultiple: []
  });

  /* ===============================
      DATA FETCHING
  =============================== */
  useEffect(() => {
    API.get("/positions").then(r => setPositions(r.data));
  }, []);

  const loadQuestions = async (pid) => {
    if (!pid) return;
    try {
      const res = await API.get(`/questions?position_id=${pid}`);
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to load questions");
    }
  };

  /* ===============================
      HANDLERS
  =============================== */
  const toggleMultiple = val => {
    setForm(f => ({
      ...f,
      correctMultiple: f.correctMultiple.includes(val)
        ? f.correctMultiple.filter(v => v !== val)
        : [...f.correctMultiple, val]
    }));
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await API.delete(`/questions/${id}`);
      loadQuestions(positionId);
    } catch (err) {
      alert("Delete failed");
    }
  };

  const addQuestion = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await API.post("/questions", {
        position_id: positionId,
        question: form.question,
        question_type: form.type,
        option_a: form.options.a,
        option_b: form.options.b,
        option_c: form.options.c,
        option_d: form.options.d,
        correct_option:
          form.type === "multiple" || form.type === "written"
            ? null
            : form.correct,
        correct_options:
          form.type === "multiple" ? form.correctMultiple : null
      });

      setForm({
        question: "",
        type: "single",
        options: { a: "", b: "", c: "", d: "" },
        correct: "A",
        correctMultiple: []
      });

      loadQuestions(positionId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase italic text-slate-900 leading-none">
            Question Bank
          </h1>
          <p className="text-slate-500 font-bold text-sm mt-2">Manage your assessment repository</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border w-full md:w-auto">
          <Filter className="text-slate-400 ml-2" size={18} />
          <select
            value={positionId}
            onChange={e => {
              setPositionId(e.target.value);
              loadQuestions(e.target.value);
            }}
            className="bg-transparent focus:outline-none min-w-[200px] font-black text-slate-700 p-2"
          >
            <option value="">Filter by Position</option>
            {positions.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: ADD FORM */}
        <div className="lg:col-span-4">
          <form
            onSubmit={addQuestion}
            className="bg-white p-8 rounded-[2rem] space-y-6 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-8"
          >
            <div className="flex items-center gap-2 mb-2">
               <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <Plus size={20} />
               </div>
               <h2 className="font-black text-xl uppercase tracking-tight">Create Question</h2>
            </div>

            {/* QUESTION */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Question Text</label>
              <textarea
                required
                placeholder="Ex: What is the primary function of a Load Balancer?"
                className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-indigo-500 transition-all min-h-[120px] outline-none"
                value={form.question}
                onChange={e => setForm({ ...form, question: e.target.value })}
              />
            </div>

            {/* TYPE */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Question Type</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value, correct: "A", correctMultiple: [] })}
                className="w-full border-2 border-slate-100 rounded-xl p-3 font-black text-slate-700 outline-none focus:border-indigo-500"
              >
                {QUESTION_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* OPTIONS INPUT */}
            {["single", "multiple"].includes(form.type) && (
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Answer Options</label>
                {["a", "b", "c", "d"].map(opt => (
                  <div key={opt} className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300 uppercase">{opt}</span>
                    <input
                      required
                      placeholder={`Option ${opt.toUpperCase()}`}
                      className="w-full border-2 border-slate-50 bg-slate-50 rounded-xl py-3 pl-10 pr-4 font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none"
                      value={form.options[opt]}
                      onChange={e => setForm({ ...form, options: { ...form.options, [opt]: e.target.value }})}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* SELECT CORRECT (SINGLE) */}
            {form.type === "single" && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Correct Option</label>
                <div className="grid grid-cols-4 gap-2">
                  {["A", "B", "C", "D"].map(v => (
                    <button
                      type="button" key={v}
                      onClick={() => setForm({ ...form, correct: v })}
                      className={`py-3 rounded-xl font-black transition-all ${form.correct === v ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SELECT CORRECT (MULTIPLE) */}
            {form.type === "multiple" && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Correct Options (Select all that apply)</label>
                <div className="grid grid-cols-4 gap-2">
                  {["A", "B", "C", "D"].map(v => (
                    <button
                      type="button" key={v}
                      onClick={() => toggleMultiple(v)}
                      className={`py-3 rounded-xl font-black transition-all ${form.correctMultiple.includes(v) ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TRUE/FALSE */}
            {form.type === "true_false" && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Correct Answer</label>
                <div className="grid grid-cols-2 gap-4">
                  {["TRUE", "FALSE"].map(v => (
                    <button
                      type="button" key={v}
                      onClick={() => setForm({ ...form, correct: v })}
                      className={`py-4 rounded-xl font-black transition-all ${form.correct === v ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              disabled={!positionId || isSubmitting}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-slate-200"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              SAVE TO BANK
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: LIST */}
        <div className="lg:col-span-8 space-y-6">
          {!positionId && (
            <div className="h-96 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300">
               <Layers size={64} className="mb-4 opacity-10" />
               <p className="font-black uppercase tracking-widest">Select position to view questions</p>
            </div>
          )}

          {positionId && questions.length === 0 && !isSubmitting && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed">
               <HelpCircle size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-bold">No questions found for this position yet.</p>
            </div>
          )}

          {questions.map((q, i) => (
            <div
              key={q.id}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-xl hover:shadow-slate-200/50 transition-all"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                    {i + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-tighter">
                      {q.question_type?.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteQuestion(q.id)}
                  className="p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Question Text */}
              <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
                {q.question}
              </h3>

              {/* Render Options Based on Type */}
              {["single", "multiple"].includes(q.question_type) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {["a", "b", "c", "d"].map((key) => {
                    const label = q[`option_${key}`];
                    if (!label) return null;

                    const isCorrect = q.question_type === "single"
                      ? q.correct_option === key.toUpperCase()
                      : q.correct_options?.includes(key.toUpperCase());

                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          isCorrect ? "bg-emerald-50 border-emerald-500 shadow-sm shadow-emerald-100" : "bg-slate-50 border-transparent"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                          isCorrect ? "bg-emerald-500 text-white" : "bg-white text-slate-400 shadow-sm"
                        }`}>
                          {key.toUpperCase()}
                        </div>
                        <span className={`font-bold ${isCorrect ? "text-emerald-900" : "text-slate-600"}`}>
                          {label}
                        </span>
                        {isCorrect && <CheckCircle2 size={18} className="ml-auto text-emerald-500" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Render True/False Choice */}
              {q.question_type === "true_false" && (
                <div className="flex gap-4">
                  {["TRUE", "FALSE"].map(val => (
                    <div key={val} className={`flex-1 text-center py-4 rounded-2xl font-black border-2 transition-all ${
                      q.correct_option === val 
                        ? "bg-amber-50 border-amber-500 text-amber-700" 
                        : "bg-slate-50 border-transparent text-slate-300"
                    }`}>
                      {val} {q.correct_option === val && "✓"}
                    </div>
                  ))}
                </div>
              )}

              {/* Render Written Placeholder */}
              {q.question_type === "written" && (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-2xl flex items-center gap-4 text-slate-400">
                  <AlignLeft className="opacity-50" />
                  <p className="text-sm font-bold italic">Descriptive answer. Manual evaluation required.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;