// module.js
const fs = require('fs');

export function getPatientNamesFromJSON(jsonFilePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      
      try {
        const jsonData = JSON.parse(data);
        const patientNames = jsonData.map(patient => `${patient.Nachname} ${patient.Vorname}`);
        resolve(patientNames);
      } catch (error) {
        reject(error);
      }
    });
  });
}
  