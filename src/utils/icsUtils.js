/**
 * Formats a date object to ICS date-time string (YYYYMMDDTHHMMSS)
 */
const formatDateToICS = (date) => {
    const pad = (n) => (n < 10 ? '0' + n : n);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

/**
 * Generates the content of an ICS file for a list of medications.
 * @param {Array} medications - List of medication objects
 * @returns {string} ICS file content
 */
export const generateICS = (medications) => {
    const now = new Date();
    const timestamp = formatDateToICS(now) + 'Z'; // DTSTAMP usually UTC

    let icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Digital Pillbox//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
    ];

    medications.forEach((med) => {
        const { id, name, dosage, time, frequency, specificDates } = med;
        const [hours, minutes] = time.split(':').map(Number);
        const summary = dosage ? `💊 ${name} (${dosage})` : `💊 ${name}`;
        const description = dosage ? `Take ${name} ${dosage}` : `Take ${name}`;

        // Common properties
        const commonProps = [
            `UID:${id}@digitalpillbox`,
            `DTSTAMP:${timestamp}`,
            `SUMMARY:${summary}`,
            `DESCRIPTION:${description}`,
            'STATUS:CONFIRMED',
            'TRANSP:TRANSPARENT'
        ];

        // Alarm for instant notification (at event time)
        const alarmBlock = [
            'BEGIN:VALARM',
            'TRIGGER:-PT0M', // 0 minutes before = at event time
            'ACTION:DISPLAY',
            `DESCRIPTION:${summary}`,
            'END:VALARM'
        ];

        if (frequency === 'daily') {
            const startDate = new Date();
            startDate.setHours(hours, minutes, 0, 0);

            // End time: 5 minutes after start
            const endDate = new Date(startDate);
            endDate.setMinutes(endDate.getMinutes() + 5);

            const dtStart = formatDateToICS(startDate);
            const dtEnd = formatDateToICS(endDate);

            icsContent.push('BEGIN:VEVENT');
            icsContent.push(...commonProps);
            icsContent.push(`DTSTART:${dtStart}`);
            icsContent.push(`DTEND:${dtEnd}`);
            icsContent.push('RRULE:FREQ=DAILY');
            icsContent.push(...alarmBlock);
            icsContent.push('END:VEVENT');

        } else if (frequency === 'specific_dates' && specificDates && specificDates.length > 0) {
            // For specific dates, create individual events
            specificDates.forEach((dateStr, index) => {
                const dateObj = new Date(dateStr);
                dateObj.setHours(hours, minutes, 0, 0);

                // End time: 5 minutes after start
                const endDateObj = new Date(dateObj);
                endDateObj.setMinutes(endDateObj.getMinutes() + 5);

                const dtStart = formatDateToICS(dateObj);
                const dtEnd = formatDateToICS(endDateObj);

                icsContent.push('BEGIN:VEVENT');
                icsContent.push(`UID:${id}-${index}@digitalpillbox`);
                icsContent.push(`DTSTAMP:${timestamp}`);
                icsContent.push(`SUMMARY:${summary}`);
                icsContent.push(`DESCRIPTION:${description}`);
                icsContent.push('STATUS:CONFIRMED');
                icsContent.push('TRANSP:TRANSPARENT');
                icsContent.push(`DTSTART:${dtStart}`);
                icsContent.push(`DTEND:${dtEnd}`);
                icsContent.push(...alarmBlock);
                icsContent.push('END:VEVENT');
            });
        }
    });

    icsContent.push('END:VCALENDAR');

    return icsContent.join('\r\n');
};


/**
 * Detects user's platform
 */
const detectPlatform = () => {
    const ua = navigator.userAgent;

    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        return 'ios';
    }
    if (/Android/.test(ua)) {
        return 'android';
    }
    return 'web';
};

/**
 * Formats date for calendar URLs (YYYYMMDDTHHMMSS)
 */
const formatDateForCalendar = (date) => {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
};

/**
 * Creates calendar URL based on platform
 */
const createCalendarUrl = (medication, platform) => {
    const { name, dosage, time, frequency } = medication;
    const [hours, minutes] = time.split(':').map(Number);

    const title = dosage ? `💊 ${name} (${dosage})` : `💊 ${name}`;
    const description = dosage ? `Take ${name} ${dosage}` : `Take ${name}`;

    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 5);

    const startStr = formatDateForCalendar(startDate);
    const endStr = formatDateForCalendar(endDate);

    if (platform === 'ios') {
        // iOS Calendar URL scheme (works in Safari on iOS)
        // Note: This opens in the default calendar app
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: title,
            details: description,
            dates: `${startStr}/${endStr}`,
        });

        const recur = frequency === 'daily' ? '&recur=RRULE:FREQ=DAILY' : '';
        return `https://calendar.google.com/calendar/render?${params.toString()}${recur}`;
    }

    if (platform === 'android') {
        // Android Calendar Intent (opens in default calendar)
        const startMs = startDate.getTime();
        const endMs = endDate.getTime();

        // Google Calendar URL works universally on Android
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: title,
            details: description,
            dates: `${startStr}/${endStr}`,
        });

        const recur = frequency === 'daily' ? '&recur=RRULE:FREQ=DAILY' : '';
        return `https://calendar.google.com/calendar/render?${params.toString()}${recur}`;
    }

    // Web (desktop) - Google Calendar
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        details: description,
        dates: `${startStr}/${endStr}`,
    });

    const recur = frequency === 'daily' ? '&recur=RRULE:FREQ=DAILY' : '';
    return `https://calendar.google.com/calendar/render?${params.toString()}${recur}`;
};

/**
 * Main export function - opens calendar for medications
 */
export const downloadICS = (content, filename = 'pillbox_schedule.ics') => {
    // This is kept for backward compatibility but not used anymore
    console.warn('downloadICS with content is deprecated, use addToCalendar instead');
};

/**
 * Adds medications to calendar using platform-specific URLs
 */
export const addToCalendar = (medications) => {
    if (!medications || medications.length === 0) {
        return;
    }

    const platform = detectPlatform();

    // Open calendar URLs for each medication
    medications.forEach((med, index) => {
        const url = createCalendarUrl(med, platform);

        // Small delay to avoid popup blocking
        setTimeout(() => {
            window.open(url, '_blank');
        }, index * 300);
    });
};
