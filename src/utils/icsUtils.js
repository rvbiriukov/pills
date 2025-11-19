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

/**
 * Detects if the user is on a mobile device
 */
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Detects iOS devices specifically
 */
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

export const downloadICS = (content, filename = 'pillbox_schedule.ics') => {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });

    // For mobile devices, use data URI approach which often opens calendar directly
    if (isMobileDevice()) {
        // Encode the ICS content
        const encodedContent = encodeURIComponent(content);
        const dataUri = `data:text/calendar;charset=utf-8,${encodedContent}`;

        // Create a temporary link
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = filename;
        link.style.display = 'none';

        // For iOS, we need to handle it differently
        if (isIOS()) {
            // iOS Safari doesn't support data URI downloads well
            // Try to open in new window which might trigger calendar
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(`
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>Add to Calendar</title>
                        <style>
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                                padding: 20px;
                                text-align: center;
                                background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);
                                min-height: 100vh;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                            }
                            .container {
                                background: white;
                                padding: 30px;
                                border-radius: 20px;
                                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                                max-width: 400px;
                            }
                            h1 { color: #4f46e5; margin-bottom: 20px; }
                            p { color: #64748b; margin-bottom: 20px; line-height: 1.6; }
                            .btn {
                                display: inline-block;
                                background: #4f46e5;
                                color: white;
                                padding: 12px 24px;
                                border-radius: 12px;
                                text-decoration: none;
                                font-weight: 600;
                                margin: 10px 0;
                            }
                            .instructions {
                                margin-top: 20px;
                                padding: 15px;
                                background: #f1f5f9;
                                border-radius: 10px;
                                font-size: 14px;
                                color: #475569;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>📅 Add to Calendar</h1>
                            <p>Tap the button below to download your medication schedule:</p>
                            <a href="${dataUri}" download="${filename}" class="btn">Download Schedule</a>
                            <div class="instructions">
                                <strong>Next steps:</strong><br>
                                1. Tap "Download"<br>
                                2. Open the downloaded file<br>
                                3. Choose your calendar app<br>
                                4. Confirm to add events
                            </div>
                        </div>
                    </body>
                    </html>
                `);
                newWindow.document.close();
            } else {
                // Fallback if popup blocked
                fallbackDownload(blob, filename);
            }
        } else {
            // For Android and other mobile devices
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        return;
    }

    // For desktop, use standard blob download
    fallbackDownload(blob, filename);
};

/**
 * Fallback download method using blob
 */
const fallbackDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
