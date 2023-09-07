const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
