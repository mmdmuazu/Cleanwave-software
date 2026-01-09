// import { ArrowLeft } from "lucide-react";
// import { useState } from "react";
// import { PickupCard } from "../../user/components/History";

// export default function History({ onSwitch }) {
//   const [tab, setTab] = useState("pickups");
//   const [pickupTab, setActivePickupTab] = useState("pending");
//   const [loading, setLoading] = useState(false);
//   const [pickupList, setPickupList] = useState([{id:1,category:"Plastic",status:"pending"}]);

//   const [records, setRecords] = useState([]);
//   //   ([
//   //     { agent: "amir", category: "plastic", kg: "20", date: "12-10-7" },
//   //   ]);
//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       {/* Professional Header Section */}
//       <header className="mb-6 flex items-center justify-between">
//         <button
//           onClick={() => onSwitch("home")}
//           className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#8CA566] transition-all"
//         >
//           <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
//           Back to Home
//         </button>
//         <h1 className="text-xl font-bold text-gray-800">Records</h1>
//       </header>

//       {/* Pickups Container */}
//       <main className=" ">
//         <div className="flex mb-6">
//           {["pickups", "records"].map((t) => (
//             <div className="w-full ">
//               <button
//                 key={t}
//                 onClick={() => setTab(t)}
//                 className={`w-full px-4 py-2 g font-medium ${
//                   tab === t
//                     ? "bg-[#8CA566] text-white"
//                     : "bg-white text-gray-600 border"
//                 }`}
//               >
//                 {t.charAt(0).toUpperCase() + t.slice(1)}
//               </button>
//             </div>
//           ))}
//         </div>
//         <div className="p-2">
//           {tab == "pickups" && (
//             <div className="mt-1 mb-[95px] p-2 rounded-lg min-h-screen bg-gray-50">
//               <div className="flex gap-3 mb-6">
//                 {["pending", "accepted", "delivered"].map((t) => (
//                   <button
//                     key={t}
//                     onClick={() => setActivePickupTab(t)}
//                     className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
//                       pickupTab === t
//                         ? "bg-[#8CA566] text-white"
//                         : "bg-white text-gray-600 border"
//                     }`}
//                   >
//                     {t.charAt(0).toUpperCase() + t.slice(1)}
//                   </button>
//                 ))}
//               </div>
//               {loading ? (
//                 <p className="text-gray-600">Loading...</p>
//               ) : pickupList.length === 0 ? (
//                 <p className="text-gray-500">No pickups found.</p>
//               ) : (
//                 <div className="grid gap-4">
//                   {pickupList.map((pickup) => (
//                     <PickupCard
//                       key={pickup.id}
//                       data={pickup}
//                       tab={tab}
//                       onAccept={() => handleAccept(pickup.id)}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {tab == "records" && (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//               <div className="p-6 border-b border-gray-200">
//                 <h3 className="text-xl font-bold text-gray-900">
//                   Collection Records
//                 </h3>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700">
//                         Agent
//                       </th>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700">
//                         Category
//                       </th>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700">
//                         kg
//                       </th>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700">
//                         Date
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {records.map((record) => (
//                       <tr
//                         key={record.id}
//                         className="border-b border-gray-100 hover:bg-gray-50 transition"
//                       >
//                         <td className="px-6 py-4 text-gray-900">
//                           {record.agent}
//                         </td>
//                         <td className="px-6 py-4 text-gray-900">
//                           {record.category}
//                         </td>
//                         <td className="px-6 py-4 text-gray-900 font-medium">
//                           {record.kg} kg
//                         </td>
//                         <td className="px-6 py-4 text-gray-600 text-xs">
//                           {record.date}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

import { ArrowLeft } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { PickupCard } from "../../user/components/History";
import { getAllWasteData } from "../../../services/adminService";

export default function History({ onSwitch }) {
  const [tab, setTab] = useState("pickups");
  const [activePickupStatus, setActivePickupStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [wasteData, setWasteData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample Data
  const [pickupList] = useState([]);

  const [records] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getAllWasteData();
      console.log("This is redponse for :", resp);
      if (resp && resp.data) {
        setWasteData(resp.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useState(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = wasteData.filter((item) => {
    const matchesTab = activePickupStatus === "all" ? true : item.status === activePickupStatus;
    const matchesSearch =
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.info.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Filter pickups based on the active status tab
  const filteredPickups = useMemo(() => {
    return pickupList.filter((p) => p.status === activePickupStatus);
  }, [pickupList, activePickupStatus]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Professional Header Section */}
      <header className="mb-6 flex items-center justify-between">
        <button
          onClick={() => onSwitch("home")}
          className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#8CA566] transition-all"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </button>
        <h1 className="text-xl font-bold text-gray-800">History</h1>
      </header>

      <main>
        {/* Main Navigation Tabs */}
        <div className="flex mb-6 bg-white rounded-lg border overflow-hidden">
          {["pickups", "records"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`w-full px-4 py-3 font-semibold transition-colors ${
                tab === t
                  ? "bg-[#8CA566] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-2">
          {tab === "pickups" && (
            <div className="mt-1 mb-[95px] rounded-lg">
              {/* Pickup Status Sub-tabs */}
              <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                {["pending", "accepted", "delivered"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActivePickupStatus(status)}
                    className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all border ${
                      activePickupStatus === status
                        ? "bg-[#8CA566] border-[#8CA566] text-white shadow-md"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#8CA566]"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {loading ? (
                <p className="text-center py-10 text-gray-500">Loading...</p>
              ) : filteredData.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500">
                    No {activePickupStatus} pickups found.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredData.map((pickup) => (
                    <PickupCard
                      key={pickup.id}
                      data={pickup}
                      // onAccept={() => handleAccept(pickup.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "records" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                  Collection Records
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">
                        Agent
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">
                        Weight
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredData.length > 0 ? (
                      filteredData.map((record) => (
                        <tr
                          key={record.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 text-gray-900 font-medium">
                            {record.agent}
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                              {record.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-900 font-bold">
                            {record.kg} kg
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {record.created_at}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-10 text-center text-gray-500"
                        >
                          No records available yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
