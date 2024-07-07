let patientenNamen = [];
const jsonFilePath = '/get_json_data';

getPatientNamesFromJSON(jsonFilePath)
.then(patientNames => {
    patientenNamen = patientNames;
})
.catch(error => {
    console.error('Fehler beim Laden der Daten:', error);
});

document.addEventListener('DOMContentLoaded', () => {
    const searchDateBtn = document.getElementById('search-date');
    const cancelBtn = document.getElementById('cancel');

    const searchInput = document.getElementById('search');
    const searchResults = document.getElementById('search-results');

    const dropdown = document.getElementById('termine-dropdown');
    const duration = document.getElementById('duration');

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
        window.location.href = '/termin/wahl';
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = '/main';
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