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
                incident_id: generateUniqueIncidentId(), // Implement this function
                timestamp: new Date().toISOString(),
                latitude: lat,
                longitude: lng,
                type: "New Incident", // Modify as needed
                severity: "Low", // Modify as needed
                point_of_interest: "None", // Modify as needed
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
    const boundaryLat = 0;
    const boundaryLng = 0;
    return lat >= boundaryLat && lng >= boundaryLng;
}

// Step 3: Implement a function to generate a unique incident_id
function generateUniqueIncidentId() {
    // Implement a logic to generate a unique ID (e.g., based on the current timestamp)
    const timestamp = new Date().toISOString();
    return `INC-${timestamp}`;
}

// Step 4: Implement a function to refresh incident markers on the map
function refreshIncidentMarkers() {
    // Clear existing markers
    // Load and add markers based on the updated data.incident_reports
    // You may need to remove and re-add the marker cluster group
    // to reflect the updated incident data on the map
    // This function depends on how your map and markers are structured.
}

// Step 5: Attach the onClick event handler to the map
map.on("click", handleMapClick);
