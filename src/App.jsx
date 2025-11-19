import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MedicationForm from './components/MedicationForm';
import MedicationList from './components/MedicationList';
import { generateICS, downloadICS } from './utils/icsUtils';
import { CalendarCheck, Download, Sparkles, Globe } from 'lucide-react';
import './i18n'; // Initialize i18n
import './index.css';

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

function App() {
  const { t } = useTranslation();

  // Initialize from localStorage or empty array
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever medications change
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  const addMedication = (med) => {
    setMedications([...medications, med]);
  };

  const deleteMedication = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const handleExport = () => {
    if (medications.length === 0) {
      alert(t('export_alert'));
      return;
    }
    const icsContent = generateICS(medications);
    downloadICS(icsContent, 'pillbox_schedule.ics');
  };

  return (
    <>
      <div className="app-container">
        {/* Decorative background blobs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <LanguageSwitcher />

        <header className="text-center space-y-3 mt-6 sm:mt-2 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 mb-2 transform transition-transform hover:scale-105 duration-300">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-display">{t('app_title')}</h1>
          <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed">
            {t('app_subtitle')}
          </p>
        </header>

        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 relative z-10">
          <h2 className="text-2xl font-bold text-slate-900 font-display mb-6">{t('add_medication')}</h2>
          <MedicationForm onAdd={addMedication} />
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 font-display">{t('your_schedule')}</h2>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
                {medications.length}
              </span>
            </div>

            {medications.length > 0 && (
              <button
                onClick={handleExport}
                className="btn-primary py-2.5 px-5 text-sm"
              >
                <Download className="w-4 h-4" />
                {t('export_calendar')}
              </button>
            )}
          </div>
          <MedicationList medications={medications} onDelete={deleteMedication} />
        </section>
      </div>

      {/* Footer - outside container */}
      <footer className="mt-8 mb-6 text-center w-full max-w-2xl">
        <p className="text-xs text-slate-400 font-medium">
          {t('footer_made_with')}{' '}
          <a
            href="https://www.linkedin.com/in/rvbiriukov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-600 transition-colors underline decoration-indigo-200 hover:decoration-indigo-400"
          >
            Roman Biriukov
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;
