// Create a Leaflet map with CRS.Simple
const map = L.map("map", {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 1,
}).setView([1024, 1024], -1);

// Define bounds for the image overlay
const bounds = [
    [0, 0],
    [2048, 2048],
];

// Add the image overlay
const image = L.imageOverlay("./images/map.gif", bounds).addTo(map);

// Set max bounds to limit panning
map.setMaxBounds(bounds);

function getPOIMarkerOptions(poi) {
    let shape;
    switch (poi.type) {
        case "facility":
            shape = "facility";
            break;
        case "town":
            shape = "town";
            break;
        case "region":
            shape = "region";
            break;
        case "landmark":
            shape = "landmark";
            break;
        case "charge":
            shape = "charge";
            break;
        case "construction":
            shape = "construction";
            break;
        case "industrial":
            shape = "industrial";
            break;
        case "info":
            shape = "info";
            break;
        case "target":
            shape = "target";
            break;
        case "warning":
            shape = "warning";
            break;
        default:
            shape = "circle";
    }

    let color;
    switch (poi.narrative_level) {
        case "peaceful":
            color = "cyan";
            break;
        case "violent":
            color = "orange";
            break;
        case "neutral":
            color = "white";
            break;
        default:
            color = "gray";
    }

    return { color, shape };
}

function createCustomIcon(poi) {
    let iconUrl;

    switch (poi.type) {
        case "facility":
        case "town":
        case "region":
        case "landmark":
        case "charge":
        case "construction":
        case "industrial":
        case "info":
        case "target":
        case "warning":
            iconUrl = `images/symbols/${poi.type}.png`;
            break;
        default:
            iconUrl = `images/symbols/info.png`;
            break;
    }

    // Create an image element
    const img = new Image();
    img.src = iconUrl;
    img.width = 26;
    img.height = 26;

    // Apply the hue-rotate filter based on the narrative level
    switch (poi.narrative_level) {
        case "peaceful":
            // Teal filter for peaceful
            img.style.filter = "sepia(100%) saturate(10000%) hue-rotate(120deg)";
            break;
        case "violent":
            // Orange filter for violent
            img.style.filter = "sepia(100%) saturate(10000%) hue-rotate(333deg)";
            break;
        case "neutral":
            // No rotation for neutral (0 degrees)
            break;
        default:
            // grey filter for unknown narrative level
            img.style.filter = "greyscale(100%)";
    }

    // Create a custom Leaflet icon with the modified image
    const customIcon = L.divIcon({ className: 'custom-icon', html: img });

    return customIcon;
}

function loadPOIs() {
    fetch("data/points_of_interest.json")
        .then((response) => response.json())
        .then((data) => {
            data.forEach((poi) => {
                let lat = poi.latitude;
                let lng = poi.longitude;
                let { color, shape } = getPOIMarkerOptions(poi);
                let customIcon = createCustomIcon(poi);
                let marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

                marker.bindPopup(
                    `<b>Title:</b> ${poi.title}<br>
            <b>Type:</b> ${poi.type}<br>
            <b>Narrative Level:</b> ${poi.narrative_level}<br>
            ${poi.description}`,
                    {
                        autoPan: true,
                    }
                );
            });
        })
        .catch((error) =>
            console.error("Error loading points_of_interest.json:", error)
        );
}

function createIncidentIcon(incident, color) {
    // Define the icon URL for the incident
    const iconUrl = "images/symbols/warning.png"; // Replace with your custom image URL

    // Create an image element
    const img = new Image();
    img.src = iconUrl;
    img.width = 26;
    img.height = 26;

    // Apply color and custom filter to the icon based on severity
    switch (incident.severity) {
        case "Critical":
            img.style.filter = `sepia(100%) saturate(10000%) hue-rotate(540deg) opacity(1) drop-shadow(0px 0px 3px ${color})`;
            break;
        case "High":
            img.style.filter = `sepia(100%) saturate(10000%) hue-rotate(330deg) opacity(1) drop-shadow(0px 0px 3px ${color})`;
            break;
        case "Medium":
            img.style.filter = `sepia(100%) saturate(10000%) hue-rotate(20deg) sepia(100%) opacity(1) drop-shadow(0px 0px 3px ${color})`;
            break;
        case "Low":
            img.style.filter = `sepia(100%) saturate(10000%) hue-rotate(120deg) opacity(1) drop-shadow(0px 0px 3px ${color})`;
            break;
        default:
            img.style.filter = `brightness(100%) hue-rotate(0deg) saturate(100%) sepia(100%) opacity(1) drop-shadow(0px 0px 3px ${color})`;
    }

    // Create a custom Leaflet icon with the modified image
    const customIcon = L.divIcon({ className: 'custom-icon', html: img });

    return customIcon;
}

function loadIncidents() {
    fetch("data/incident_reports.json")
        .then((response) => response.json())
        .then((data) => {
            const incidentMarkers = [];
            const clusterColors = {
                Critical: "rgba(170, 0, 0, 0.5)",
                High: "rgba(255, 165, 0, 0.5)",
                Medium: "rgba(253, 218, 13, 0.5)",
                Low: "rgba(24, 255, 255, 0.5)",
                default: "rgba(0, 0, 255, 0.5)",
            };

            // Define cluster options here
            const clusterOptions = {
                iconCreateFunction: function (cluster) {
                    const clusterMarkers = cluster.getAllChildMarkers();
                    let clusterColor = clusterColors.default;

                    for (const marker of clusterMarkers) {
                        const severity = marker.incidentSeverity;
                        const color = clusterColors[severity] || clusterColors.default;

                        // If a marker with a higher severity is found in the cluster, use its color
                        if (clusterColors[severity] && clusterColors[severity] !== "blue") {
                            clusterColor = clusterColors[severity];
                            break;
                        }
                    }

                    return L.divIcon({
                        html: `<div class="custom-cluster-icon" style="background-color: ${clusterColor}">${cluster.getChildCount()}</div>`,
                        className: "custom-cluster",
                        iconSize: [40, 40], // Set the icon size as needed
                    });
                },
            };

            data.forEach((incident) => {
                let lat = incident.latitude;
                let lng = incident.longitude;

                // Define the boundary (latitude and longitude below which incidents are skipped)
                const boundaryLat = 120;
                const boundaryLng = 120;

                // Skip incidents outside of the boundary
                if (lat < boundaryLat || lng < boundaryLng) {
                    return;
                }

                let severity = incident.severity;

                let customIcon = createIncidentIcon(incident, clusterColors[severity]);

                let marker = L.marker([lat, lng], { icon: customIcon });
                marker.incident_id = incident.incident_id; // Store incident_id as a property of the marker
                marker.incidentSeverity = severity; // Store incident severity as a property of the marker
                marker.bindPopup(
                    `<b>Incident ID:</b> ${incident.incident_id}<br>
                    <b>Timestamp:</b> ${incident.timestamp}<br>
                    <b>Type:</b> ${incident.type}<br>
                    <b>Severity:</b> ${severity}<br>
                    <b>Point of Interest:</b> ${incident.point_of_interest}`,
                    {
                        autoPan: true,
                    }
                );

                incidentMarkers.push(marker);
            });

            // Create a cluster group with custom cluster options
            const incidentsCluster = L.markerClusterGroup(clusterOptions);
            incidentsCluster.addLayers(incidentMarkers);

            // Add the cluster group to the map
            map.addLayer(incidentsCluster);

            // Handle cluster click event to display the modal
            incidentsCluster.on("clusterclick", function (event) {
                displayClusterModal(event.layer.getAllChildMarkers());
            });
        })
        .catch((error) =>
            console.error("Error loading incident_reports.json:", error)
        );
}



// Create a Leaflet control for the coordinate display
const coordControl = L.control({ position: "topright" });

coordControl.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "coordinate-display");
    this._div.innerHTML = "Hover over the map";
    // Make font white
    this._div.style.color = "white";
    return this._div;
};

// Update the coordinate display when the mouse moves
map.on("mousemove", function (event) {
    var lat = event.latlng.lat;
    var lng = event.latlng.lng;
    coordControl._div.innerHTML = `Lat: ${lat.toFixed(
        2
    )}, Lng: ${lng.toFixed(2)}`;
});

// Add the control to the map
coordControl.addTo(map);

function showBorder() {
    fetch("objects/island.json")
        .then((response) => response.json())
        .then((data) => {
            // Add the scaled and flipped coordinates as a polyline to the map
            L.polyline(data.features[0].geometry.coordinates[0], {
                color: "red",
                weight: 2,
            }).addTo(map);
        })
        .catch((error) => console.error("Error loading island.json:", error));
}

// Uncomment the line below if you want to show the border
// showBorder();

// Call the POI and incident functions
loadIncidents();
loadPOIs();
