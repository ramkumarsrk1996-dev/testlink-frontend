import { useEffect, useState } from "react";
import API from "../../api/api";
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Search, 
  MoreHorizontal, 
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/positions");
      setPositions(res.data);
    } catch (err) {
      console.error("Failed to load positions");
    } finally {
      setLoading(false);
    }
  };

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    try {
      await API.post("/positions", { name });
      setName("");
      load();
    } catch (err) {
      console.error("Error adding position");
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure? This may affect linked tests.")) return;
    try {
      await API.delete(`/positions/${id}`);
      load();
    } catch (err) {
      console.error("Error deleting position");
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-100 text-white">
              <Briefcase size={20} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Positions</h1>
          </div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest ml-1">Manage Available Job Roles</p>
        </div>

        {/* QUICK ADD FORM */}
        <form onSubmit={add} className="flex items-center gap-2 bg-white p-2 pr-3 rounded-[1.5rem] shadow-sm border border-slate-100">
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Role Name (e.g. Senior Dev)" 
            className="bg-transparent border-none focus:ring-0 text-sm font-bold px-4 py-2 w-48 md:w-64"
          />
          <button 
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-blue-600 transition-all disabled:bg-slate-200"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          </button>
        </form>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role Identifier</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Title / Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-indigo-500" size={40} />
                    <p className="text-slate-400 font-bold text-xs uppercase mt-4 tracking-widest">Retrieving Positions...</p>
                  </td>
                </tr>
              ) : positions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="text-slate-300" size={32} />
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No positions found</p>
                  </td>
                </tr>
              ) : (
                positions.map((p) => (
                  <tr key={p.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-6">
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1.5 rounded-lg">
                        ID-{p.id.toString().padStart(3, '0')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-800">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Modified 2 days ago</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Active</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                        <button 
                          onClick={() => remove(p.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Positions;