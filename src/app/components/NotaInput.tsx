// components/NotaInput.tsx - Versão alternativa
"use client";

import { MAX_NOTA } from "../data";

interface NotaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function NotaInput({
  label,
  value,
  onChange,
  required,
}: NotaInputProps) {
  const numericValue = value ? parseFloat(value.replace(",", ".")) : 0;

  const regex = new RegExp(`^(${MAX_NOTA}([.,]0)?|[0-9]([.,][0-9])?)$`);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "" || regex.test(inputValue)) {
      onChange(inputValue);
    }
  };

  const adjustValue = (amount: number) => {
    const newValue = Math.max(0, Math.min(MAX_NOTA, numericValue + amount));
    onChange(newValue.toFixed(1).replace(".", ","));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex items-center space-x-2">
        {/* Botão de decremento */}
        <button
          type="button"
          onClick={() => adjustValue(-0.1)}
          disabled={numericValue <= 0}
          className="p-2 mt-[-24px] rounded-full border border-gray-300 text-black hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed hover:cursor-pointer"
          title="Diminuir 0,1"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>

        {/* Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="0,0"
            required={required}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-center focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder:text-gray-700"
            inputMode="decimal"
          />
          <input
            type="range"
            min="0"
            max={MAX_NOTA}
            step="0.1"
            value={numericValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-1 bg-gray-200 rounded-md appearance-none cursor-pointer accent-green-600"
          />
        </div>

        {/* Botão de incremento */}
        <button
          type="button"
          onClick={() => adjustValue(0.1)}
          disabled={numericValue >= MAX_NOTA}
          className="p-2 mt-[-24px] rounded-full border border-gray-300 text-black hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed hover:cursor-pointer"
          title="Aumentar 0,1"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
      <p className="text-xs text-black mt-1 text-center">
        {`Notas de 0 a ${MAX_NOTA} com uma casa decimal`}
      </p>
      <p className="text-xs text-black mt-1 text-center">
        Clique nos botões para aumentar ou diminuir a nota ou digite o valor
      </p>
    </div>
  );
}
