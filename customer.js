document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map', {
        scrollWheelZoom: false
    }).setView([40.7363, -73.8176], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        minZoom: 17,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    const halalMarker = L.marker([40.735579030960345, -73.8168977355432]).addTo(map);
    halalMarker.bindPopup("Halal Food Truck", {
        autoClose: false,
        closeOnClick: false
    });
    
    const scienceBuildingCafe = L.marker([40.73524642433489, -73.82025639151054]).addTo(map);
    scienceBuildingCafe.bindPopup("Science Building Cafe", {
        autoClose: false,
        closeOnClick: false
    });

    const qcCampusEats = L.marker([40.737234, -73.817224]).addTo(map);
    qcCampusEats.bindPopup("QC Campus Eats", {
        autoClose: false,
        closeOnClick: false
    });

    const waffleCart = L.marker([40.735463, -73.819462]).addTo(map);
    waffleCart.bindPopup("Waffle & Dingles Cart", {
        autoClose: false,
        closeOnClick: false
    });
    
    // Open all popups
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            layer.openPopup();
        }
    });
    setTimeout(function() {
        map.invalidateSize();
    }, 300);
});