"use client";

import { useEffect, useRef, useState } from "react";

interface AutoCompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function AutoCompleteInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled = false,
}: AutoCompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  // Filtrar opções baseadas no input
  useEffect(() => {
    if (value) {
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
    setHighlightedIndex(-1);
  }, [value, options]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        listboxRef.current &&
        !listboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClickApagar = () => {
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.value = "";
      onChange("");
      setHighlightedIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case "Enter":
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;

      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleOptionMouseEnter = (index: number) => {
    setHighlightedIndex(index);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-black mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="size-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-black "
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />
        {/* Botão de apagar */}
        {inputRef.current && isOpen && inputRef.current.value.length > 0 && (
          <div
            className="absolute flex items-center justify-center size-9 bg-red-100 top-5 right-0.5 text-2xl transform -translate-y-1/2 text-gray-800 hover:cursor-pointer rounded-md"
            onClick={handleClickApagar}
          >
            x
          </div>
        )}
      </div>

      {/* Dropdown de opções */}
      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={listboxRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              role="option"
              aria-selected={index === highlightedIndex}
              className={`px-3 py-2 cursor-pointer transition-colors ${
                index === highlightedIndex
                  ? "bg-green-100 text-green-900"
                  : "hover:bg-gray-100"
              }`}
              onMouseDown={() => handleSelect(option)}
              onMouseEnter={() => handleOptionMouseEnter(index)}
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {/* Mensagem quando não há resultados */}
      {isOpen && filteredOptions.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="px-3 py-2 text-gray-800">
            Nenhum resultado encontrado
          </div>
        </div>
      )}

      {/* Indicador de que é um campo de auto-complete */}
      {/* {options.length > 0 && (
        <div className="absolute right-3 top-8 transform -translate-y-1/2 text-gray-800">
          ⌄
        </div>
      )} */}
    </div>
  );
}
