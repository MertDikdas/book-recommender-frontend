import React from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export function SearchBar({ value, onChange, onSubmit }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onSubmit();
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        className="flex-1 border rounded px-3 py-2 text-sm"
        placeholder="Search For a Book (title, author, genre...)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        
      />
      <button
        className="px-4 py-2 text-sm rounded bg-black text-white"
        onClick={onSubmit}
      >
        Search
      </button>
    </div>
  );
}
