import React from "react";

// import React from "react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  name,
  required = true,
}) {
  return (
    <div className="relative w-full mb-4">
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        required={required}
        className="pl-10   pr-4 bg-transparent peer  w-full text-gray-900 placeholder-transparent border border-gray-300 rounded-md pt-4 pb-3 focus:outline-none focus:ring-2 focus:ring-[#8CA566] focus:border-[#8CA566] transition-all"
      />
      <label
        htmlFor={name}
        className="absolute left-9 -top-1 bg-white px-1 text-gray-500 text-[10px] cursor-pointer transition-all 
          peer-placeholder-shown:top-4 
          peer-placeholder-shown:text-base 
          peer-placeholder-shown:text-gray-400 
          peer-focus:-top-2
          peer-focus:text-[10px] 
          peer-focus:text-[#8CA566]"
      >
        {label}
      </label>
    </div>
  );
}

// <div className="relative w-full mb-4">
//   <input
//     type={type}
//     name={name}
//     value={value}
//     onChange={onChange}
//     placeholder={label}
//     required={required}
//     // className="bg-transparent w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:[#8CA566] focus:border-transparent"

//     className="pl-10 bg-transparent peer h-12 w-full text-gray-900 placeholder-transparent border border-gray-300 rounded-md px-3 pt-5 pb-2 focus:outline-none focus:ring-1 focus:ring-[#8CA566] focus:border-[#8CA566]"
//   />
//   <label
//     htmlFor={name}
//     className="absolute left-9 -top-2 bg-white px-1 text-gray-500 text-[10px] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-[#8CA566]"
//   >
//     {label}
//   </label>
// </div>
// );
// }

// export default Input;
