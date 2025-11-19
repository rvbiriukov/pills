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
        const summary = dosage ? `💊 Take ${name} (${dosage})` : `💊 Take ${name}`;
        const description = dosage ? `Time to take your ${name} ${dosage}` : `Time to take your ${name}`;

        // Common properties
        const commonProps = [
            `UID:${id}@digitalpillbox`,
            `DTSTAMP:${timestamp}`,
            `SUMMARY:${summary}`,
            `DESCRIPTION:${description}`,
            'STATUS:CONFIRMED',
            'TRANSP:TRANSPARENT'
        ];

        // Alarm for reminders
        const alarmBlock = [
            'BEGIN:VALARM',
            'TRIGGER:-PT0M',
            'ACTION:DISPLAY',
            `DESCRIPTION:${description}`,
            'END:VALARM'
        ];

        if (frequency === 'daily') {
            const startDate = new Date();
            startDate.setHours(hours, minutes, 0, 0);
            const dtStart = formatDateToICS(startDate);

            icsContent.push('BEGIN:VEVENT');
            icsContent.push(...commonProps);
            icsContent.push(`DTSTART:${dtStart}`);
            icsContent.push('RRULE:FREQ=DAILY');
            icsContent.push(...alarmBlock);
            icsContent.push('END:VEVENT');

        } else if (frequency === 'specific_dates' && specificDates && specificDates.length > 0) {
            // Sort dates
            const sortedDates = [...specificDates].sort((a, b) => new Date(a) - new Date(b));

            // Create a base date for the first event
            const firstDateObj = new Date(sortedDates[0]);
            firstDateObj.setHours(hours, minutes, 0, 0);
            const dtStart = formatDateToICS(firstDateObj);

            // Format all dates for RDATE
            const rdateStrings = sortedDates.map(d => {
                const dateObj = new Date(d);
                dateObj.setHours(hours, minutes, 0, 0);
                return formatDateToICS(dateObj);
            });
            const rdateValue = rdateStrings.join(',');

            icsContent.push('BEGIN:VEVENT');
            icsContent.push(...commonProps);
            icsContent.push(`DTSTART:${dtStart}`);
            icsContent.push(`RDATE;VALUE=DATE-TIME:${rdateValue}`);
            icsContent.push(...alarmBlock);
            icsContent.push('END:VEVENT');
        }
    });

    icsContent.push('END:VCALENDAR');

    return icsContent.join('\r\n');
};

export const downloadICS = (content, filename = 'pillbox_schedule.ics') => {
    // Standard, reliable download method
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
