const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post('/delete-incident', (req, res) => {
  const incidentId = req.body.incident_id;
  const filePath = path.join(__dirname, 'data', 'incident_reports.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read file' });
    }

    const incidents = JSON.parse(data);
    const updatedIncidents = incidents.filter(incident => incident.incident_id !== incidentId);

    fs.writeFile(filePath, JSON.stringify(updatedIncidents, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write file' });
      }

      res.status(200).json({ message: 'Incident deleted' });
    });
  });
});

app.post('/save-incident', (req, res) => {
  console.log('Handling POST request for /save-incident'); // Debugging statement

  const incidentData = req.body;
  const filePath = path.join(__dirname, 'data', 'incident_reports.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read file' });
    }

    const incidents = JSON.parse(data);
    incidents.push(incidentData);

    fs.writeFile(filePath, JSON.stringify(incidents, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write file' });
      }

      res.status(200).json({ message: 'Incident data saved' });
    });
  });
});

app.post('/edit-incident', (req, res) => {
  const updatedIncident = req.body;
  const filePath = path.join(__dirname, 'data', 'incident_reports.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read file' });
    }

    const incidents = JSON.parse(data);

    // Find the index of the incident to update based on incident_id
    const indexToUpdate = incidents.findIndex(incident => incident.incident_id === updatedIncident.incident_id);

    if (indexToUpdate === -1) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Update the incident data
    incidents[indexToUpdate] = updatedIncident;

    fs.writeFile(filePath, JSON.stringify(incidents, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write file' });
      }

      res.status(200).json({ message: 'Incident updated successfully' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
