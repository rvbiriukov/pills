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

export default TimePicker;
