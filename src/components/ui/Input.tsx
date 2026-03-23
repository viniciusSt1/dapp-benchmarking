'use client';

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  description = "",
  required = false,
  error = false,
  disabled = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  description?: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
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
        disabled={disabled}
        className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2

          ${error
            ? "border-red-500 focus:ring-red-500"
            : "border-slate-700 focus:ring-purple-600"
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}

      />

      <p className={`${error ? "text-red-400" : "text-slate-500"} mt-1`}>
        {description}
      </p>
    </div>
  );
}