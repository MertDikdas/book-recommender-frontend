import React from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export function PageChanger({ value, onChange, onSubmit }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!value?.trim()) return; // boşsa çalışmasın
      onSubmit();
    }
  };

  const handleClick = () => {
    if (!value?.trim()) return; // boşsa çalışmasın
    onSubmit();
  };

  return (
    <div className="flex items-center gap-2 mb-3">
      
      <span className="text-xs font-medium text-gray-600">
        Page
      </span>

      <input
        className="w-20 border rounded px-2 py-1 text-xs"
        placeholder="No"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        className="px-3 py-1 text-xs rounded bg-black text-black disabled:opacity-40"
        onClick={handleClick}
        disabled={!value?.trim()}
      >
        Go
      </button>

    </div>
  );
}
