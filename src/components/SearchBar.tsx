import React from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export function SearchBar({ value, onChange, onSubmit }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        className="flex-1 border rounded px-3 py-2 text-sm"
        placeholder="Kitap ara (başlık, yazar, tür...)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="px-4 py-2 text-sm rounded bg-black text-white"
        onClick={onSubmit}
      >
        Ara
      </button>
    </div>
  );
}
