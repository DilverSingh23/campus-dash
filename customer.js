document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map', {
        scrollWheelZoom: false
    }).setView([40.7363, -73.8176], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        minZoom: 17,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    const halalMarker = L.marker([40.73557935806131, -73.81675414772432]).addTo(map);
    halalMarker.bindPopup("Halal Truck | Empanada Truck | Mr. Sandwich Cart", {
        autoClose: false,
        closeOnClick: false
    });
    
    const scienceBuildingCafe = L.marker([40.734921532317024, -73.82033040527723]).addTo(map);
    scienceBuildingCafe.bindPopup("Science Cafe", {
        autoClose: false,
        closeOnClick: false
    });

    const qcCampusEats = L.marker([40.737234, -73.817224]).addTo(map);
    qcCampusEats.bindPopup("QC Campus Eats | Mama Kitchen | Taiwanese Yummy | Reem's Grillhouse | Tealicious", {
        autoClose: false,
        closeOnClick: false
    });

    const waffleCart = L.marker([40.735463, -73.819462]).addTo(map);
    waffleCart.bindPopup("Waffle & Dingles Cart", {
        autoClose: false,
        closeOnClick: false
    });

    const tealicious = L.marker([40.73430554184099, -73.81600222646458]).addTo(map);
    tealicious.bindPopup("Taiwanese Yummy | Tealicious | General Deli", {
        autoClose: false,
        closeOnClick: false
    })
    
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

