import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DayPicker } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Clock, Pill, Check, AlertCircle, Plus, ChevronDown, Sunrise, Sun, Moon } from 'lucide-react';
import 'react-day-picker/dist/style.css';
import clsx from 'clsx';

function TimePicker({ value, onChange }) {
    const [hours, minutes] = value.split(':');

    const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    const handleHourChange = (h) => {
        onChange(`${h}:${minutes}`);
    };

    const handleMinuteChange = (m) => {
        onChange(`${hours}:${m}`);
    };

    return (
        <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-xl animate-in fade-in zoom-in-95 duration-200 w-full max-w-sm">
            {/* Hours Column */}
            <div className="flex-1">
                <div className="text-xs font-bold text-slate-400 mb-2 text-center uppercase tracking-wider">Hours</div>
                <div className="grid grid-cols-4 gap-1 h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {HOURS.map((h) => (
                        <button
                            key={h}
                            type="button"
                            onClick={() => handleHourChange(h)}
                            className={clsx(
                                "py-2 rounded-lg text-sm font-medium transition-all hover:scale-105",
                                hours === h
                                    ? "bg-indigo-500 text-white shadow-md"
                                    : "text-slate-600 hover:bg-slate-100"
                            )}
                        >
                            {h}
                        </button>
                    ))}
                </div>
            </div>

            {/* Separator */}
            <div className="w-px bg-slate-100 my-2"></div>

            {/* Minutes Column */}
            <div className="flex-1">
                <div className="text-xs font-bold text-slate-400 mb-2 text-center uppercase tracking-wider">Minutes</div>
                <div className="grid grid-cols-3 gap-1 h-48 overflow-y-auto pl-1 custom-scrollbar">
                    {MINUTES.map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => handleMinuteChange(m)}
                            className={clsx(
                                "py-2 rounded-lg text-sm font-medium transition-all hover:scale-105",
                                minutes === m
                                    ? "bg-indigo-500 text-white shadow-md"
                                    : "text-slate-600 hover:bg-slate-100"
                            )}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MedicationForm({ onAdd }) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [time, setTime] = useState('09:00');
    const [isCustomTime, setIsCustomTime] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [frequency, setFrequency] = useState('daily');
    const [selectedDays, setSelectedDays] = useState([]);
    const [errors, setErrors] = useState({});
    const timePickerRef = useRef(null);
    const customTimeButtonRef = useRef(null);

    const TIME_PRESETS = [
        { label: t('morning'), value: '09:00', icon: Sunrise },
        { label: t('afternoon'), value: '14:00', icon: Sun },
        { label: t('evening'), value: '21:00', icon: Moon },
    ];

    // Close custom time picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                timePickerRef.current &&
                !timePickerRef.current.contains(event.target) &&
                !customTimeButtonRef.current?.contains(event.target)
            ) {
                setShowTimePicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
        setShowTimePicker(false);
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
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            <Pill className={clsx("w-5 h-5", errors.name && "text-red-400")} />
                        </div>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors({ ...errors, name: null });
                            }}
                            placeholder="e.g. Vitamin D"
                            className={clsx(
                                "input-field pl-12",
                                errors.name && "bg-red-50 border-red-200 focus:border-red-500 focus:ring-red-200"
                            )}
                        />
                    </div>
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1.5 animate-in slide-in-from-top-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="dosage" className="label-text">
                        {t('dosage')} <span className="text-slate-400 font-normal ml-1 text-xs uppercase tracking-wider">({t('optional')})</span>
                    </label>
                    <input
                        type="text"
                        id="dosage"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        placeholder="e.g. 1000 IU"
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
                                setShowTimePicker(false);
                            }}
                            className={clsx(
                                "flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-200 relative overflow-hidden group",
                                !isCustomTime && time === preset.value
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                                    : "bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-slate-200 hover:shadow-sm"
                            )}
                        >
                            <preset.icon className="w-7 h-7 mb-1.5 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                            <span className="text-sm font-semibold">{preset.label}</span>
                            <span className="text-[10px] font-medium text-slate-400 mt-0.5 bg-white/50 px-2 py-0.5 rounded-full">{preset.value}</span>
                        </button>
                    ))}
                    <button
                        type="button"
                        ref={customTimeButtonRef}
                        onClick={() => {
                            setIsCustomTime(true);
                            setShowTimePicker(!showTimePicker);
                        }}
                        className={clsx(
                            "flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-200 group relative",
                            isCustomTime
                                ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                                : "bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-slate-200 hover:shadow-sm"
                        )}
                    >
                        <Clock className={clsx("w-7 h-7 mb-1.5 transition-colors", isCustomTime ? "text-indigo-500" : "text-slate-400 group-hover:text-slate-500")} />
                        <span className="text-sm font-semibold">{t('custom')}</span>
                        {isCustomTime && (
                            <div className="absolute top-2 right-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </button>
                </div>

                {isCustomTime && (
                    <div className="mt-4 relative">
                        <div
                            onClick={() => setShowTimePicker(!showTimePicker)}
                            className="input-field flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors group"
                        >
                            <span className="font-mono text-2xl tracking-widest font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                                {time}
                            </span>
                            <ChevronDown className={clsx("w-5 h-5 text-slate-400 transition-transform duration-200", showTimePicker && "rotate-180")} />
                        </div>

                        {showTimePicker && (
                            <div className="absolute top-full left-0 right-0 mt-2 z-20 flex justify-center" ref={timePickerRef}>
                                <TimePicker value={time} onChange={setTime} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div>
                <label className="label-text">{t('frequency')}</label>
                <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-4">
                    <button
                        type="button"
                        onClick={() => setFrequency('daily')}
                        className={clsx(
                            "flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
                            frequency === 'daily'
                                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                                : "text-slate-500 hover:text-slate-700"
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
                                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {t('specific_dates')}
                    </button>
                </div>

                {frequency === 'specific_dates' && (
                    <div className={clsx(
                        "border rounded-3xl p-6 bg-white flex justify-center animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm",
                        errors.dates ? "border-red-200 ring-1 ring-red-100" : "border-slate-100"
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
                                <p className="text-red-500 text-xs mt-3 font-medium flex items-center gap-1.5">
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
