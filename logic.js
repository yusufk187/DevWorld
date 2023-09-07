// Step 1: Create a function to handle the onClick event
function handleMapClick(event) {
    const { lat, lng } = event.latlng;

    // Check if the click is within the map bounds
    if (isWithinBounds(lat, lng)) {
        // Open the modal and pass lat/lng values
        displayModal(lat, lng);
    }
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

// Step 3: Implement a function to display the modal and accept lat/lng as arguments
function displayModal(lat, lng) {
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
        <div class="bg-transparent p-4 sm:p-7 bg-opacity-60 text-sm">
            <form id="incidentForm">

                <div class="mb-4">
                    <p>Incident ID: <span id="incidentId" class="text-white"></span></p>
                </div>
                
                <div class="mb-4">
                    <p>Timestamp: <span id="timestamp" class="text-white"></span></p>
                </div>

                <div class="mb-4 text-white">
                    <div class="flex space-x-4">
                        <div class="w-1/2">
                            <p id="latitudeValue">Latitude: ${lat}</p>
                        </div>
                        <div class="w-1/2">
                            <p id="longitudeValue">Longitude: ${lng}</p>
                        </div>
                    </div>
                </div>

                <!-- Rest of your form elements -->

            </form>
        </div>

        <!-- Modal Buttons -->
        <div class="flex justify-end p-4 sm:p-7 dark:bg-slate-900">
            <button class="px-4 py-2 bg-teal-300 hover:bg-teal-400 text-black rounded-sm mr-2" id="modalSaveButton">File Incident</button>
            <button class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-sm" id="modalCancelButton">Cancel report</button>
        </div>
    `;

    // Append the modal container to the body
    document.body.appendChild(modalContainer);

    // Add an event listener to close the modal when the "Cancel" button is clicked
    const cancelButton = modalContainer.querySelector('#modalCancelButton');
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });

    // Add an event listener for the "Save Changes" button (You can implement the functionality here)
    const saveButton = modalContainer.querySelector('#modalSaveButton');
    saveButton.addEventListener('click', () => {
        // Implement your save changes logic here
        // After saving changes, you can close the modal
        document.body.removeChild(modalContainer);
    });

    // Auto-generate and set the incident ID value
    const incidentIdElement = document.getElementById('incidentId');
    const generatedIncidentID = generateIncidentID(); // Call the function and store the result
    incidentIdElement.textContent = generatedIncidentID; // Set the generated ID in the HTML

    // Set the current timestamp value
    const timestampElement = document.getElementById('timestamp');
    const currentTimestamp = setCurrentTimestamp(); // Call the function to get the timestamp
    timestampElement.textContent = currentTimestamp; // Set the timestamp in the HTML
}

// Step 4: Attach the onClick event handler to the map
map.on("click", handleMapClick);

