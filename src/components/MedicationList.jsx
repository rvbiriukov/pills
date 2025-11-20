import { Trash2, Clock, Calendar, Pill } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Get color scheme based on time of day
const getTimeColor = (time) => {
    const [hours] = time.split(':').map(Number);

    if (hours >= 5 && hours < 12) {
        // Morning: sunrise colors
        return {
            gradient: 'from-amber-400 to-orange-500',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-100 dark:border-amber-800/30',
            text: 'text-amber-600 dark:text-amber-400',
            icon: 'text-amber-400 dark:text-amber-500'
        };
    } else if (hours >= 12 && hours < 18) {
        // Afternoon: bright colors
        return {
            gradient: 'from-sky-400 to-blue-500',
            bg: 'bg-sky-50 dark:bg-sky-900/20',
            border: 'border-sky-100 dark:border-sky-800/30',
            text: 'text-sky-600 dark:text-sky-400',
            icon: 'text-sky-400 dark:text-sky-500'
        };
    } else {
        // Evening/Night: purple colors
        return {
            gradient: 'from-indigo-400 to-purple-500',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            border: 'border-indigo-100 dark:border-indigo-800/30',
            text: 'text-indigo-600 dark:text-indigo-400',
            icon: 'text-indigo-400 dark:text-indigo-500'
        };
    }
};

function MedicationList({ medications, onDelete }) {
    const { t } = useTranslation();

    if (medications.length === 0) {
        return (
            <div className="text-center py-16 bg-white/50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <Pill className="w-9 h-9 text-indigo-300 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1 font-display">{t('no_medications')}</h3>
                <p className="text-slate-500 dark:text-slate-400">{t('add_first_medication')}</p>
            </div>
        );
    }

    // Sort medications by time
    const sortedMedications = [...medications].sort((a, b) => {
        const [aHours, aMinutes] = a.time.split(':').map(Number);
        const [bHours, bMinutes] = b.time.split(':').map(Number);
        return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
    });

    return (
        <div className="space-y-4">
            {sortedMedications.map((med) => {
                const colors = getTimeColor(med.time);

                return (
                    <div
                        key={med.id}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-5 flex items-center justify-between group card-hover relative overflow-hidden border border-slate-100 dark:border-slate-700"
                    >
                        {/* Decorative accent line with time-based gradient */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                        <div className="flex-1 pl-2">
                            <div className="flex items-center gap-3 mb-2.5">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg font-display tracking-tight">{med.name}</h3>
                                {med.dosage && (
                                    <span className={`${colors.bg} ${colors.text} text-xs px-2.5 py-1 rounded-full font-bold ${colors.border} border`}>
                                        {med.dosage}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                <div className={`flex items-center gap-2 ${colors.bg} px-2.5 py-1 rounded-lg`}>
                                    <Clock className={`w-4 h-4 ${colors.icon}`} />
                                    <span className={colors.text}>{med.time}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                                    <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    <span className="text-slate-600 dark:text-slate-300">
                                        {med.frequency === 'daily' ? (
                                            t('daily')
                                        ) : (
                                            <span>
                                                {med.specificDates?.length || 0} {t('specific_dates').toLowerCase()}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onDelete(med.id)}
                            className="p-2.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                            aria-label={t('delete_label')}
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default MedicationList;
