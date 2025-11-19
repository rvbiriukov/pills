import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MedicationForm from './components/MedicationForm';
import MedicationList from './components/MedicationList';
import LanguageSwitcher from './components/LanguageSwitcher';
import { generateICS, downloadICS } from './utils/icsUtils';
import { CalendarCheck, Download, Sparkles } from 'lucide-react';
import './i18n'; // Initialize i18n
import './index.css';

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

      <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-1 border border-white/60 shadow-sm relative z-10">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1.5 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-slate-900 font-display">{t('add_medication')}</h2>
          </div>
          <MedicationForm onAdd={addMedication} />
        </div>
      </section>

      <section className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 px-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-slate-200 rounded-full"></div>
            <h2 className="text-xl font-bold text-slate-900 font-display">{t('your_schedule')}</h2>
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
  );
}

export default App;
