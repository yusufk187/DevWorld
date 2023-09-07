// Step 1: Create a function to handle the onClick event
function handleMapClick(event) {
    const { lat, lng } = event.latlng;

    // Check if the click is within the map bounds
    if (isWithinBounds(lat, lng)) {
        // Open a modal dialog to input additional information
        const userInput = prompt("Enter additional information:");

        if (userInput) {
            // Process and validate userInput, generate a unique incident_id, etc.
            const newIncident = {
                incident_id: generateUniqueIncidentId(),
                timestamp: new Date().toISOString(),
                latitude: lat,
                longitude: lng,
                type: "New Incident",
                severity: "Low",
                point_of_interest: "None",
                additional_info: userInput,
            };

            // Add the new incident to the JSON data
            data.incident_reports.push(newIncident); // Modify data structure as needed

            // Refresh map markers
            refreshIncidentMarkers();
        }
    }
}

// Step 2: Check if the click is within the map bounds
function isWithinBounds(lat, lng) {
    // Add your custom bounds checking logic here
    const boundaryLat = 0; // Adjust as needed
    const boundaryLng = 0; // Adjust as needed
    return lat >= boundaryLat && lng >= boundaryLng;
}

// Step 3: Implement a function to generate a unique incident_id
function generateUniqueIncidentId() {
    // Implement a logic to generate a unique ID (e.g., based on the current timestamp and a random number)
    const timestamp = new Date().toISOString();
    const uniqueId = `${timestamp}-${Math.floor(Math.random() * 1000)}`;
    return `INC-${uniqueId}`;
}

// Step 4: Implement a function to refresh incident markers on the map
function refreshIncidentMarkers() {
    // Clear existing markers
    incidentsCluster.clearLayers();

    // Load and add markers based on the updated data.incident_reports
    data.incident_reports.forEach(incident => {
        const { latitude: lat, longitude: lng } = incident;
        const customIcon = createCustomIcon(incident);

        const marker = L.marker([lat, lng], { icon: customIcon });
        marker.incident_id = incident.incident_id;
        marker.incidentSeverity = incident.severity;
        marker.bindPopup(/* ... */);

        incidentMarkers.push(marker);
    });

    // Add the updated markers to the cluster group
    incidentsCluster.addLayers(incidentMarkers);
}

// Step 5: Attach the onClick event handler to the map
map.on("click", handleMapClick);
