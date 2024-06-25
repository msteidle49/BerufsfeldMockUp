// script.js
let localDate = new Date();

document.addEventListener('DOMContentLoaded', () => {
    // Elemente des Kalenders holen
    const filter = document.getElementById('filter');
    const status = document.getElementById('status');
    const calendarHeader = document.getElementById('month-year');
    const calendarDays = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    const openModalButtonStatus = document.getElementById('open-modal-status');
    const openModalButtonfilter = document.getElementById('open-modal-filter');

    // Event-Listener für den Button zum Öffnen des Modals
    openModalButtonStatus.addEventListener('click', () => {
        status.classList.toggle('active')
        filter.classList.toggle('active')
    });

    openModalButtonfilter.addEventListener('click', () => {
        status.classList.toggle('active')
        filter.classList.toggle('active')
    });

    // Variablen für das aktuelle Datum und das ausgewählte Datum
    let currentDate = new Date();
    let selectedDate = null;

    // Funktion zum Rendern des Kalenders
    const renderCalendar = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        let days = 0;

        // Monat und Jahr in der Kopfzeile anzeigen
        calendarHeader.textContent = `${date.toLocaleString('de-DE', { month: 'long' })} ${year}`;

        // Kalender-Tage zurücksetzen
        calendarDays.innerHTML = '';

        // Erster Tag des Monats und Anzahl der Tage im Monat
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Anzahl der Tage des vorherigen Monats
        const prevMonthDays = new Date(year, month, 0).getDate();
        // Anzahl der Tage des nächsten Monats, die angezeigt werden sollen
        const nextMonthDaysStart = 42 - (firstDayOfMonth + daysInMonth);

        // Tage des vorherigen Monats hinzufügen
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const daySpan = document.createElement('span');
            daySpan.textContent = prevMonthDays - i;
            daySpan.classList.add('prev-month');
            calendarDays.appendChild(daySpan);
            days++;
        }

        // Tage des aktuellen Monats hinzufügen
        for (let i = 1; i <= daysInMonth; i++) {
            const daySpan = document.createElement('span');
            daySpan.textContent = i;

            // Überprüfen, ob das aktuelle Datum markiert werden soll
            if (year === localDate.getFullYear() && month === localDate.getMonth() && i === localDate.getDate()) {
                daySpan.classList.add('selected');
                selectedDate = daySpan;
            }

            daySpan.addEventListener('click', () => {
                if (selectedDate) {
                    selectedDate.classList.remove('selected');
                }
                selectedDate = daySpan;
                selectedDate.classList.add('selected');
            });
            calendarDays.appendChild(daySpan);
            days++;
        }

        // Tage des nächsten Monats hinzufügen
        for (let i = 1; !(days % 7 == 0); i++) {
            const daySpan = document.createElement('span');
            daySpan.textContent = i;
            daySpan.classList.add('next-month');
            calendarDays.appendChild(daySpan);
            days++;
        }
    };

    // Event-Listener für den Button zum vorherigen Monat
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    // Event-Listener für den Button zum nächsten Monat
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    // Initiales Rendern des Kalenders
    renderCalendar(currentDate);
});