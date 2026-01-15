// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   AlertCircle,
//   CheckCircle,
//   Loader,
//   User,
//   Phone,
//   Mail,
//   Lock,
// } from "lucide-react";
// import Input from "../user/layouts/Input";
// import fav from "../../assets/logo.png";
// import { register } from "../../services/authservice";

// export default function Register({ onSwitch }) {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirm: "",
//     gender: "",
//   });

//   const [error, setError] = useState("");
//   const [Loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const validateForm = (data) => {
//     if (!data.name || !data.name.trim()) return "Name is required.";
//     if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email))
//       return "A valid email is required.";
//     if (!data.phone || !/^\+?[0-9]{7,15}$/.test(data.phone))
//       return "A valid phone number is required.";
//     if (!data.password || data.password.length < 8)
//       return "Password must be at least 8 characters.";
//     if (data.password != data.confirm) {
//       return "Password Mismatch.";
//     }

//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");
//     const validationError = validateForm(form);

//     if (validationError) {
//       setError(validationError);
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await register(form);

//       setLoading(false);

//       if (res.success) {
//         setSuccess(
//           res.message || "Registration successful. Please verify your email."
//         );
//         setTimeout(() => navigate("/"), 1000);
//       } else {
//         setError(res.message || "Registration failed");
//       }
//     } catch (err) {
//       setLoading(false);
//       setError("Server error. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-lg">
//         <div className="flex justify-center mb-4">
//           <img src={fav} alt="Logo" className="w-20 h-24" />
//         </div>

//         <h1 className="text-xl sm:text-2xl font-bold text-[#8CA566] mb-6 text-center">
//           Cleanwave Recycling Nigeria Limited
//         </h1>

//         {error && (
//           <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg flex gap-2 text-red-600 ">
//             <AlertCircle className="w-5 flex  " />
//             <p className="text-sm text-red-700">{error}</p>
//             {/* {error} */}
//           </div>
//         )}
//         {success && (
// <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
//   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
//   <p className="text-sm text-green-700">{success}</p>
// </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="relative w-full mb-4">
//             <User className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <Input
//               label="Full Name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="relative w-full mb-4">
//             <Mail className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <Input
//               label="Email"
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="relative w-full mb-6">
//             <Phone className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <Input
//               label="Phone"
//               type="text"
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Gender Select */}
//           <div className="relative w-full mb-6">
//             <label className="block text-gray-500 text-[10px] mb-1">
//               Gender
//             </label>
//             <select
//               name="gender"
//               value={form.gender}
//               onChange={handleChange}
//               required
//               className="h-12 w-full border border-gray-300 rounded-md px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#8CA566] focus:border-[#8CA566] text-[14px]"
//             >
//               <option value="" disabled>
//                 Select your gender
//               </option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//             </select>
//           </div>
//           <div className="relative w-full mb-6">
//             <Lock className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <Input
//               label="Password"
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="relative w-full mb-6">
//             <Lock className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

//             <Input
//               label="Confirm Password"
//               type="password"
//               name="confirm"
//               value={form.confirm}
//               onChange={handleChange}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={Loading}
//             className={
//               Loading
//                 ? "cursor-not-allowed w-full bg-gray-300 text-white py-2 rounded-md  mt-4"
//                 : "w-full bg-[#8CA566] text-white py-2 rounded-md hover:bg-[#4C862D] mt-4"
//             }
//           >
//             {Loading ? (
//               <>
//                 <Loader size={18} className="inline-block mr-2 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               "Register"
//             )}
//           </button>
//         </form>

//         <div className="mt-4 text-center text-sm text-gray-600">
//           <span>OR</span>
//           <button
//             type="button"
//             onClick={() => onSwitch("login")}
//             className="block w-full mt-2 bg-[#8CA566] text-white py-2 rounded-md hover:bg-[#4C862D]"
//           >
//             Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   AlertCircle,
//   CheckCircle,
//   Loader,
//   User,
//   Phone,
//   Mail,
//   Lock,
//   MapPin,
// } from "lucide-react";
// import Input from "../user/layouts/Input";
// import fav from "../../assets/logo.png";
// import { register } from "../../services/authservice";
// import nigeriaLocations from "../../data/nigeriaLocations.json";

// // Nigerian States and LGAs Data (Sample truncated for brevity, but structure remains)
// const NIGERIA_LOCATIONS = nigeriaLocations;
// //   Adamawa: ["Demsa", "Fufore", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo-Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
// //   Anambra: ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
// //   // ... Add other states like Kano, Lagos, Rivers, etc. here following the same format
// //   Lagos: ["Agege", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
// //   Kano: ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
// //   FCT: ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"]
// // };

// export default function Register({ onSwitch }) {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirm: "",
//     gender: "",
//     state: "",
//     lga: "",
//   });

//   const [error, setError] = useState("");
//   const [Loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//       // Reset LGA if State changes
//       ...(name === "state" ? { lga: "" } : {}),
//     }));
//   };

//   const validateForm = (data) => {
//     if (!data.name?.trim()) return "Name is required.";
//     if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email))
//       return "A valid email is required.";
//     if (!data.phone || !/^\+?[0-9]{7,15}$/.test(data.phone))
//       return "A valid phone number is required.";
//     if (!data.state) return "Please select your state.";
//     if (!data.gender) return "Please select your Gender.";
//     if (!data.lga) return "Please select your local government.";
//     if (!data.password || data.password.length < 8)
//       return "Password must be at least 8 characters.";
//     if (data.password !== data.confirm) return "Password Mismatch.";
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     const validationError = validateForm(form);
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await register(form);
//       if (res.success) {
//         setSuccess(res.message || "Registration successful!");
//         setTimeout(() => navigate("/"), 2000);
//       } else {
//         console.log("RES", res);
//         setError(res.error || "Registration failed");
//       }
//     } catch (err) {
//       setError("Server error. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
//       <div className="bg-white p-3 rounded-2xl w-full max-w-md shadow-lg">
//         <div className="flex justify-center mb-4">
//           <img src={fav} alt="Logo" className="w-20 h-24" />
//         </div>

//         <h1 className="text-xl sm:text-2xl font-bold text-[#8CA566] mb-6 text-center">
//           Cleanwave Recycling Nigeria Limited
//         </h1>

//         {error && (
//           <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg flex gap-2 text-red-600">
//             <AlertCircle className="w-5" />
//             <p className="text-sm">{error}</p>
//           </div>
//         )}
//         {success && (
//           <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
//             <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
//             <p className="text-sm text-green-700">{success}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="relative">
//             <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
//             <Input
//               label="Full Name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="relative">
//             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
//             <Input
//               label="Email"
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="relative">
//             <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
//             <Input
//               label="Phone"
//               type="text"
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//             />
//           </div>

//           {/* State Selection */}
//           <div className="relative w-full">
//             <MapPin className="absolute left-3 top-[38px] text-gray-400 w-5 h-5" />
//             <label className="block text-gray-500 text-[10px] mb-1">
//               State
//             </label>
//             <select
//               name="state"
//               value={form.state}
//               onChange={handleChange}
//               className="h-12 w-full border border-gray-300 rounded-md pl-10 pr-3 text-gray-900 focus:ring-1 focus:ring-[#8CA566] outline-none text-[14px]"
//             >
//               <option value="">Select State</option>
//               {Object.keys(NIGERIA_LOCATIONS)
//                 .sort()
//                 .map((state) => (
//                   <option key={state} value={state}>
//                     {state}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           {/* LGA Selection */}
//           <div className="relative w-full">
//             <MapPin className="absolute left-3 top-[38px] text-gray-400 w-5 h-5" />
//             <label className="block text-gray-500 text-[10px] mb-1">
//               Local Government (LGA)
//             </label>
//             <select
//               name="lga"
//               value={form.lga}
//               onChange={handleChange}
//               disabled={!form.state}
//               className="h-12 w-full border border-gray-300 rounded-md pl-10 pr-3 text-gray-900 focus:ring-1 focus:ring-[#8CA566] outline-none text-[14px] disabled:bg-gray-100"
//             >
//               <option value="">Select LGA</option>
//               {form.state &&
//                 NIGERIA_LOCATIONS[form.state].map((lga) => (
//                   <option key={lga} value={lga}>
//                     {lga}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           <div className="relative">
//             <label className="block text-gray-500 text-[10px] mb-1">
//               Gender
//             </label>
//             <select
//               name="gender"
//               value={form.gender}
//               onChange={handleChange}
//               className="h-12 w-full border border-gray-300 rounded-md px-3 text-gray-900 focus:ring-1 focus:ring-[#8CA566] outline-none text-[14px]"
//             >
//               <option value="">Select Gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//             </select>
//           </div>

//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
//             <Input
//               label="Password"
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
//             <Input
//               label="Confirm Password"
//               type="password"
//               name="confirm"
//               value={form.confirm}
//               onChange={handleChange}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={Loading}
//             className={`w-full py-2 rounded-md mt-4 text-white font-medium transition ${
//               Loading
//                 ? "bg-gray-300 cursor-not-allowed"
//                 : "bg-[#8CA566] hover:bg-[#4C862D]"
//             }`}
//           >
//             {Loading ? (
//               <>
//                 <Loader size={18} className="inline-block mr-2 animate-spin" />{" "}
//                 Processing...
//               </>
//             ) : (
//               "Register"
//             )}
//           </button>
//         </form>

//         <div className="mt-4 text-center text-sm text-gray-600">
//           <span>OR</span>
//           <button
//             type="button"
//             onClick={() => onSwitch("login")}
//             className="block w-full mt-2 bg-[#8CA566] text-white py-2 rounded-md hover:bg-[#4C862D]"
//           >
//             Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Users,
} from "lucide-react";
import Input from "../user/layouts/Input";
import fav from "../../assets/logo.png";
import { register } from "../../services/authservice";
import nigeriaLocations from "../../data/nigeriaLocations.json";

export default function Register({ onSwitch }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    gender: "",
    state: "",
    lga: "",
  });

  const [uiState, setUiState] = useState({
    loading: false,
    error: "",
    success: "",
  });

  // Memoize states to prevent unnecessary re-renders
  const states = useMemo(() => Object.keys(nigeriaLocations).sort(), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { lga: "" } : {}), // Reset LGA on state change
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return "Enter a valid email address.";
    if (!/^\d{10,15}$/.test(form.phone.replace(/\D/g, "")))
      return "Enter a valid Nigerian phone number.";
    if (!form.state) return "Please select a state.";
    if (!form.lga) return "Please select a Local Government Area.";
    if (!form.gender) return "Please select your gender.";
    if (form.password.length < 8)
      return "Password must be at least 8 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) return setUiState({ ...uiState, error: errorMsg });

    setUiState({ loading: true, error: "", success: "" });
    try {
      const res = await register(form);
      if (res.success) {
        setUiState({
          loading: false,
          error: "",
          success: `Account created! Verification sent to ${form.email}`,
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        setUiState({
          loading: false,
          error: res.error || "Registration failed.",
          success: "",
        });
      }
    } catch (err) {
      setUiState({
        loading: false,
        error: "Service unavailable. Please try again later.",
        success: "",
      });
    }
  };

  const selectClass =
    "h-12 w-full border border-gray-300 rounded-lg pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-[#8CA566] focus:border-transparent outline-none text-sm transition-all appearance-none bg-white";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-2">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-white p-6 text-center border-b border-gray-50">
          <img
            src={fav}
            alt="Cleanwave Logo"
            className="w-16 h-20 mx-auto mb-4 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">
            Join Cleanwave Recycling Nigeria Limited
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Status Alerts */}
          {uiState.error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{uiState.error}</span>
            </div>
          )}
          {uiState.success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{uiState.success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-5 text-gray-400 w-5 h-5" />
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-5 text-gray-400 w-5 h-5" />
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-5 text-gray-400 w-5 h-5" />
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="08012345678"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider"></label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider"></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider"></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="lga"
                    value={form.lga}
                    onChange={handleChange}
                    disabled={!form.state}
                    className={`${selectClass} disabled:bg-gray-50 disabled:cursor-not-allowed`}
                  >
                    <option value="">Select LGA</option>
                    {form.state &&
                      nigeriaLocations[form.state].map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-5 text-gray-400 w-5 h-5" />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-5 text-gray-400 w-5 h-5" />
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={uiState.loading}
            className="w-full mt-8 bg-[#8CA566] hover:bg-[#7a9155] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#8ca5664d] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {uiState.loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onSwitch("login")}
              className="text-[#8CA566] font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
