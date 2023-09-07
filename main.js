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

function createCustomIcon(poi) {
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
    img.classList.add("custom-image");

    const filters = {
        peaceful: "sepia(100%) saturate(10000%) hue-rotate(120deg)",
        violent: "sepia(100%) saturate(10000%) hue-rotate(333deg)",
        neutral: "",
    };

    img.style.filter = filters[poi.narrative_level] || "greyscale(100%)";

    const customIcon = L.divIcon({ className: 'custom-icon', html: img });

    return customIcon;
}

function createCustomPopup(poi) {
    const popupContent = document.createElement('div');
    popupContent.innerHTML = `
        <div class="bg-teal-300 px-4 py-3 rounded-t-md">
            <h2 class="text-xl font-semibold text-white bold uppercase text-shadow">Point of Interest</h2>
        </div>

        <div class="bg-transparent p-4 sm:p-7 bg-opacity-60 text-sm text-white">
            <p><b>Title:</b> ${poi.title}</p>
            <p><b>Type:</b> ${poi.type}</p>
            <p><b>Narrative Level:</b> ${poi.narrative_level}</p>
            <p>${poi.description}</p>
        </div>
        
    `;

    // Get the Leaflet popup wrapper element
    const popupWrapper = popupContent.closest('.leaflet-popup');

    // Apply custom styles to the popup wrapper
    if (popupWrapper) {
        popupWrapper.style.backgroundColor = 'transparent';
        popupWrapper.style.boxShadow = 'none';
        popupWrapper.style.border = 'none';
    }

    return popupContent;
}

function loadPOIs() {
    fetch("data/points_of_interest.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(poi => {
                const { latitude: lat, longitude: lng } = poi;
                const { color, shape } = getPOIMarkerOptions(poi);
                const customIcon = createCustomIcon(poi);
                const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

                // Bind the custom popup content to the marker
                marker.bindPopup(createCustomPopup(poi), { autoPan: true });
            });
        })
        .catch(error => console.error("Error loading points_of_interest.json:", error));
}

function createIncidentIcon(incident) {
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
    img.classList.add("custom-image");

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

                const customIcon = createIncidentIcon(incident, clusterColors[incident.severity]);

                const marker = L.marker([lat, lng], { icon: customIcon });
                marker.incident_id = incident.incident_id;
                marker.incidentSeverity = incident.severity;

                const popupContent = document.createElement('div');
                popupContent.innerHTML = `
                    <div class="bg-teal-300 px-4 py-3 rounded-t-md">
                        <h2 class="text-xl font-semibold text-white bold uppercase text-shadow">Incident Report</h2>
                    </div>
                    <div class="bg-transparent p-4 sm:p-7 bg-opacity-60 text-sm text-white">
                        <p><b>Incident ID:</b> ${incident.incident_id}</p>
                        <p><b>Timestamp:</b> ${incident.timestamp}</p>
                        <p><b>Type:</b> ${incident.type}</p>
                        <p><b>Severity:</b> ${incident.severity}</p>
                        <p><b>Point of Interest:</b> ${incident.point_of_interest}</p>
                        <p>Description: ${incident.description}</p>
                        <div class="mb-4 flex flex-row gap-4 px-2">
                        <button class="px-4 py-2 bg-teal-300 hover:bg-teal-400 text-black rounded-sm mr-2" id="modalSaveButton">File Incident</button>
                        <button class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-sm" id="delete-${incident.incident_id}">Remove report</button>
                        </div>
                    </div>
                `;

                // Get the Leaflet popup wrapper element
                const popupWrapper = popupContent.closest('.leaflet-popup');

                // Apply custom styles to the popup wrapper
                if (popupWrapper) {
                    popupWrapper.style.backgroundColor = 'transparent';
                    popupWrapper.style.boxShadow = 'none';
                    popupWrapper.style.border = 'none';
                }

                marker.bindPopup(popupContent, { autoPan: true });

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

function deleteIncident(incidentId, marker) {
    fetch('http://localhost:3000/delete-incident', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ incident_id: incidentId }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Incident deleted') {
                const audio = new Audio('sound/close.mp3');
                audio.play();
                setTimeout(function () {
                    map.removeLayer(marker);
                }, 1000);
            }
        })
        .catch(error => console.error("Error deleting incident:", error));
}

const coordControl = L.control({ position: "topright" });

coordControl.onAdd = function (map) {
    const div = L.DomUtil.create("div", "coordinate-display");
    div.innerHTML = "Hover over the map";
    div.style.color = "white";
    this._div = div; // Store the div reference here
    return this._div;
};

coordControl.addTo(map);

map.on('popupopen', function (e) {
    const incidentId = e.popup._source.incident_id;
    const marker = e.popup._source;
    const deleteButton = document.getElementById(`delete-${incidentId}`);

    if (deleteButton) {
        deleteButton.addEventListener('click', function () {
            // Play a sound effect
            const audio = new Audio('sound/close.mp3');
            audio.play();
            // 1 second delay before deleting the marker
            setTimeout(function () {
                deleteIncident(incidentId, marker);
            }, 1000);
        });
    }
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

map.on('popupopen', function (e) {
    const incidentId = e.popup._source.incident_id;
    const marker = e.popup._source;
    const deleteButton = document.getElementById(`delete-${incidentId}`);

    if (deleteButton) {
        deleteButton.addEventListener('click', function () {
            const audio = new Audio('sound/close.mp3');
            audio.play();
            setTimeout(function () {
                deleteIncident(incidentId, marker);
            }, 1000);
        });
    }
});

// Add a variable to track whether a modal is currently open
let isModalOpen = false;

// Step 1: Create a function to handle the onClick event
function handleMapClick(event) {
    const { lat, lng } = event.latlng;

    // Check if a modal is already open
    if (isModalOpen) {
        return;
    }

    // Check if the click is within the map bounds
    if (isWithinBounds(lat, lng)) {
        // Open the modal and pass lat/lng values
        displayModal(lat, lng);
    }
}

// Function to get lat/lng values from the click event
function getLatLng(event) {
    const { lat, lng } = event.latlng;
    return { lat, lng };
}

// Step 2: Check if the click is within the map bounds
function isWithinBounds(lat, lng) {
    // Add your custom bounds checking logic here
    const boundaryLat = 0; // Adjust as needed
    const boundaryLng = 0; // Adjust as needed
    return lat >= boundaryLat && lng >= boundaryLng;
}

// Functions for generating the current timestamp and incident ID
function generateIncidentID() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const uniqueID = Math.floor(Math.random() * 1000); // You can use a more robust unique ID generation method
    const id = `INC-${year}-${month}-${day}-${uniqueID}`;
    return id;
}

// Function to set the current timestamp and return it
function setCurrentTimestamp() {
    const date = new Date();
    const timestamp = date.toISOString();
    return timestamp;
}

// Function to find the nearest POI
async function findMarkerLocation(lat, lng) {
    const response = await fetch("data/points_of_interest.json");
    const data = await response.json();
    const userLocation = { lat, lng };
    let nearestPOI = null;
    let nearestDistance = Number.MAX_VALUE;

    for (const poi of data) {
        const poiLocation = { lat: poi.latitude, lng: poi.longitude };
        // Calculate the absolute numerical difference for latitude and longitude
        const latDiff = Math.abs(poiLocation.lat - userLocation.lat);
        const lngDiff = Math.abs(poiLocation.lng - userLocation.lng);

        // Calculate the total difference as a sum of latitude and longitude differences
        const totalDiff = latDiff + lngDiff;

        if (totalDiff < nearestDistance) {
            nearestPOI = poi.title; // Store the title of the nearest POI
            nearestDistance = totalDiff;
        }
    }

    return nearestPOI;
}

// Step 3: Implement a function to display the modal and accept lat/lng as arguments
async function displayModal(lat, lng) {

    // Set the modal open flag to true
    isModalOpen = true;

    // Create a modal container
    const modalContainer = document.createElement('div');
    modalContainer.classList.add(
        'fixed', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2',
        'bg-black', 'bg-opacity-60', 'shadow-lg', 'rounded-md', 'text-white', 'z-50'
    );

    // Add the HTML content to the modal container
    modalContainer.innerHTML = `
            <!-- Modal Header -->
            <div class="bg-teal-300 px-4 py-3 rounded-t-md">
                <h2 class="text-xl font-semibold text-white bold uppercase text-shadow">New Incident Report</h2>
            </div>

            <!-- Modal Content -->
            <div class="bg-transparent p-4 sm:p-7 bg-opacity-60 text-sm text-white">
                <form id="incidentForm">

                    <div class="mb-4">
                        <p>Incident ID: <span id="incidentId"></span></p>
                    </div>
                    
                    <div class="mb-4">
                        <p>Timestamp: <span id="timestamp"></span></p>
                    </div>

                    <div class="mb-4">
                        <div class="flex space-x-4">
                            <div class="w-1/2">
                                <p id="latitudeValue">Latitude: ${lat}</p>
                            </div>
                            <div class="w-1/2">
                                <p id="longitudeValue">Longitude: ${lng}</p>
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <p>Closest POI: <span id="poiValue"></span></p>
                    </div>

                    <div class="mb-4">
                        <label for="type" class="block font-semibold mb-2">Incident Type</label>
                        <select id="type" name="type" required class="w-full px-3 py-2 border rounded-sm bg-transparent">
                            <option value="Decor destroyed">Decor destroyed</option>
                            <option value="Terrain destroyed">Terrain destroyed</option>
                            <option value="Narrative ended">Narrative ended</option>
                            <option value="Malfunction">Malfunction</option>
                            <option value="Host Destroyed">Host Destroyed</option>
                        </select>
                    </div>
        
                    <div class="mb-4">
                        <label for="severity" class="block font-semibold mb-2">Severity</label>
                        <select id="severity" name="severity" required class="w-full px-3 py-2 border rounded-sm bg-transparent">
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label for="description" class="block font-semibold mb-2">Describe the incident</label>
                        <textarea id="description" name="description" required class="w-full px-3 py-2 border rounded-sm bg-transparent"></textarea>
                    </div>

                </form>
            </div>

            <!-- Modal Buttons -->
            <div class="flex justify-end p-4 sm:p-7">
                <button class="px-4 py-2 bg-teal-300 hover:bg-teal-400 text-black rounded-sm mr-2" id="modalSaveButton">File Incident</button>
                <button class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-sm" id="modalCancelButton">Cancel report</button>
            </div>
        `;

    // Append the modal container to the body
    document.body.appendChild(modalContainer);

    // Add an event listener to close the modal when the "Cancel" button is clicked
    const cancelButton = modalContainer.querySelector('#modalCancelButton');
    cancelButton.addEventListener('click', () => {
        const audio = new Audio('sound/close.mp3');
        audio.play();
        document.body.removeChild(modalContainer);
        // Set the modal open flag to false when the modal is closed
        isModalOpen = false;
    });

    // Add an event listener for the "Save Changes" button
    const saveButton = modalContainer.querySelector('#modalSaveButton');
    saveButton.addEventListener('click', async () => {

        // Gather form data
        const incidentForm = document.getElementById('incidentForm');
        const formData = new FormData(incidentForm);

        // Convert form data to a plain JavaScript object
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        // Add additional data like latitude, longitude, incident ID, and timestamp
        formDataObject.latitude = lat;
        formDataObject.longitude = lng;
        formDataObject.incident_id = generateIncidentID();
        formDataObject.timestamp = setCurrentTimestamp();
        formDataObject.point_of_interest = await findMarkerLocation(lat, lng);
        

        // Send the form data to the server for processing and storage
        try {
            const response = await fetch('http://localhost:3000/save-incident', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataObject),
            });

            if (response.ok) {
                // Data was successfully saved, you can handle success here
                console.log('Incident data saved successfully');
            } else {
                // Handle any errors that may occur during the request
                console.error('Failed to save incident data');
                console.error(response);
            }
        } catch (error) {
            console.error('Error while saving incident data:', error);
        }

        // Close the modal
        document.body.removeChild(modalContainer);
        // Set the modal open flag to false when the modal is closed
        isModalOpen = false;
    });

    // Auto-generate and set the incident ID value
    const incidentIdElement = document.getElementById('incidentId');
    const generatedIncidentID = generateIncidentID();
    incidentIdElement.textContent = generatedIncidentID;

    // Set the current timestamp value
    const timestampElement = document.getElementById('timestamp');
    const currentTimestamp = setCurrentTimestamp();
    timestampElement.textContent = currentTimestamp;

    // Find the nearest POI
    const poiElement = document.getElementById('poiValue');
    const nearestPOI = await findMarkerLocation(lat, lng);
    poiElement.textContent = nearestPOI;
}

// Functions
map.on("click", async (e) => {
    // Play a sound effect
    const audio = new Audio('sound/open.mp3');
    audio.play();
    
    // Call the handleMapClick function with the event and perform other actions as needed
    handleMapClick(e);
});

loadIncidents();
loadPOIs();