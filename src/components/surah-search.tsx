import { Search, X } from "lucide-react";
import { useRef } from "react";

type SurahSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SurahSearch({
  value,
  onChange,
  placeholder = "Search surah...",
}: SurahSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex-1">
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full rounded-md border bg-transparent py-2 pr-9 pl-9 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
