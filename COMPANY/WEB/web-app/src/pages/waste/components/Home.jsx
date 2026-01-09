import React, { useState, useMemo, useEffect } from "react";
import { getWasteCategories } from "../../../services/wasteservice";
import { getAgent } from "../../../services/aggregatorservice";
import { wasteDelivered } from "../../../services/pickupService";
import { getProfile } from "../../../services/authservice";
import { getPickupsCount } from "../../../services/pickupService";

// const agentsList = [
//   { id: 1, name: "Amir Sani" },
//   { id: 2, name: "Aisha Bello" },
//   { id: 3, name: "John Musa" },
//   { id: 4, name: "Fatima Ali" },
// ];

// const wasteCategories = [
//   { id: 1, name: "Plastic" },
//   { id: 2, name: "Metal" },
//   { id: 3, name: "Glass" },
//   { id: 4, name: "Organic" },
//   { id: 5, name: "Paper" },
// ];

const HomePage = ({ onSwitch }) => {
  const [form, setForm] = useState({
    agent: "",
    category: "",
    subcategory: "",
    kg: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [agentsList, setAgentsList] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [totalkg, setTotalKg] = useState(0);
  const [pickups, setPickupCount] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [res, agentsRes, Info, pickupResp] = await Promise.all([
          getWasteCategories(),
          getAgent(),
          getProfile(),
          getPickupsCount(),
        ]);
        console.log("Profiles for WasteBank ::", Info);

        if (agentsRes) {
          console.log("Agents Res:", agentsRes.agentsList);
          setAgentsList(agentsRes.agentsList);
        }
        if (
          res &&
          res.success &&
          res.data &&
          Array.isArray(res.data.categories)
        ) {
          setCategories(res.data.categories);
        }
        if (Info && Info.success) {
          setTotalKg(Info.user.capacity);
        }
        if (pickupResp && pickupResp.success) {
          console.log("Pickups ", pickupResp);
          setPickupCount(pickupResp.data.data);
        } else {
          console.log("hello");
          return "<h1  className='mt-200'>Error</h1>";
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // const filteredAgents = useMemo(
  //   () =>
  //     agentsList.filter((agent) =>
  //       agent.{email || name}.toLowerCase().includes(searchTerm.toLowerCase()),

  //     ),
  //   [searchTerm]
  // );
  const filteredAgents = useMemo(
    () =>
      agentsList.filter((agent) => {
        // Check if the search term is included in the email OR the name
        const emailMatch = agent.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const nameMatch = agent.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        return emailMatch || nameMatch;
      }),
    [searchTerm, agentsList] // Added agentsList as a dependency, which is standard practice
  );

  const stats = useMemo(
    () => ({
      totalPickups: records.length,
      totalkg: records
        .reduce((sum, r) => sum + parseFloat(r.kg || 0), 0)
        .toFixed(2),
    }),
    [records]
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      const selectedCat = categories.find((cat) => cat.name === value);
      if (
        selectedCat &&
        selectedCat.subcategories &&
        selectedCat.subcategories.length > 0
      ) {
        setSubcategories(selectedCat.subcategories);
        setForm((prev) => ({ ...prev, subcategory: "" })); // reset subcategory
      } else {
        setSubcategories([]);
        setForm((prev) => ({ ...prev, subcategory: "" }));
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.agent || !form.category || !form.kg) {
      alert("All fields are required!");
      return;
    }
    try {
      const response = await wasteDelivered(form);
      console.log(response);
      if (response.success) {
        setSuccess(response.data.message);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.log("Error", err);
      setError(err || "Error recording info");
    }

    // const newRecord = {
    //   id: Date.now(),
    //   ...form,
    //   kg: parseFloat(form.kg),
    //   date: new Date().toLocaleString(),
    // };

    // setRecords([newRecord, ...records]);
    // setForm({ agent: "", category: "", kg: "" });
    // setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mt-[-70px] mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Waste Management
          </h1>
          <p className="text-gray-600">
            Record and track waste collection efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Total Pickups
            </p>
            <p className="text-3xl font-bold text-[#4A7C2D]">{pickups}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Total kg</p>
            <p className="text-3xl font-bold text-[#4A7C2D]">{totalkg} kg</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSwitch("history")}
          className="w-full bg-[#4A7C2D] text-white mb-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
        >
          Waste History
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Record New Collection
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agent Search */}
            <div>
              {/* Error/Success Messages */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <label className="mt-5 block text-sm font-semibold text-gray-700 mb-2">
                Select Agent
              </label>
              <input
                type="text"
                placeholder="Search agent name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A7C2D] focus:border-transparent outline-none transition"
              />
              {searchTerm && filteredAgents.length > 0 && (
                <div className="mt-2 border border-gray-300 rounded-lg bg-white shadow-sm max-h-40 overflow-y-auto">
                  {filteredAgents.map((agent) => (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, agent: agent.id });
                        setSearchTerm(agent.name);
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-gray-100 transition ${
                        form.agent === agent.name
                          ? "bg-[#4A7C2D] text-white"
                          : ""
                      }`}
                    >
                      {agent.name}
                    </button>
                  ))}
                </div>
              )}
              {form.agent && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: <span className="font-semibold">{form.agent}</span>
                </p>
              )}
            </div>

            {/* Waste Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Waste Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full h-12 border rounded-lg px-3 text-sm focus:ring-2 focus:ring-[#8CA566] focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Select */}
            {subcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory <span className="text-red-500">*</span>
                </label>
                <select
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  className="w-full h-12 border rounded-lg px-3 text-sm focus:ring-2 focus:ring-[#8CA566] focus:border-transparent"
                  required
                >
                  <option value="">Select a subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id || sub.name} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* kg Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                kg (kg)
              </label>
              <input
                type="number"
                placeholder="Enter kg"
                step="0.01"
                min="0"
                value={form.kg}
                onChange={(e) => setForm({ ...form, kg: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A7C2D] focus:border-transparent outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#4A7C2D] text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
            >
              Record Collection
            </button>
          </form>
        </div>

        {/* Records Table */}
        {records.length == 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Collection Records
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      kg
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-gray-900">
                        {record.agent}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {record.category}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {record.kg} kg
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">
                        {record.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
