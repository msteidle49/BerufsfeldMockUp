
console.log("Test")
document.addEventListener('DOMContentLoaded', () => {
    const back = document.getElementById('back');
    const search_window = document.getElementById('search-window');
    const overlay = document.getElementById('overlay');
    const termin_time = document.getElementById('termin-time');
    const dropdown = document.getElementById('termine-dropdown');
    const duration = document.getElementById('duration');

    const searchDateBtn = document.getElementById('search-date');
    const cancelBtn = document.getElementById('cancel');

    const search = document.getElementById('search');

    console.log("Test2")
    console.log(back);
    back.addEventListener('click', () => {
        console.log("Test3")
        window.location.href = '/main';
    });

    // Funktion, die bei Klick auf den Edit-Button ausgeführt wird
    

    // Alle Edit-Buttons auswählen und Event-Listener hinzufügen
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', editAppointment);
    });

    // Funktion, die bei Klick auf den Delete-Button ausgeführt wird
    function deleteAppointment(event) {
        const appointment = event.target.closest('.appointment');
        appointment.remove();
    }

    // Alle Delete-Buttons auswählen und Event-Listener hinzufügen
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', deleteAppointment);
    });

    cancelBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        search_window.style.display = 'none';
    });

    searchDateBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        search_window.style.display = 'none';
    });

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

    function parseAppointment(appointmentString) {
        const regex = /^(\d{2}\. \w+ \d{4} \d{2}:\d{2}) - (.*?) - (\d+ min)(?: - (.*?))?$/;
        const match = appointmentString.match(regex);
  
        if (match) {
          const dateTime = match[1];
          const type = match[2];
          const duration = match[3];
          const notes = match[4] || "";
  
          return {
            dateTime,
            type,
            duration: parseInt(duration.replace(' min', '')),
            notes
          };
        } else {
          console.error('String format is incorrect:', appointmentString);
          return null;
        }
      }
  
      function formatDateTimeForInput(dateTime) {
        const months = {
          'Januar': '01',
          'Februar': '02',
          'März': '03',
          'April': '04',
          'Mai': '05',
          'Juni': '06',
          'Juli': '07',
          'August': '08',
          'September': '09',
          'Oktober': '10',
          'November': '11',
          'Dezember': '12'
        };
  
        const [day, month, year, time] = dateTime.split(/\. | /);
        const formattedMonth = months[month];
        const formattedDateTime = `${year}-${formattedMonth}-${day.padStart(2, '0')}T${time}:00`;
        
        return formattedDateTime;
      }
  
      function fillForm(appointmentString) {
        const parsed = parseAppointment(appointmentString);
  
        if (parsed) {
          termin_time.value = formatDateTimeForInput(parsed.dateTime);
          dropdown.value = parsed.type;
          duration.value = parsed.duration;
          document.getElementById('notiz').value = parsed.notes;
        }
      }

      function editAppointment(event) {
        overlay.style.display = 'block';
        search_window.style.display = 'flex';
        search.value = "Mustermann, Max"

        const appointment = event.target.closest('.appointment');
        const appointmentText = appointment.querySelector('span').textContent;
        fillForm(appointmentText);
    }
});