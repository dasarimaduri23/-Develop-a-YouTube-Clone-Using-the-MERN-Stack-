import React from "react";

function Avatar({ src, name, size = 40 }) {
  const firstLetter = name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div
      style={{ width: size, height: size }}
      className="relative"
    >
      
      {src && src !== "" && (
        <img
          src={src}
          alt={name}
          className="w-full h-full rounded-full object-cover absolute border border-gray-300"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      )}

      {/* LETTER  */}
      <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
        {firstLetter}
      </div>
    </div>
  );
}

export default Avatar;