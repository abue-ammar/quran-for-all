import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, type LanguageOption } from "@/lib/constants";

type LanguageSelectorProps = {
  value: string;
  onChange: (code: string) => void;
};

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const selectedLanguage = LANGUAGES.find((l) => l.code === value);

  return (
    <div className="mb-4 flex items-center gap-4 md:justify-end">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full md:w-[220px]">
          <SelectValue>
            {selectedLanguage
              ? `${selectedLanguage.name} (${selectedLanguage.nativeName})`
              : "Select language"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {LANGUAGES.map((lang: LanguageOption) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span>{lang.name}</span>
                <span className="text-muted-foreground">
                  ({lang.nativeName})
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
