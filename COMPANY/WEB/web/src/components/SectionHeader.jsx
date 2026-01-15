import React from "react";

export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-3xl font-semibold text-brand-text">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-brand-text/70 max-w-2xl mx-auto text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
