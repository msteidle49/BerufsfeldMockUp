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

    const searchDateBtn = document.getElementById('search-date');
    const cancelBtn = document.getElementById('cancel');

    const searchPatient = document.getElementById('search');
    const searchResults2 = document.getElementById('search-results');

    const dropdown = document.getElementById('termine-dropdown');
    const duration = document.getElementById('duration');

    const search_window = document.getElementById('search-window');
    const overlay = document.getElementById('overlay');

    const termin_time = document.getElementById('termin-time');

    duration.value = 15;

    dropdown.addEventListener('change', () => {
        const selectedDate = dropdown.value;
        switch (selectedDate) {
            case 'Blutabnahme':
                duration.value = 10;
                break;
            case 'Vorsorge':
                duration.value = 45;
                break;
            case 'Notfall':
                duration.value = 15;
                break;
            case 'Impfung':
                duration.value = 10;
                break;
            case 'Besprechung':
                duration.value = 15;
                break;

        }
    });

    searchDateBtn.addEventListener('click', () => {
        createNewAppointment(dropdown.value, 2, termin_time.value, parseInt(duration.value) )
        overlay.style.display = 'none';
        search_window.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        search_window.style.display = 'none';
    });

    searchPatient.addEventListener('input', () => {
        const query = searchPatient.value.toLowerCase();
        const filteredResults = patientenNamen.filter(item => item.toLowerCase().includes(query)).sort();

        displayResults(filteredResults.slice(0, 20), query, searchResults2);
    });

    for (let i = 2; i < 7; i++) {
        for (let j = 4; j < 139; j++) {
            const cell = document.createElement('div');
            cell.classList.add('default-slot');
            cell.style.gridRow = j;
            cell.style.gridColumn = i;

            cell.addEventListener('click', () => {
                overlay.style.display = 'block';
                search_window.style.display = 'flex';
                dropdown.value = 'Besprechung'
                duration.value = 15;
                console.log(setDate(j-4, i-2));
                termin_time.value = setDate(j-4, i-2);
                searchPatient.value = '';
            });

            calendar_week.appendChild(cell);
        }
    }

    for (let i = 2; i < 7; i++) {
        for (let j = 2; j < 136; j++) {
            const cell = document.createElement('div');
            cell.classList.add('default-slot');
            cell.style.gridRow = j;
            cell.style.gridColumn = i;
            calendar_day.appendChild(cell);
        }
    }

    terminbtn.addEventListener('click', () => {
        overlay.style.display = 'block';
        search_window.style.display = 'flex';
        termin_time.value = '';
        dropdown.value = 'Besprechung'
        duration.value = 15;
        searchPatient.value = '';
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
    openModalButtonfilter.addEventListener('click', () => {
        filter.classList.toggle('active')

        var dropdownIcon = document.getElementById("dropdownIcon");
        
        // Change the icon based on dropdown state
        if (filter.classList.contains("active")) {
            dropdownIcon.classList.remove("fa-chevron-down");
            dropdownIcon.classList.add("fa-chevron-up");
        } else {
            dropdownIcon.classList.remove("fa-chevron-up");
            dropdownIcon.classList.add("fa-chevron-down");
        }
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredResults = patientenNamen.filter(item => item.toLowerCase().includes(query)).sort();

        displayResults(filteredResults.slice(0, 20), query, searchResults, true);
    });

    function displayResults(results, query, elem, openWindow) {
        elem.innerHTML = '';

        if (results.length > 0 && query.length > 0) {
            elem.classList.add('active');
            results.forEach(result => {
                const resultDiv = document.createElement('span');
                resultDiv.textContent = result;
                if (!openWindow){
                    resultDiv.addEventListener('click', () => {
                        searchPatient.value = result
                        elem.classList.remove('active');
                    });
                }
                else {
                    resultDiv.addEventListener('click', () => {
                        window.location.href = '/patient';
                    });
                }
                elem.appendChild(resultDiv);
            });
        } else {
            elem.classList.remove('active');
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
                for (let i = 0; i < todaysAppointments.length; i++) {
                    const element = createAppointment(todaysAppointments[i][0]+2, todaysAppointments[i][1], index+1, todaysAppointments[i][2])
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

        // Erstelle die Infobox
        var infoBox = document.createElement('div');
        infoBox.className = 'info-box';
        infoBox.innerHTML = `<h3>Besprechung</h3>
                             <p>Patient: Steidle, Max</p>
                             <p>Start: 9:00</p>
                             <p>Dauer: 15 Minuten</p>
                             <p>Notiz: Keine Notiz</p>
                             <button class="edit-btn"><i class="fas fa-edit"></i></button>`;

        appointment.appendChild(infoBox);

        // Alle Edit-Buttons auswählen und Event-Listener hinzufügen
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', editAppointment);
        });

        var hoverTimeout;

        appointment.addEventListener('mouseenter', function() {
            hoverTimeout = setTimeout(function() {
                infoBox.style.display = 'block';
            }, 1000); // Verzögerung in Millisekunden (hier 500ms)
        });

        appointment.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimeout);
            infoBox.style.display = 'none';
        });

        return appointment;
    }

    function editAppointment() {
        overlay.style.display = 'block';
        search_window.style.display = 'flex';
        searchPatient.value = "Mustermann, Max"
        termin_time.value = '';
        dropdown.value = 'Besprechung'
        duration.value = 15;
    }

    function setDate(row, col){
        let newDate = getStartOfWeek(currentDate);
        let startMin = 7*60;
        let currentTime = startMin + (row * 5);
        let hour = Math.floor(currentTime / 60);
        let minutes = currentTime % 60;
        newDate.setDate(newDate.getDate() + col);
        newDate.setHours(hour);
        hour = (hour < 10 ? '0' + hour : hour)
        minutes = (minutes < 10? '0' + minutes : minutes);
        let month = (newDate.getMonth()+1 < 10 ? '0' + (newDate.getMonth()+1) : newDate.getMonth()+1)
        let day = (newDate.getDate() < 10? '0' + newDate.getDate() : newDate.getDate())
        // console.log(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
        return `${newDate.getFullYear()}-${month}-${day}T${hour}:${minutes}`;
    }

    function createNewAppointment(type, partient, dateTime, duration) {
        console.log(duration)
        let arr = dateTime.split('T');
        console.log(arr[1], dateTime);
        const [hour, minutes] = arr[1].split(':').map(Number);
        console.log(hour, minutes);
        let newMinutes = duration + minutes;
        
        let newHour = hour + (Math.floor(newMinutes / 60));
        newMinutes = newMinutes % 60;
        newHour = (newHour < 10 ? '0' + newHour : newHour)
        newMinutes = (newMinutes < 10 ? '0' + newMinutes : newMinutes)
        const end = `${newHour}:${newMinutes}`;
        let app = {
            "type": type.toLowerCase(),
            "partient": partient,
            "date": arr[0],
            "start": arr[1],
            "end": end
        };
        alleTermine.push(app);
        updateCalendar(currentDate);
        console.log(alleTermine);
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