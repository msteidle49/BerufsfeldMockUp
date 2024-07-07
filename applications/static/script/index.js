// script.js
// import { getPatientNamesFromJSON } from './module.js';

let patientenNamen = [];
let alleTermine = [];
let localDate = new Date();
const jsonFilePath = '/get_json_data';
const jsonFilePathTermine = '/get_termin_data';
let id = 0;

getPatientNamesFromJSON(jsonFilePath)
.then(patientNames => {
    patientenNamen = patientNames;
})
.catch(error => {
    console.error('Fehler beim Laden der Daten:', error);
});

document.addEventListener('DOMContentLoaded', async () => {
    await getTermineFromJSON(jsonFilePathTermine)
    .then(appointments => {
        alleTermine = appointments;
    })
    .catch(error => {
        console.error('Fehler beim Laden der Daten:', error);
    });
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

    const terminbtn = document.getElementById('termin-btn');

    const vorsorge_checkbox = document.getElementById('Vorsorge');
    const blutabnahme_checkbox = document.getElementById('Blutabnahme');
    const impfung_checkbox = document.getElementById('Impfung');
    const besprechung_checkbox = document.getElementById('Besprechung');
    const notfall_checkbox = document.getElementById('Notfall');

    terminbtn.addEventListener('click', () => {
        window.location.href = '/termin';
    });

    // Event-Listener für den Button zum Ändern des Kalendertyp
    btn_day.addEventListener('click', () => {
        calendar_week.style.display = 'none';
        calendar_day.style.display = 'grid';
        btn_day.classList.add('active')
        btn_week.classList.remove('active')
    });
    
    btn_week.addEventListener('click', () => {
        calendar_week.style.display = 'grid';
        calendar_day.style.display = 'none';
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
        const filteredResults = patientenNamen.filter(item => item.toLowerCase().includes(query)).sort();

        displayResults(filteredResults.slice(0, 20), query);
    });

    function displayResults(results, query) {
        searchResults.innerHTML = '';

        if (results.length > 0 && query.length > 0) {
            searchResults.classList.add('active');
            results.forEach(result => {
                const resultDiv = document.createElement('span');
                resultDiv.textContent = result;
                resultDiv.addEventListener('click', () => {
                    searchInput.value = result
                    searchResults.classList.remove('active');
                });
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
        let weekdayElements = document.querySelectorAll('.weekday');
        let app = document.querySelectorAll('.appointment');

        app.forEach((el, index) => {
            if(calendar_day.contains(el)){
                calendar_day.removeChild(el);
            }
            if(calendar_week.contains(el)){
                calendar_week.removeChild(el);
            }
        });

        weekdayElements.forEach((el, index) => {
            if(!el.classList.contains('empty') )
            {
                const day = new Date(startOfWeek);
                day.setDate(startOfWeek.getDate() + index-1);
                el.textContent = formatDate(day);
                const todaysAppointments = checkTodayAppointments(alleTermine, day);
                console.log("In update: ");
                for (let i = 0; i < todaysAppointments.length; i++) {
                    const element = createAppointment(todaysAppointments[i][0], todaysAppointments[i][1], index+1, todaysAppointments[i][2])
                    if(element) {
                        calendar_week.appendChild(element);
                    }
                }
            }
        });
        weekdayElements = document.querySelectorAll('.weekday-day');
        
        weekdayElements.forEach((el, index) => {
            if(!el.classList.contains('empty') )
            {
                el.textContent = formatDate(date);
                const todaysAppointments = checkTodayAppointments(alleTermine, date);
                console.log("In update: ");
                for (let i = 0; i < todaysAppointments.length; i++) {
                    const element = createAppointment(todaysAppointments[i][0], todaysAppointments[i][1], 2, todaysAppointments[i][2])
                    if(element) {
                        calendar_day.appendChild(element);
                    }
                }
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

    // Methode zur Überprüfung, ob heute Termine stattfinden und die Zeiten zurückgeben
    function checkTodayAppointments(appointments, date) {
        const today = date.toISOString().split('T')[0];
        const todaysAppointments = appointments.filter(appointment => appointment.date === today);
        
        if (todaysAppointments.length === 0) {
        return [];
        }
        
        return todaysAppointments.map(appointment => {
        const { type, start, end, patient } = appointment;
        const [start2, duration] = calculateDuration(start, end);
        console.log("In Check: Start: " + start2 + " Duration: " + duration);
        return [start2, duration, type];
        // return `Typ: ${type}, Patient: ${patient}, Start: ${start}, Ende: ${end}, Dauer: ${duration}`;
        });
    }
  
    // Hilfsfunktion zur Berechnung der Dauer eines Termins
    function calculateDuration(start, end) {
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        
        const firstTime = 420;
        const timeMinutes = (startHour*60) + startMinute;
        let startRow = (timeMinutes-firstTime) / 5 + 2;
        const startDate = new Date(0, 0, 0, startHour, startMinute);
        const endDate = new Date(0, 0, 0, endHour, endMinute);
        
        let diff = endDate - startDate;
        const minutes = Math.floor(diff / 1000 / 60);
        console.log("In calc: start: " + startRow + " Duration: " + minutes/5);
        return [startRow, minutes/5];
    }

    // Funktion zum Erstellen eines Appointment-Elements
    function createAppointment(rowStart, rowSpan, col, type) {
        switch (type) {
            case 'besprechung':
                if (!besprechung_checkbox.checked) {
                    return null;
                }
                break;
            case 'vorsorge':
                if (!vorsorge_checkbox.checked) {
                    return null;
                }
                break;
            case 'impfung':
                if (!impfung_checkbox.checked) {
                    return null;
                }
                break;
            case 'notfall':
                if (!notfall_checkbox.checked) {
                    return null;
                }
                break;
            case 'blutabnahme':
                if (!blutabnahme_checkbox.checked) {
                    return null;
                }
                break;
        }

        // Neues Div-Element erstellen
        const appointment = document.createElement('div');
        // Klasse hinzufügen
        appointment.classList.add('appointment');
        appointment.classList.add(type);

        // CSS-Stile setzen
        if(rowSpan > 1){
            appointment.style.gridRow = `${rowStart} / span ${rowSpan}`;
        } else {
            appointment.style.gridRow = rowStart;
        }
        appointment.style.gridColumn = col;

        return appointment;
    }

    vorsorge_checkbox.addEventListener('change', function () {
        updateCalendar(currentDate);
    });
    notfall_checkbox.addEventListener('change', function () {
        updateCalendar(currentDate);
    });
    besprechung_checkbox.addEventListener('change', function () {
        updateCalendar(currentDate);
    });
    impfung_checkbox.addEventListener('change', function () {
        updateCalendar(currentDate);
    });
    blutabnahme_checkbox.addEventListener('change', function () {
        updateCalendar(currentDate);
    });


    // Initiales Rendern des Kalenders
    renderCalendar(currentDate);
});

async function getPatientNamesFromJSON(jsonFilePath) {
    try {
      const response = await fetch(jsonFilePath);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const patientNames = data.map(patient => `${patient.Nachname}, ${patient.Vorname}`);
      return patientNames;
    } catch (error) {
      throw new Error('Fehler beim Laden der Daten:', error);
    }
  }

  async function getTermineFromJSON(jsonFilePath) {
    try {
      const response = await fetch(jsonFilePath);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      return data;
    } catch (error) {
      throw new Error('Fehler beim Laden der Daten:', error);
    }
  }