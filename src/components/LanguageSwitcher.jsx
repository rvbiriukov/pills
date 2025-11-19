import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', flag: '🇺🇸', label: 'English' },
    { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
    { code: 'es', flag: '🇪🇸', label: 'Español' },
    { code: 'pt', flag: '🇵🇹', label: 'Português' },
    { code: 'ru', flag: '🇷🇺', label: 'Русский' },
];

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    return (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <div className="relative group">
                <button className="flex items-center gap-2 bg-white/50 hover:bg-white border border-slate-200 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-all shadow-sm hover:shadow-md">
                    <Globe className="w-4 h-4" />
                    {LANGUAGES.find(l => l.code === i18n.resolvedLanguage)?.flag || '🌐'}
                </button>

                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => i18n.changeLanguage(lang.code)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors"
                        >
                            <span className="text-lg">{lang.flag}</span>
                            <span className={`flex-1 ${i18n.resolvedLanguage === lang.code ? 'font-semibold text-sky-600' : 'text-slate-600'}`}>
                                {lang.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LanguageSwitcher;
