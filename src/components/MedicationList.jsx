import { Trash2, Clock, Calendar, Pill } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function MedicationList({ medications, onDelete }) {
    const { t } = useTranslation();

    if (medications.length === 0) {
        return (
            <div className="text-center py-16 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200/60 backdrop-blur-sm">
                <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <Pill className="w-9 h-9 text-indigo-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1 font-display">{t('no_medications')}</h3>
                <p className="text-slate-500">{t('add_first_medication')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {medications.map((med) => (
                <div
                    key={med.id}
                    className="bg-white rounded-2xl p-5 flex items-center justify-between group card-hover relative overflow-hidden"
                >
                    {/* Decorative accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="flex-1 pl-2">
                        <div className="flex items-center gap-3 mb-2.5">
                            <h3 className="font-bold text-slate-900 text-lg font-display tracking-tight">{med.name}</h3>
                            {med.dosage && (
                                <span className="bg-indigo-50 text-indigo-600 text-xs px-2.5 py-1 rounded-full font-bold border border-indigo-100">
                                    {med.dosage}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-5 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg">
                                <Clock className="w-4 h-4 text-indigo-400" />
                                {med.time}
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                {med.frequency === 'daily' ? (
                                    t('daily')
                                ) : (
                                    <span>
                                        {med.specificDates?.length || 0} {t('specific_dates').toLowerCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onDelete(med.id)}
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                        aria-label={t('delete_label')}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    );
}

export default MedicationList;
