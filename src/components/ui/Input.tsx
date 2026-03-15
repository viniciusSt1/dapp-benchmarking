'use client';

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  description = "",
  required = false,
  error = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  description?: string;
  required?: boolean;
  error?: boolean;
}) {
  return (
    <div>
      <label className="block text-white mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2
          [appearance:textfield]
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
          ${error
            ? "border-red-500 focus:ring-red-500"
            : "border-slate-700 focus:ring-purple-600"
          }`}

      />

      <p className={`${error ? "text-red-400" : "text-slate-500"} mt-1`}>
        {description}
      </p>
    </div>
  );
}