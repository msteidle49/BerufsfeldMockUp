// script.js
let localDate = new Date();

document.addEventListener('DOMContentLoaded', () => {
    // Elemente des Kalenders holen
    const filter = document.getElementById('filter');
    const status = document.getElementById('status');
    const calendarHeader = document.getElementById('month-year');
    const calendarHeader2 = document.getElementById('month-year2');
    const calendarDays = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    const btn_day = document.getElementById('days-btn');
    const btn_week = document.getElementById('weeks-btn');
    const calendar_week = document.getElementById('calendar-week');
    const calendar_day = document.getElementById('calendar-day');

    const openModalButtonStatus = document.getElementById('open-modal-status');
    const openModalButtonfilter = document.getElementById('open-modal-filter');

    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('clients');

    const data = [
        // Beispiel-Daten. Ersetzen Sie diese durch Ihre echten Daten.
        'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
        'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon',
        'Phi', 'Chi', 'Psi', 'Omega'
    ];

    // Event-Listener für den Button zum Ändern des Kalendertyp
    btn_day.addEventListener('click', () => {
        calendar_week.classList.remove('active')
        calendar_day.classList.add('active')
        btn_day.classList.add('active')
        btn_week.classList.remove('active')
    });
    
    btn_week.addEventListener('click', () => {
        calendar_week.classList.add('active')
        calendar_day.classList.remove('active')
        btn_day.classList.remove('active')
        btn_week.classList.add('active')
    });

    // Event-Listener für den Button zum Öffnen des Modals
    openModalButtonStatus.addEventListener('click', () => {
        status.classList.toggle('active')
        filter.classList.toggle('active')
    });

    openModalButtonfilter.addEventListener('click', () => {
        status.classList.toggle('active')
        filter.classList.toggle('active')
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredResults = data.filter(item => item.toLowerCase().includes(query)).sort();

        displayResults(filteredResults.slice(0, 20), query);
    });

    function displayResults(results, query) {
        searchResults.innerHTML = '';

        if (results.length > 0 && query.length > 0) {
            searchResults.classList.add('active');
            results.forEach(result => {
                const resultDiv = document.createElement('div');
                resultDiv.textContent = result;
                searchResults.appendChild(resultDiv);
            });
        } else {
            searchResults.classList.remove('active');
        }
    }

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
        console.log(firstDayOfMonth);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Anzahl der Tage des vorherigen Monats
        const prevMonthDays = new Date(year, month, 0).getDate();

        // Tage des vorherigen Monats hinzufügen
        for (let i = (firstDayOfMonth-1 < 0 ? 6 : firstDayOfMonth-1); i > 0; i--) {
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
            if (year === localDate.getFullYear() && month === localDate.getMonth()) {
                if (i === localDate.getDate()) {
                    daySpan.classList.add('selected');
                    selectedDate = daySpan;
                    currentDate.setDate(selectedDate.textContent)
                    updateCalendar(currentDate);
                }
            }
            else if (i === 1) {
                daySpan.classList.add('selected');
                selectedDate = daySpan;
                currentDate.setDate(selectedDate.textContent)
                updateCalendar(currentDate);
            }

            daySpan.addEventListener('click', () => {
                if (selectedDate) {
                    selectedDate.classList.remove('selected');
                }
                selectedDate = daySpan;
                selectedDate.classList.add('selected');
                currentDate.setDate(selectedDate.textContent)
                updateCalendar(currentDate);
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

    document.getElementById('logout-button').addEventListener('click', () => {
        window.location.href = '/';
    });

    // Funktion zur Aktualisierung des Kalenders basierend auf dem ausgewählten Datum
    function updateCalendar(date) {
        const startOfWeek = getStartOfWeek(date);
        const weekdayElements = document.querySelectorAll('.weekdays > div:not(.empty)');
        
        weekdayElements.forEach((el, index) => {
            if (index === 5){
                el.textContent = formatDate(date);
            } else {
                const day = new Date(startOfWeek);
                day.setDate(startOfWeek.getDate() + index);
                el.textContent = formatDate(day);
            }
        });
        

        // Hier können Sie weitere Logik hinzufügen, um Termine dynamisch basierend auf dem neuen Datum zu laden
    }

    // Hilfsfunktion zur Berechnung des Anfangs der Woche für ein gegebenes Datum
    function getStartOfWeek(date) {
        const dayOfWeek = date.getDay();
        const startOfWeek = new Date(date);
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust if day is Sunday
        startOfWeek.setDate(diff);
        return startOfWeek;
    }

    // Hilfsfunktion zur Formatierung eines Datums als "Tag, dd. MMM"
    function formatDate(date) {
        const options = { weekday: 'short', day: '2-digit', month: 'short' };
        return date.toLocaleDateString('de-DE', options);
    }

    // Initiales Rendern des Kalenders
    renderCalendar(currentDate);
});