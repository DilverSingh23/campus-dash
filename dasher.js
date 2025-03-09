document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map', {
        scrollWheelZoom: false
    }).setView([40.7363, -73.8176], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        minZoom: 17,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
});
