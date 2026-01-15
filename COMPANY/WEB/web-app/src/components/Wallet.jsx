import React, { useState, useCallback } from "react";
import {
  WalletIcon,
  WifiIcon,
  PhoneIcon,
  AlertCircle,
  ArrowDownCircle,
  ChevronDown,
  ArrowLeft,
  Loader,
  CheckCircle,
} from "lucide-react";
import { useEffect } from "react";
import {
  walletBalance,
  getTransactionHistory,
  checkAccountNumber,
  transferFunds,
} from "../services/authservice";
import { NIGERIAN_BANKS } from "../data/banks";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState("purchase");
  const [transactions, setTransactions] = useState([]);
  const [withdrawalForm, setWithdrawalForm] = useState({
    bankCode: "",
    accountNumber: "",
    accountName: "", // Usually fetched via API
    amount: "",
    pin: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [verified, setVerified] = useState(false);
  const [bankSearch, setbankSearch] = useState("");
  const [showbankDropdown, setShowbankDropdown] = useState(false);
  const [selectedbank, setSelectedBank] = useState("");

  const fetchWalletData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, txHistory] = await Promise.all([
        walletBalance(),
        getTransactionHistory(),
      ]);
      console.log("Transaction histroy", txHistory.transactions.transactions);
      if (res.success) {
        setBalance(res.balance);
        setTransactions(
          txHistory.data || txHistory.transactions.transactions || []
        );
      } else {
        setError("Failed to load wallet data");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletData();
  }, []);
  const [form, setForm] = useState({
    serviceType: "airtime",
    network: "",
    phone: "",
    amount: "",
    dataBundle: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const dataBundles = [
    { label: "500MB – ₦300", value: "500MB", price: 300 },
    { label: "1GB – ₦500", value: "1GB", price: 500 },
    { label: "2GB – ₦900", value: "2GB", price: 900 },
    { label: "5GB – ₦2000", value: "5GB", price: 2000 },
  ];

  const validateForm = () => {
    const errors = {};
    const { serviceType, network, phone, amount, dataBundle } = form;

    if (!network) errors.network = "Network provider is required";
    if (!phone) errors.phone = "Phone number is required";
    else if (!/^[0-9]{10,11}$/.test(phone.replace(/\D/g, "")))
      errors.phone = "Invalid phone number";

    if (serviceType === "data") {
      if (!dataBundle) errors.dataBundle = "Please select a data bundle";
    } else {
      if (!amount) errors.amount = "Amount is required";
      else if (parseFloat(amount) <= 0)
        errors.amount = "Amount must be positive";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    const { serviceType, network, phone, amount, dataBundle } = form;
    const actualAmount =
      serviceType === "data"
        ? dataBundles.find((b) => b.value === dataBundle)?.price || 0
        : parseFloat(amount);

    if (actualAmount > balance) {
      setError("Insufficient balance!");
      return;
    }

    setLoading(true);
    try {
      // API call would go here
      const newBalance = balance - actualAmount;
      setBalance(newBalance);

      const newTx = {
        id: Date.now(),
        type: `${
          serviceType === "data" ? `Data (${dataBundle})` : "Airtime"
        } Purchase`,
        amount: -actualAmount,
        date: new Date().toISOString().split("T")[0],
        status: "completed",
      };

      setTransactions([newTx, ...transactions]);
      setSuccess("✅ Purchase successful!");
      setForm({
        serviceType: "airtime",
        network: "",
        phone: "",

        amount: "",
        dataBundle: "",
      });
      setFormErrors({});
    } catch (err) {
      setError("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAccountNumber = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await checkAccountNumber(withdrawalForm);
      if (res.success) {
        setLoading(false);
        // setSuccess("Account verified successfully");
        setWithdrawalForm((prev) => ({
          ...prev,
          accountName: res.accountName,
        }));
        setVerified(true);
      } else {
        setError("Account verification failed");
        setVerified(false);
      }
    } catch (err) {
      setError("Network error during account verification");
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Professional Validation
    const errors = {};
    if (!withdrawalForm.bankCode) errors.bankCode = "Select a bank";
    if (withdrawalForm.accountNumber.length !== 10)
      errors.accountNumber = "Invalid account number";
    if (!withdrawalForm.amount || parseFloat(withdrawalForm.amount) < 100)
      errors.amount = "Minimum withdrawal is ₦100";
    if (parseFloat(withdrawalForm.amount) > balance)
      errors.amount = "Insufficient wallet balance";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      // API call to /withdraw would go here
      // await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock delay
      const res = await transferFunds(withdrawalForm);
      if (!res.success) {
        setError(res.error || "Withdrawal failed. Please try again.");
        setLoading(false);
      } else {
        setBalance((prev) => prev - parseFloat(withdrawalForm.amount));
        setSuccess(
          res.message || "✅ Withdrawal request submitted successfully!"
        );
        setVerified(false);
        fetchWalletData();
        setWithdrawalForm({
          bankCode: "",
          accountNumber: "",
          accountName: "",
          amount: "",
          pin: "",
        });
        setActiveTab("transactions");
      }
    } catch (err) {
      setError("Withdrawal failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };
  const handlebankSelect = (bank) => {
    setWithdrawalForm((prev) => ({
      ...prev,
      bankCode: bank.code,
    }));
    setSelectedBank(bank.name);
    setbankSearch("");
    setShowbankDropdown(false);
  };

  const filteredbanks = NIGERIAN_BANKS.filter((bank) =>
    (bank.name || "").toLowerCase().includes(bankSearch.toLowerCase())
  );

  // const selectedbank = NIGERIAN_BANKS.find(
  //   (bank) => (bank.code || bank.id) === form.bankCode
  // );
  return (
    console.log("Bank :", selectedbank),
    (
      <div className="mt-1 min-h-screen flex flex-col relative pb-24 bg-gray-50">
        {/* Header */}
        <div className="bg-gray-400 text-white py-10 rounded-lg shadow-lg mx-4">
          <div className="text-center">
            <p className="text-sm uppercase tracking-wider opacity-90">
              Wallet Balance
            </p>
            <h1 className="text-5xl font-extrabold mt-2">
              ₦{balance.toLocaleString()}
            </h1>
            <div className="p-5 text-center">
              <div className="grid grid-cols-2 gap-4">
                <button
                  disabled={loading}
                  className="bg-white text-[#8CA566] py-3 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50"
                >
                  Deposit
                </button>
                <button
                  disabled={loading}
                  onClick={() => setActiveTab("withdraw")}
                  className="bg-[#8CA566] text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition disabled:opacity-50"
                >
                  Withdraw
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs opacity-80">
              🔒 Secure & encrypted transactions
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mx-4 mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 bg-white shadow-sm mt-6 rounded-lg mx-4 p-1 overflow-hidden border border-gray-200">
          {[
            { key: "purchase", label: "Buy Airtime/Data" },
            { key: "transactions", label: "History" },
            { key: "withdraw", label: "Withdraw" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 font-semibold text-sm rounded transition ${
                activeTab === tab.key
                  ? "bg-green-50 text-[#8CA566] border-b-2 border-[#8CA566] "
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 px-4 mt-6 space-y-6 overflow-y-auto">
          {activeTab === "purchase" && (
            <form
              onSubmit={handlePurchase}
              className="space-y-5 bg-white p-6 rounded-lg shadow-sm"
            >
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Service Type
                </label>
                <select
                  value={form.serviceType}
                  onChange={(e) =>
                    setForm({ ...form, serviceType: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  <option value="airtime">Airtime</option>
                  <option value="data">Data</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Network Provider *
                </label>
                <select
                  value={form.network}
                  onChange={(e) =>
                    setForm({ ...form, network: e.target.value })
                  }
                  className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-600 focus:border-transparent ${
                    formErrors.network ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Network</option>
                  <option value="MTN">MTN</option>
                  <option value="Airtel">Airtel</option>
                  <option value="GLO">GLO</option>
                  <option value="9mobile">9mobile</option>
                </select>
                {formErrors.network && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.network}
                  </p>
                )}
              </div>

              {form.serviceType === "data" ? (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Select Data Bundle *
                  </label>
                  <select
                    value={form.dataBundle}
                    onChange={(e) =>
                      setForm({ ...form, dataBundle: e.target.value })
                    }
                    className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-600 focus:border-transparent ${
                      formErrors.dataBundle
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Choose Bundle</option>
                    {dataBundles.map((bundle) => (
                      <option key={bundle.value} value={bundle.value}>
                        {bundle.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.dataBundle && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.dataBundle}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Amount (₦) *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-600 focus:border-transparent ${
                      formErrors.amount ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.amount && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.amount}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="0801234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-600 focus:border-transparent ${
                    formErrors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8CA566] text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  "Processing..."
                ) : form.serviceType === "data" ? (
                  <span className="flex items-center justify-center gap-2">
                    <WifiIcon className="w-4 h-4" /> Buy Data
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <PhoneIcon className="w-4 h-4" /> Buy Airtime
                  </span>
                )}
              </button>
            </form>
          )}

          {activeTab === "withdraw" && (
            <form
              onSubmit={verified ? handleWithdrawal : verifyAccountNumber}
              className="bg-white p-6 rounded-2xl shadow-sm space-y-4"
            >
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <ArrowDownCircle className="text-[#8CA566]" /> Withdraw to Bank
              </h2>
              {verified && (
                <button
                  onClick={() => setVerified(false)}
                  className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#8CA566] transition-all"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Back
                </button>
              )}
              {!verified && (
                <div>
                  {/* <label className="text-xs font-bold text-gray-500 uppercase">
                  Select Bank
                </label>
                <select
                  className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8CA566]"
                  value={withdrawalForm.bankCode}
                  onChange={(e) =>
                    setWithdrawalForm({
                      ...withdrawalForm,
                      bankCode: e.target.value,
                    })
                  }
                >
                  <option value="">Choose Bank...</option>
                  // Dynamically Map through the imported list 
                  {NIGERIAN_BANKS.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select> */}
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Bank
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowbankDropdown(!showbankDropdown)}
                      className="w-full h-12 border-2 border-gray-200 rounded-lg px-4 text-sm focus:outline-none focus:border-[#8CA566] transition flex items-center justify-between bg-white"
                    >
                      <span
                        className={
                          selectedbank ? "text-gray-900" : "text-gray-500"
                        }
                      >
                        {selectedbank
                          ? selectedbank || selectedbank.name
                          : "Select a bank"}
                      </span>
                      {/* <ChevronDown
                      size={18}
                      className={`transition ${
                        showbankDropdown ? "rotate-180" : ""
                      }`} */}
                      {/* /> */}
                    </button>

                    {showbankDropdown && (
                      <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                        <div className="p-2 border-b border-gray-200">
                          <input
                            type="text"
                            placeholder="Search banks..."
                            value={bankSearch}
                            onChange={(e) => setbankSearch(e.target.value)}
                            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm outline-none"
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredbanks.length > 0 ? (
                            filteredbanks.map((bank) => (
                              <button
                                key={bank.code}
                                type="button"
                                onClick={() => handlebankSelect(bank)}
                                className="w-full text-left px-4 py-3 hover:bg-[#f5f9f3] border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                              >
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {bank.name || bank.id}
                                  </p>
                                </div>
                              </button>
                            ))
                          ) : (
                            <p className="p-4 text-sm text-gray-500">
                              No Bank Found
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                // {formErrors.bankCode && (
                //   <p className="text-red-500 text-[10px] mt-1">
                //     {formErrors.bankCode}
                //   </p>
                // )}
              )}
              {!verified && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Account Number
                  </label>
                  <input
                    type="number"
                    placeholder="0123456789"
                    className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8CA566]"
                    value={withdrawalForm.accountNumber}
                    onChange={(e) =>
                      setWithdrawalForm({
                        ...withdrawalForm,
                        accountNumber: e.target.value,
                      })
                    }
                  />
                  {formErrors.accountNumber && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {formErrors.accountNumber}
                    </p>
                  )}
                </div>
              )}
              {verified && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-700">
                    {withdrawalForm.accountName}
                  </p>
                </div>
              )}
              {verified && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="Min ₦100"
                    className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8CA566]"
                    value={withdrawalForm.amount}
                    onChange={(e) =>
                      setWithdrawalForm({
                        ...withdrawalForm,
                        amount: e.target.value,
                      })
                    }
                  />
                  {formErrors.amount && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {formErrors.amount}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8CA566] text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader className="animate-spin" size={20} />
                ) : verified ? (
                  "Confirm Withdrawal"
                ) : (
                  "Search Account"
                )}
              </button>

              <p className="text-[10px] text-center text-gray-400">
                Note: Transfers to external banks may take up to 30 minutes to
                reflect.
              </p>
            </form>
          )}

          {activeTab === "transactions" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Recent Transactions
              </h3>
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No transactions yet
                </p>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(-5).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{tx.type}</p>
                        <p className="text-xs text-gray-500">
                          {tx.created_at.slice(0, 10)}
                        </p>
                      </div>
                      <p
                        className={`font-bold ${
                          tx.type == "credit"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {tx.type == "credit" ? "+" : "-"}₦
                        {Math.abs(tx.amount).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default Wallet;

// import React, { useState, useCallback, useEffect } from "react";
// import {
//   WalletIcon,
//   AlertCircle,
//   CheckCircle,
//   Loader,
//   ArrowDownCircle,
//   Building2,
// } from "lucide-react";
// import { walletBalance } from "../../../services/authservice";

// const Wallet = () => {
//   const [balance, setBalance] = useState(0);
//   const [activeTab, setActiveTab] = useState("purchase"); // purchase, withdraw, transactions
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // Withdrawal Form State
//   const [withdrawalForm, setWithdrawalForm] = useState({
//     bankCode: "",
//     accountNumber: "",
//     accountName: "", // Usually fetched via API
//     amount: "",
//     pin: ""
//   });

//   const [formErrors, setFormErrors] = useState({});

//   // ... (Your existing fetchWalletData and purchase logic)

//   /**
//    * Handle Withdrawal Submission
//    */
// const handleWithdrawal = async (e) => {
//   e.preventDefault();
//   setError(null);
//   setSuccess(null);

//   // Professional Validation
//   const errors = {};
//   if (!withdrawalForm.bankCode) errors.bankCode = "Select a bank";
//   if (withdrawalForm.accountNumber.length !== 10) errors.accountNumber = "Invalid account number";
//   if (!withdrawalForm.amount || parseFloat(withdrawalForm.amount) < 100)
//       errors.amount = "Minimum withdrawal is ₦100";
//   if (parseFloat(withdrawalForm.amount) > balance) errors.amount = "Insufficient wallet balance";

//   if (Object.keys(errors).length > 0) {
//     setFormErrors(errors);
//     return;
//   }

//   setLoading(true);
//   try {
//     // API call to /withdraw would go here
//     await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay

//     setBalance(prev => prev - parseFloat(withdrawalForm.amount));
//     setSuccess("✅ Withdrawal request submitted successfully!");
//     setWithdrawalForm({ bankCode: "", accountNumber: "", accountName: "", amount: "", pin: "" });
//     setActiveTab("transactions");
//   } catch (err) {
//     setError("Withdrawal failed. Please check your connection.");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="mt-1 min-h-screen flex flex-col relative pb-24 bg-gray-50">
//       {/* Wallet Balance Header */}
//       <div className="bg-gray-800 text-white py-10 rounded-xl shadow-xl mx-4 mt-4">
//         <div className="text-center">
//           <p className="text-xs uppercase font-bold opacity-70">Available Balance</p>
//           <h1 className="text-4xl font-black mt-2">₦{balance.toLocaleString()}</h1>
//           <div className="flex justify-center gap-4 mt-6 px-10">
//               <button
//                 onClick={() => setActiveTab("purchase")}
//                 className="flex-1 bg-white text-gray-900 py-2 rounded-lg text-sm font-bold"
//               >
//                 Top Up
//               </button>
//               <button
//                 onClick={() => setActiveTab("withdraw")}
//                 className="flex-1 bg-[#8CA566] text-white py-2 rounded-lg text-sm font-bold"
//               >
//                 Withdraw
//               </button>
//           </div>
//         </div>
//       </div>

//       {/* Tabs Navigation */}
//       <div className="flex gap-1 bg-white shadow-sm mt-6 rounded-xl mx-4 p-1 border border-gray-200">
//         {['purchase', 'withdraw', 'transactions'].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${
//               activeTab === tab ? "bg-[#8CA566] text-white" : "text-gray-500"
//             }`}
//           >
//             {tab.toUpperCase()}
//           </button>
//         ))}
//       </div>

//       {/* Content Area */}
//       <div className="px-4 mt-6">
//         {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-100 rounded-lg flex items-center gap-2 text-sm"><AlertCircle size={16}/>{error}</div>}
//         {success && <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-100 rounded-lg flex items-center gap-2 text-sm"><CheckCircle size={16}/>{success}</div>}

//         {/* WITHDRAWAL FORM */}
//         {activeTab === "withdraw" && (
//           <form onSubmit={handleWithdrawal} className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
//             <h2 className="font-bold text-gray-800 flex items-center gap-2">
//               <ArrowDownCircle className="text-[#8CA566]" /> Withdraw to Bank
//             </h2>

//             <div>
//               <label className="text-xs font-bold text-gray-500 uppercase">Select Bank</label>
//               <select
//                 className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8CA566]"
//                 value={withdrawalForm.bankCode}
//                 onChange={(e) => setWithdrawalForm({...withdrawalForm, bankCode: e.target.value})}
//               >
//                 <option value="">Choose Bank...</option>
//                 <option value="058">GTBank</option>
//                 <option value="011">First Bank</option>
//                 <option value="044">Access Bank</option>
//                 <option value="057">Zenith Bank</option>
//               </select>
//               {formErrors.bankCode && <p className="text-red-500 text-[10px] mt-1">{formErrors.bankCode}</p>}
//             </div>

//             <div>
//               <label className="text-xs font-bold text-gray-500 uppercase">Account Number</label>
//               <input
//                 type="number"
//                 placeholder="0123456789"
//                 className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8CA566]"
//                 value={withdrawalForm.accountNumber}
//                 onChange={(e) => setWithdrawalForm({...withdrawalForm, accountNumber: e.target.value})}
//               />
//               {formErrors.accountNumber && <p className="text-red-500 text-[10px] mt-1">{formErrors.accountNumber}</p>}
//             </div>

//             <div>
//               <label className="text-xs font-bold text-gray-500 uppercase">Amount (₦)</label>
//               <input
//                 type="number"
//                 placeholder="Min ₦100"
//                 className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8CA566]"
//                 value={withdrawalForm.amount}
//                 onChange={(e) => setWithdrawalForm({...withdrawalForm, amount: e.target.value})}
//               />
//               {formErrors.amount && <p className="text-red-500 text-[10px] mt-1">{formErrors.amount}</p>}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-[#8CA566] text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all flex justify-center items-center gap-2"
//             >
//               {loading ? <Loader className="animate-spin" size={20}/> : "Confirm Withdrawal"}
//             </button>

//             <p className="text-[10px] text-center text-gray-400">
//               Note: Transfers to external banks may take up to 30 minutes to reflect.
//             </p>
//           </form>
//         )}

//         {/* Existing Purchase Form and Transactions... */}
//       </div>
//     </div>
//   );
// };

// export default Wallet;
