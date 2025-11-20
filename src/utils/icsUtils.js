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
 * Detects if user is on mobile device
 */
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Formats date for calendar URLs (YYYYMMDDTHHMMSS)
 */
const formatDateForCalendar = (date) => {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
};

/**
 * Creates calendar URL for daily medications
 */
const createCalendarUrl = (medication, platform) => {
    const { name, dosage, time } = medication;
    const [hours, minutes] = time.split(':').map(Number);

    const title = dosage ? `💊 ${name} (${dosage})` : `💊 ${name}`;
    const description = dosage ? `Take ${name} ${dosage}` : `Take ${name}`;

    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 5);

    const startStr = formatDateForCalendar(startDate);
    const endStr = formatDateForCalendar(endDate);

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        details: description,
        dates: `${startStr}/${endStr}`,
    });

    // Daily recurrence
    const recur = '&recur=RRULE:FREQ=DAILY';
    return `https://calendar.google.com/calendar/render?${params.toString()}${recur}`;
};

/**
 * Downloads ICS file for complex cases (specific dates)
 */
const downloadICSFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });

    if (isMobileDevice()) {
        // For mobile: use data URI which triggers native calendar apps
        const dataUri = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(content);
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        // For desktop: use blob URL
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};

/**
 * Main export function - kept for backward compatibility
 */
export const downloadICS = (content, filename = 'pillbox_schedule.ics') => {
    downloadICSFile(content, filename);
};

/**
 * Adds medications to calendar using hybrid approach
 */
export const addToCalendar = (medications, t) => {
    if (!medications || medications.length === 0) {
        return;
    }

    // Use URL only for single daily medication (simple and fast)
    // For everything else, use ICS file (better UX for multiple items)
    const isSingleDaily = medications.length === 1 && medications[0].frequency === 'daily';

    if (isSingleDaily) {
        // Single daily medication - use URL approach
        const platform = detectPlatform();
        const url = createCalendarUrl(medications[0], platform);
        window.open(url, '_blank');
    } else {
        // Multiple medications or specific dates - use ICS file
        // Show disclaimer first
        if (t) {
            alert(t('ics_file_disclaimer'));
        }

        // Generate and download ICS file
        const icsContent = generateICS(medications);
        downloadICSFile(icsContent, 'medication_schedule.ics');
    }
};
