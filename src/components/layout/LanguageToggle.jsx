import { Globe } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export default function LanguageToggle() {
  const { lang, setLang } = useAppStore();

  return (
    <div className="flex items-center gap-2">
      <Globe size={16} className="opacity-70" />

      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="bg-transparent border rounded px-2 py-1 text-xs cursor-pointer"
      >
        <option value="pt">PT 🇧🇷</option>
        <option value="en">EN 🇺🇸</option>
        <option value="es">ES 🇪🇸</option>
      </select>
    </div>
  );
}