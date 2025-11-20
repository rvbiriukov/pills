import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DayPicker } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Clock, Pill, Check, AlertCircle, Plus, ChevronDown, Sunrise, Sun, Moon } from 'lucide-react';
import 'react-day-picker/dist/style.css';
import clsx from 'clsx';
import { sanitizeInput } from '../utils/security';

function MedicationForm({ onAdd }) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [time, setTime] = useState('09:00');
    const [isCustomTime, setIsCustomTime] = useState(false);
    const [frequency, setFrequency] = useState('daily');
    const [selectedDays, setSelectedDays] = useState([]);
    const [errors, setErrors] = useState({});

    const TIME_PRESETS = [
        {
            label: t('morning'),
            value: '09:00',
            icon: Sunrise,
            activeClass: "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-700/50 text-orange-700 dark:text-orange-300 ring-1 ring-orange-200 dark:ring-orange-700/50",
            iconClass: "text-orange-400 dark:text-orange-500 group-hover:text-orange-600 dark:group-hover:text-orange-400"
        },
        {
            label: t('afternoon'),
            value: '14:00',
            icon: Sun,
            activeClass: "bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-700/50",
            iconClass: "text-blue-400 dark:text-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
        },
        {
            label: t('evening'),
            value: '21:00',
            icon: Moon,
            activeClass: "bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-700/50 text-purple-700 dark:text-purple-300 ring-1 ring-purple-200 dark:ring-purple-700/50",
            iconClass: "text-purple-400 dark:text-purple-500 group-hover:text-purple-600 dark:group-hover:text-purple-400"
        },
    ];

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) {
            newErrors.name = t('error_required_name');
        }
        if (frequency === 'specific_dates' && selectedDays.length === 0) {
            newErrors.dates = t('please_select_date');
        }
        setErrors(newErrors);

        // Auto-dismiss errors after 3 seconds
        if (Object.keys(newErrors).length > 0) {
            setTimeout(() => {
                setErrors({});
            }, 3000);
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        const newMedication = {
            id: uuidv4(),
            name,
            dosage,
            time,
            frequency,
            specificDates: frequency === 'specific_dates' ? selectedDays : [],
        };

        onAdd(newMedication);

        setName('');
        setDosage('');
        setTime('09:00');
        setIsCustomTime(false);
        setFrequency('daily');
        setSelectedDays([]);
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="label-text">{t('medication_name')}</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
                            <Pill className={clsx("w-5 h-5", errors.name && "text-red-400")} />
                        </div>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => {
                                const sanitized = sanitizeInput(e.target.value);
                                setName(sanitized);
                                if (errors.name) setErrors({ ...errors, name: null });
                            }}
                            placeholder={t('placeholder_medication_name')}
                            className={clsx(
                                "input-field pl-12",
                                errors.name && "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 focus:border-red-500 dark:focus:border-red-400"
                            )}
                        />
                    </div>
                    {errors.name && (
                        <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1.5 animate-in slide-in-from-top-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="dosage" className="label-text">
                        {t('dosage')} <span className="text-slate-400 dark:text-slate-500 font-normal ml-1 text-xs uppercase tracking-wider">({t('optional')})</span>
                    </label>
                    <input
                        type="text"
                        id="dosage"
                        value={dosage}
                        onChange={(e) => {
                            const sanitized = sanitizeInput(e.target.value);
                            setDosage(sanitized);
                        }}
                        placeholder={t('placeholder_dosage')}
                        className="input-field"
                    />
                </div>
            </div>

            <div>
                <label className="label-text">{t('time')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TIME_PRESETS.map((preset) => (
                        <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                                setTime(preset.value);
                                setIsCustomTime(false);
                            }}
                            className={clsx(
                                "flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-200 relative overflow-hidden group",
                                !isCustomTime && time === preset.value
                                    ? preset.activeClass
                                    : "bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-sm"
                            )}
                        >
                            <preset.icon className={clsx(
                                "w-7 h-7 mb-1.5 transition-colors",
                                !isCustomTime && time === preset.value
                                    ? "text-current"
                                    : preset.iconClass
                            )} />
                            <span className="text-sm font-semibold">{preset.label}</span>
                            <span className={clsx(
                                "text-[10px] font-medium mt-0.5 px-2 py-0.5 rounded-full transition-colors",
                                !isCustomTime && time === preset.value
                                    ? "bg-white/50 dark:bg-black/20 text-current"
                                    : "text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-800/50"
                            )}>{preset.value}</span>
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setIsCustomTime(true)}
                        className={clsx(
                            "flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-200 group relative",
                            isCustomTime
                                ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-200 dark:ring-indigo-700"
                                : "bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-sm"
                        )}
                    >
                        <Clock className={clsx("w-7 h-7 mb-1.5 transition-colors", isCustomTime ? "text-indigo-500 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400")} />
                        <span className="text-sm font-semibold">{t('custom')}</span>
                        {isCustomTime && (
                            <div className="absolute top-2 right-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </button>
                </div>

                {isCustomTime && (
                    <div className="mt-4">
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="input-field text-center font-mono text-lg"
                        />
                    </div>
                )}
            </div>

            <div>
                <label className="label-text">{t('frequency')}</label>
                <div className="flex p-1.5 bg-slate-100 dark:bg-slate-700 rounded-2xl mb-4">
                    <button
                        type="button"
                        onClick={() => setFrequency('daily')}
                        className={clsx(
                            "flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
                            frequency === 'daily'
                                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                    >
                        {t('daily')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setFrequency('specific_dates')}
                        className={clsx(
                            "flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
                            frequency === 'specific_dates'
                                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                    >
                        {t('specific_dates')}
                    </button>
                </div>

                {frequency === 'specific_dates' && (
                    <div className={clsx(
                        "border rounded-3xl p-6 bg-white dark:bg-slate-800 flex justify-center animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm",
                        errors.dates ? "border-red-200 dark:border-red-800 ring-1 ring-red-100 dark:ring-red-900" : "border-slate-100 dark:border-slate-700"
                    )}>
                        <div className="w-full flex flex-col items-center">
                            <DayPicker
                                mode="multiple"
                                selected={selectedDays}
                                onSelect={(days) => {
                                    setSelectedDays(days);
                                    if (errors.dates && days?.length > 0) setErrors({ ...errors, dates: null });
                                }}
                            />
                            {errors.dates && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-3 font-medium flex items-center gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.dates}
                                </p>
                            )}
                            {selectedDays.length > 0 && !errors.dates && (
                                <div className="mt-4 flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full font-medium">
                                    <Check className="w-4 h-4" />
                                    {t('select_dates', { count: selectedDays.length })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <button type="submit" className="btn-primary w-full group">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                {t('add_to_schedule')}
            </button>
        </form>
    );
}

export default MedicationForm;
