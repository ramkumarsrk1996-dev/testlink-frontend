import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../../api/api";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  CheckCircle2
} from "lucide-react";

/* ===============================
   HELPERS
================================ */
const idxToOpt = i => ["A", "B", "C", "D"][i];

const TestPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(state.test.duration_minutes * 60);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const timerRef = useRef(null);

  /* ===============================
     INITIAL LOAD + RESUME
  ================================ */
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const startRes = await API.post("/test/start", {
          test_id: state.test.id,
          candidate_id: state.candidate_id
        });

        setQuestions(startRes.data.questions || []);

        const resumeRes = await API.get(
          `/test/resume/${state.candidate_id}`
        );

        const map = {};
        resumeRes.data.answers?.forEach(a => {
          if (a.selected_option) map[a.question_id] = a.selected_option;
          else if (a.selected_options) map[a.question_id] = a.selected_options;
          else if (a.written_answer) map[a.question_id] = a.written_answer;
        });

        setAnswers(map);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load test");
      }
    };

    fetchTest();
  }, [state.test.id, state.candidate_id]);

  /* ===============================
     TIMER + AUTO SUBMIT
  ================================ */
  useEffect(() => {
    if (loading) return;

    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    timerRef.current = setInterval(
      () => setTimeLeft(t => t - 1),
      1000
    );

    return () => clearInterval(timerRef.current);
  }, [timeLeft, loading]);

  const formatTime = s =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  /* ===============================
     FULLSCREEN + TAB SWITCH
  ================================ */
  useEffect(() => {
    document.documentElement.requestFullscreen?.();

    const exitHandler = () => {
      if (!document.fullscreenElement) {
        alert("Fullscreen exited. Test submitted.");
        handleFinalSubmit();
      }
    };

    const visibilityHandler = () => {
      if (document.hidden) {
        alert("Tab switch detected. Test submitted.");
        handleFinalSubmit();
      }
    };

    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("visibilitychange", visibilityHandler);

    return () => {
      document.removeEventListener("fullscreenchange", exitHandler);
      document.removeEventListener("visibilitychange", visibilityHandler);
    };
  }, []);

  /* ===============================
     ANSWER HELPERS
  ================================ */
  const updateAnswer = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const saveAnswer = async qid => {
    if (!qid) return;
    setIsSaving(true);
    try {
      await API.post("/test/save-answer", {
        candidate_id: state.candidate_id,
        question_id: qid,
        answer: answers[qid] ?? null
      });
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    await saveAnswer(questions[index].id);
    setIndex(i => Math.min(i + 1, questions.length - 1));
  };

  /* ===============================
     FINAL SUBMIT
  ================================ */
  const handleFinalSubmit = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const lastQ = questions[index]?.id;
      if (lastQ) await saveAnswer(lastQ);

      await API.post("/test/submit", {
        candidate_id: state.candidate_id,
        test_id: state.test.id
      });

      clearInterval(timerRef.current);
      navigate("/thank-you");
    } catch {
      alert("Submission failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  const q = questions[index];

  /* ===============================
     RENDER QUESTION
  ================================ */
  const renderOptions = () => {
    /* SINGLE / TRUE-FALSE */
    if (q.question_type === "single" || q.question_type === "true_false") {
      const opts =
        q.question_type === "true_false"
          ? ["TRUE", "FALSE"]
          : [q.option_a, q.option_b, q.option_c, q.option_d];

      return opts.map((opt, i) => {
        if (!opt) return null;
        const value =
          q.question_type === "true_false" ? opt : idxToOpt(i);

        return (
          <label
            key={i}
            className={`flex gap-4 p-4 border rounded cursor-pointer ${
              answers[q.id] === value
                ? "border-indigo-600 bg-indigo-50"
                : "border-slate-200 hover:bg-slate-100"
            }`}
          >
            <input
              type="radio"
              className="hidden"
              checked={answers[q.id] === value}
              onChange={() => updateAnswer(q.id, value)}
            />
            <span>{opt}</span>
          </label>
        );
      });
    }

    /* MULTIPLE */
    if (q.question_type === "multiple") {
      const opts = [q.option_a, q.option_b, q.option_c, q.option_d];
      const selected = answers[q.id] || [];

      return opts.map((opt, i) => {
        if (!opt) return null;
        const value = idxToOpt(i);

        return (
          <label
            key={i}
            className={`flex gap-4 p-4 border rounded cursor-pointer ${
              selected.includes(value)
                ? "border-indigo-600 bg-indigo-50"
                : "border-slate-200 hover:bg-slate-100"
            }`}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={selected.includes(value)}
              onChange={() =>
                selected.includes(value)
                  ? updateAnswer(
                      q.id,
                      selected.filter(v => v !== value)
                    )
                  : updateAnswer(q.id, [...selected, value])
              }
            />
            <span>{opt}</span>
          </label>
        );
      });
    }

    /* WRITTEN */
    if (q.question_type === "written") {
      return (
        <textarea
          className="w-full p-4 border rounded-md"
          rows={6}
          placeholder="Type your answer..."
          value={answers[q.id] || ""}
          onChange={e => updateAnswer(q.id, e.target.value)}
        />
      );
    }

    return null;
  };

  /* ===============================
     UI
  ================================ */
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-xs font-black">
            QUESTION {index + 1} / {questions.length}
          </span>
          {isSaving && (
            <span className="flex items-center gap-1 text-emerald-600 text-xs">
              <CheckCircle2 size={14} /> Saving
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 font-mono font-black">
          <Clock size={18} />
          {formatTime(timeLeft)}
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto p-10 w-full">
        <div className="bg-white rounded-3xl p-10 shadow border">
          <p className="text-xl font-black mb-10 whitespace-pre-wrap">
            {q.question}
          </p>

          <div className="space-y-4">{renderOptions()}</div>

          <div className="mt-10 flex justify-between">
            <button
              disabled={index === 0 || isSaving}
              onClick={() => setIndex(i => i - 1)}
              className="text-xs font-black flex items-center gap-1 disabled:opacity-30"
            >
              <ChevronLeft size={16} /> PREVIOUS
            </button>

            {index === questions.length - 1 ? (
              <button
                onClick={handleFinalSubmit}
                disabled={isSaving}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl text-xs font-black flex items-center gap-2"
              >
                <Send size={16} /> FINISH & SUBMIT
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={isSaving}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-black flex items-center gap-2"
              >
                SAVE & NEXT <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestPage;
