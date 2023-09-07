const map = L.map("map", {
    crs: L.CRS.Simple,
    minZoom: -1.5,
    maxZoom: 4,
}).setView([1024, 1024], -1);

const bounds = [
    [0, 0],
    [2048, 2048],
];

L.imageOverlay("./images/map.gif", bounds).addTo(map);
map.setMaxBounds(bounds);

function getPOIMarkerOptions(poi) {
    const shapeMapping = {
        facility: "facility",
        town: "town",
        region: "region",
        landmark: "landmark",
        charge: "charge",
        construction: "construction",
        industrial: "industrial",
        info: "info",
        target: "target",
        warning: "warning",
    };

    const colorMapping = {
        peaceful: "cyan",
        violent: "orange",
        neutral: "white",
    };

    const shape = shapeMapping[poi.type] || "circle";
    const color = colorMapping[poi.narrative_level] || "gray";

    return { color, shape };
}

function createCustomPOIIcon(poi) {
    const iconTypes = [
        "facility", "town", "region", "landmark", "charge",
        "construction", "industrial", "info", "target", "warning"
    ];

    const iconUrl = iconTypes.includes(poi.type)
        ? `images/symbols/${poi.type}.png`
        : `images/symbols/info.png`;

    const img = new Image();
    img.src = iconUrl;
    img.width = 26;
    img.height = 26;

    const filters = {
        peaceful: "sepia(100%) saturate(10000%) hue-rotate(120deg)",
        violent: "sepia(100%) saturate(10000%) hue-rotate(333deg)",
        neutral: "",
    };

    img.style.filter = filters[poi.narrative_level] || "greyscale(100%)";

    const customIcon = L.divIcon({ className: 'custom-icon', html: img });

    return customIcon;
}

function loadPOIs() {
    fetch("data/points_of_interest.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(poi => {
                const { latitude: lat, longitude: lng } = poi;
                const { color, shape } = getPOIMarkerOptions(poi);
                const customIcon = createCustomPOIIcon(poi);
                const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

                marker.bindPopup(
                    `<b>Title:</b> ${poi.title}<br>
            <b>Type:</b> ${poi.type}<br>
            <b>Narrative Level:</b> ${poi.narrative_level}<br>
            ${poi.description}`,
                    { autoPan: true }
                );
            });
        })
        .catch(error => console.error("Error loading points_of_interest.json:", error));
}

function createCustomIncidentIcon(incident) {
    let iconUrl;

    switch (incident.type) {
        case "Decor destroyed":
            iconUrl = `images/symbols/decor.png`;
            break;
        case "Terrain destroyed":
            iconUrl = `images/symbols/damage.png`;
            break;
        case "Narrative ended":
            iconUrl = `images/symbols/narrative.png`;
            break;
        case "Malfunction":
            iconUrl = `images/symbols/warning.png`;
            break;
        case "Host Destroyed":
            iconUrl = `images/symbols/death.png`;
            break;
        default:
            iconUrl = `images/symbols/default.png`;
    }

    const img = new Image();
    img.src = iconUrl;
    img.width = 22;
    img.height = 22;

    const filters = {
        Critical: `sepia(100%) saturate(10000%) hue-rotate(260deg) opacity(1)`,
        High: `sepia(100%) saturate(10000%) hue-rotate(330deg) opacity(1)`,
        Medium: `sepia(100%) saturate(10000%) hue-rotate(20deg) sepia(100%) opacity(1)`,
        Low: `sepia(100%) saturate(10000%) hue-rotate(120deg) opacity(1)`,
    };

    img.style.filter = filters[incident.severity] || `brightness(100%) hue-rotate(0deg) saturate(100%) sepia(100%) opacity(1)`;

    const customIcon = L.divIcon({ className: 'custom-icon', html: img });

    return customIcon;
}

function loadIncidents() {
    fetch("data/incident_reports.json")
        .then(response => response.json())
        .then(data => {
            const incidentMarkers = [];
            const clusterColors = {
                Critical: "rgba(255, 0, 120, 0.5)",
                High: "rgba(255, 165, 0, 0.5)",
                Medium: "rgba(253, 218, 13, 0.5)",
                Low: "rgba(24, 255, 255, 0.5)",
                default: "rgba(0, 0, 255, 0.5)",
            };

            const clusterOptions = {
                iconCreateFunction: cluster => {
                    const clusterMarkers = cluster.getAllChildMarkers();
                    let clusterColor = clusterColors.default;

                    for (const marker of clusterMarkers) {
                        const severity = marker.incidentSeverity;
                        const color = clusterColors[severity] || clusterColors.default;

                        if (clusterColors[severity] && clusterColors[severity] !== "blue") {
                            clusterColor = clusterColors[severity];
                            break;
                        }
                    }

                    return L.divIcon({
                        html: `<div class="custom-cluster-icon" style="background-color: ${clusterColor}">${cluster.getChildCount()}</div>`,
                        className: "custom-cluster",
                        iconSize: [32, 32],
                    });
                },
            };

            data.forEach(incident => {
                const { latitude: lat, longitude: lng } = incident;
                const boundaryLat = 120;
                const boundaryLng = 120;

                if (lat < boundaryLat || lng < boundaryLng) {
                    return;
                }

                const customIcon = createCustomIncidentIcon(incident);

                const marker = L.marker([lat, lng], { icon: customIcon });
                marker.incident_id = incident.incident_id;
                marker.incidentSeverity = incident.severity;
                marker.bindPopup(
                    `<b>Incident ID:</b> ${incident.incident_id}<br>
            <b>Timestamp:</b> ${incident.timestamp}<br>
            <b>Type:</b> ${incident.type}<br>
            <b>Severity:</b> ${incident.severity}<br>
            <b>Point of Interest:</b> ${incident.point_of_interest}`,
                    { autoPan: true }
                );

                incidentMarkers.push(marker);
            });

            const incidentsCluster = L.markerClusterGroup(clusterOptions);
            incidentsCluster.addLayers(incidentMarkers);
            map.addLayer(incidentsCluster);

            incidentsCluster.on("clusterclick", event => {
                displayClusterModal(event.layer.getAllChildMarkers());
            });

        })
        .catch(error => console.error("Error loading incident_reports.json:", error));
}

function getIncidentTypes() {
    fetch("data/incident_reports.json")
        .then(response => response.json())
        .then(data => {
            const incidentTypes = [...new Set(data.map(incident => incident.type))];
            console.log(incidentTypes);
        })
        .catch(error => console.error("Error loading incident_reports.json:", error));
}

getIncidentTypes();

const coordControl = L.control({ position: "topright" });

coordControl.onAdd = function (map) {
    const div = L.DomUtil.create("div", "coordinate-display");
    div.innerHTML = "Hover over the map";
    div.style.color = "white";
    this._div = div; // Store the div reference here
    return this._div;
};

coordControl.addTo(map);

map.on("mousemove", function (event) {
    var lat = event.latlng.lat;
    var lng = event.latlng.lng;
    coordControl._div.innerHTML = `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
});

function showBorder() {
    fetch("objects/island.json")
        .then(response => response.json())
        .then(data => {
            L.polyline(data.features[0].geometry.coordinates[0], {
                color: "red",
                weight: 2,
            }).addTo(map);
        })
        .catch(error => console.error("Error loading island.json:", error));
}

// Uncomment the line below if you want to show the border
// showBorder();

loadIncidents();
loadPOIs();
