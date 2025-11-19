import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "app_title": "Digital pillbox",
            "app_subtitle": "Design your medication schedule and export it directly to your calendar.",
            "add_medication": "Add medication",
            "your_schedule": "Your schedule",
            "export_calendar": "Add to calendar",
            "medication_name": "Medication name",
            "dosage": "Dosage",
            "optional": "Optional",
            "time": "Time",
            "frequency": "Frequency",
            "daily": "Daily",
            "specific_dates": "Specific dates",
            "add_to_schedule": "Add to schedule",
            "morning": "Morning",
            "afternoon": "Afternoon",
            "evening": "Evening",
            "custom": "Custom",
            "select_dates": "You selected {{count}} day(s).",
            "please_select_date": "Please select at least one date.",
            "no_medications": "No medications yet",
            "add_first_medication": "Add your first medication to get started.",
            "delete_label": "Delete medication",
            "export_alert": "Please add at least one medication to export.",
            "error_required_name": "Please enter the medication name.",
            "footer_made_with": "Vibe-coded with ❤️ for those over 30 by"
        }
    },
    de: {
        translation: {
            "app_title": "Digitale tablettenbox",
            "app_subtitle": "Planen Sie Ihre Medikamenteneinnahme und exportieren Sie sie direkt in Ihren Kalender.",
            "add_medication": "Medikament hinzufügen",
            "your_schedule": "Ihr zeitplan",
            "export_calendar": "Zum kalender hinzufügen",
            "medication_name": "Medikamentenname",
            "dosage": "Dosierung",
            "optional": "Optional",
            "time": "Zeit",
            "frequency": "Häufigkeit",
            "daily": "Täglich",
            "specific_dates": "Bestimmte tage",
            "add_to_schedule": "Zum zeitplan hinzufügen",
            "morning": "Morgens",
            "afternoon": "Mittags",
            "evening": "Abends",
            "custom": "Benutzerdefiniert",
            "select_dates": "Sie haben {{count}} Tag(e) ausgewählt.",
            "please_select_date": "Bitte wählen Sie mindestens einen Tag aus.",
            "no_medications": "Noch keine medikamente",
            "add_first_medication": "Fügen Sie Ihr erstes Medikament hinzu, um zu beginnen.",
            "delete_label": "Medikament löschen",
            "export_alert": "Bitte fügen Sie mindestens ein Medikament hinzu, um zu exportieren.",
            "error_required_name": "Bitte geben Sie den Medikamentennamen ein.",
            "footer_made_with": "Vibe-coded mit ❤️ für alle über 30 von"
        }
    },
    es: {
        translation: {
            "app_title": "Pastillero digital",
            "app_subtitle": "Diseña tu horario de medicación y expórtalo directamente a tu calendario.",
            "add_medication": "Añadir medicamento",
            "your_schedule": "Tu horario",
            "export_calendar": "Añadir al calendario",
            "medication_name": "Nombre del medicamento",
            "dosage": "Dosis",
            "optional": "Opcional",
            "time": "Hora",
            "frequency": "Frecuencia",
            "daily": "Diariamente",
            "specific_dates": "Fechas específicas",
            "add_to_schedule": "Añadir al horario",
            "morning": "Mañana",
            "afternoon": "Tarde",
            "evening": "Noche",
            "custom": "Personalizado",
            "select_dates": "Has seleccionado {{count}} día(s).",
            "please_select_date": "Por favor selecciona al menos una fecha.",
            "no_medications": "Aún no hay medicamentos",
            "add_first_medication": "Añade tu primer medicamento para empezar.",
            "delete_label": "Eliminar medicamento",
            "export_alert": "Por favor añade al menos un medicamento para exportar.",
            "error_required_name": "Por favor introduce el nombre del medicamento.",
            "footer_made_with": "Vibe-coded con ❤️ para mayores de 30 por"
        }
    },
    pt: {
        translation: {
            "app_title": "Caixa de comprimidos digital",
            "app_subtitle": "Crie seu horário de medicação e exporte diretamente para seu calendário.",
            "add_medication": "Adicionar medicamento",
            "your_schedule": "Seu horário",
            "export_calendar": "Adicionar ao calendário",
            "medication_name": "Nome do medicamento",
            "dosage": "Dosagem",
            "optional": "Opcional",
            "time": "Hora",
            "frequency": "Frequência",
            "daily": "Diariamente",
            "specific_dates": "Datas específicas",
            "add_to_schedule": "Adicionar ao horário",
            "morning": "Manhã",
            "afternoon": "Tarde",
            "evening": "Noite",
            "custom": "Personalizado",
            "select_dates": "Você selecionou {{count}} dia(s).",
            "please_select_date": "Por favor selecione pelo menos uma data.",
            "no_medications": "Sem medicamentos ainda",
            "add_first_medication": "Adicione seu primeiro medicamento para começar.",
            "delete_label": "Excluir medicamento",
            "export_alert": "Por favor adicione pelo menos um medicamento para exportar.",
            "error_required_name": "Por favor insira o nome do medicamento.",
            "footer_made_with": "Vibe-coded com ❤️ para quem tem mais de 30 por"
        }
    },
    ru: {
        translation: {
            "app_title": "Цифровая таблетница",
            "app_subtitle": "Составьте график приема лекарств и экспортируйте его в календарь.",
            "add_medication": "Добавить лекарство",
            "your_schedule": "Ваш график",
            "export_calendar": "Добавить в календарь",
            "medication_name": "Название лекарства",
            "dosage": "Дозировка",
            "optional": "Опционально",
            "time": "Время",
            "frequency": "Частота",
            "daily": "Ежедневно",
            "specific_dates": "Конкретные даты",
            "add_to_schedule": "Добавить в график",
            "morning": "Утро",
            "afternoon": "День",
            "evening": "Вечер",
            "custom": "Другое",
            "select_dates": "Выбрано дней: {{count}}.",
            "please_select_date": "Пожалуйста, выберите хотя бы одну дату.",
            "no_medications": "Лекарства еще не добавлены",
            "add_first_medication": "Добавьте первое лекарство, чтобы начать.",
            "delete_label": "Удалить лекарство",
            "export_alert": "Пожалуйста, добавьте хотя бы одно лекарство для экспорта.",
            "error_required_name": "Пожалуйста, введите название лекарства.",
            "footer_made_with": "Вайб-кодил с ❤️ для тех, кому за 30 —"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
