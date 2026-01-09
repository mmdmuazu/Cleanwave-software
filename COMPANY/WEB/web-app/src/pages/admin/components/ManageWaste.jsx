import { useState, useEffect } from "react";
import {
  getAllWasteData,
  updateWasteStatus,
} from "../../../services/adminService";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  FileText,
  Search,
  X,
} from "lucide-react";

export default function SearchableWasteAdmin() {
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState(""); // New search state
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllWasteData();
        console.log("Response of Waste Pickips::", response);
        setWasteData(response.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setError("");
    try {
      const resp = await updateWasteStatus(id, newStatus);

      console.log("This is the Response for status : ", resp + "hello");
      if (resp && resp.success) {
        setWasteData((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      } else {
        setError(resp.error || "Unable to update");
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  // COMBINED FILTERING: Tab + Search
  const filteredData = wasteData.filter((item) => {
    const matchesTab = activeTab === "all" ? true : item.status === activeTab;
    const matchesSearch =
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.info.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center animate-pulse text-emerald-600">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      {/* Top Navigation & Search Bar Wrapper */}
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Waste Dashboard
            </h1>
            <p className="text-slate-500">Real-time logistics management</p>
          </div>

          {/* MODERN SEARCH BAR */}
          <div className="relative w-full lg:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                className="text-slate-400 group-focus-within:text-emerald-500 transition-colors"
                size={20}
              />
            </div>
            <input
              type="text"
              placeholder="Search pickups, names, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-black block w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </header>

        {/* TAB NAVIGATION */}
        <nav className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
          {["pending", "accepted", "delivered", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                activeTab === tab
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-slideIn">
            <AlertCircle
              size={20}
              className="text-red-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* DATA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-2xl transition-all duration-500"
            >
              {/* Card content same as before... */}
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    item.status === "delivered"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {item.category} {item.kg}kg
              </h2>
              <p className="text-slate-500 text-sm mt-2 mb-6 leading-relaxed">
                {item.info}
              </p>

              <div className="flex gap-3">
                {item.status === "pending" && (
                  <button
                    onClick={() => handleStatusUpdate(item.id, "accepted")}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-bold text-sm transition-colors"
                  >
                    Accept Request
                  </button>
                )}
                {item.status === "accepted" && (
                  <button
                    onClick={() => handleStatusUpdate(item.id, "delivered")}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl font-bold text-sm transition-colors"
                  >
                    Confirm Delivery
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
