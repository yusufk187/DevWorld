// Create a Leaflet map with CRS.Simple
var map = L.map("map", {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 1,
}).setView([1024, 1024], -1);

// Define bounds for the image overlay
var bounds = [
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

// Function to apply the hue-rotate filter to an image
function applyHueRotateFilter(image, degrees) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    context.filter = `hue-rotate(${degrees}deg)`;
    context.drawImage(image, 0, 0, image.width, image.height);
    image.src = canvas.toDataURL();
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

loadPOIs();

// Create a Leaflet control for the coordinate display
var coordControl = L.control({ position: "topright" });

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
