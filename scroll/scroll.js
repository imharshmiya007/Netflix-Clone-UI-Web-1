// Function to fetch and read the CSV file
function readCSVFile() {
    fetch('youtube.csv')
        .then(response => response.text())
        .then(data => {
            // Process the CSV data
            var allData = "";
            const lines = data.split('\n'); // Split rows
            lines.forEach(line => {
                allData += line + " "; // Add each line to the allData variable
            });
            console.log(allData)
            // Display the result in HTML
            document.getElementById("csv-output").innerText = allData;
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
}

// Call the function to read the CSV file when the page loads
window.onload = readCSVFile;

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('gridContainer');
    const totalScreens = 120; // Adjust if you need more screens

    for (let i = 1; i <= totalScreens; i++) {
        const screen = document.createElement('div');
        screen.className = 'screen';
        screen.innerHTML = `
            <div class="video-container">
                <nav class="navbar">
                    <button class="transparent-button"></button>
                    <button class="transparent-button"></button>
                    <button class="transparent-button"></button>
                    <button class="transparent-button"></button>
                </nav>
                <iframe 
                    id="videoPlayer${allData}"
                    src="https://www.youtube.com/embed/${allData}?mute=1&controls=1&modestbranding=0&fs=0&rel=0"
                    frameborder="0" 
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
                <div class="play-overlay" id="playOverlay${i}" onclick="playVideo(${i})"></div>
                <button class="control-button" id="toggleButton${i}" onclick="toggleFullScreen(${i})">⛶</button>
            </div>
        `;
        gridContainer.appendChild(screen);
    }
});

function sendMessageToPlayer(iframeId, command) {
    const iframe = document.getElementById(`videoPlayer${iframeId}`);
    iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: command }), '*');
}

function playVideo(screenIndex) {
    const playOverlay = document.getElementById(`playOverlay${screenIndex}`);
    const iframe = document.getElementById(`videoPlayer${screenIndex}`);
    
    if (!iframe.src.includes('autoplay=1')) {
        iframe.src = iframe.src.split('&autoplay=1')[0] + '&autoplay=1';
    }
    playOverlay.classList.add('hidden');
    playOverlay.classList.remove('darker');
    toggleFullScreen(screenIndex);
}

function toggleFullScreen(screenIndex) {
    const container = document.querySelector(`#videoPlayer${screenIndex}`).parentElement;
    const button = document.getElementById(`toggleButton${screenIndex}`);

    if (document.fullscreenElement) {
        document.exitFullscreen();
        button.textContent = "⛶";
        sendMessageToPlayer(screenIndex, 'pauseVideo');
    } else {
        container.requestFullscreen();
        button.textContent = "⛶";
    }
}

document.addEventListener('fullscreenchange', () => {
    const fullScreenElements = document.querySelectorAll('[id^="toggleButton"]');
    fullScreenElements.forEach(button => {
        if (!document.fullscreenElement) {
            button.textContent = "⛶";
        }
    });
});
