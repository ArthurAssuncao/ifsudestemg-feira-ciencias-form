// components/NotaInput.tsx - Versão alternativa
"use client";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[0-2]([.,][0-9])?$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  const adjustValue = (amount: number) => {
    const newValue = Math.max(0, Math.min(2, numericValue + amount));
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
          className="p-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed hover:cursor-pointer"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-center focus:outline-none focus:ring-green-500 focus:border-green-500"
            inputMode="decimal"
          />
        </div>

        {/* Botão de incremento */}
        <button
          type="button"
          onClick={() => adjustValue(0.1)}
          disabled={numericValue >= 2}
          className="p-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed hover:cursor-pointer"
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
      <p className="text-xs text-gray-500 mt-1 text-center">
        Notas de 0 a 2 com uma casa decimal
      </p>
      <p className="text-xs text-gray-500 mt-1 text-center">
        Clique nos botões para aumentar ou diminuir a nota ou digite o valor
      </p>
    </div>
  );
}
