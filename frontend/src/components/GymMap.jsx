// src/components/GymMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Створюємо кастомний червоний маркер
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-pin',
    iconSize: [20, 20],
    popupAnchor: [0, -10]
  });
};

const GymMap = () => {
  // Центр між двома залами (Львів)
  const centerPosition = [49.8015, 24.0535]; 

  const locations = [
    { 
      id: 1, 
      name: 'KOLIZEY I', 
      address: 'вул. П.Полуботка, 31',
      pos: [49.7907, 24.0728] // Точні координати Сихів
    },
    { 
      id: 2, 
      name: 'KOLIZEY II', 
      address: 'вул. П.Мирного, 24Г',
      pos: [49.8122, 24.0341] // Точні координати Новий Львів
    }
  ];

  return (
    <div className="map-container-style">
      <MapContainer 
        center={centerPosition} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        {/* Використовуємо Esri World Imagery (Супутник) - це дуже деталізовано і красиво.
        */}
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Додаємо шар з написами (Вулиці) поверх супутника, 
            інакше не буде зрозуміло, де яка вулиця.
        */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        />

        {locations.map(loc => (
          <Marker 
            key={loc.id} 
            position={loc.pos} 
            icon={createCustomIcon()}
          >
            <Popup className="custom-popup">
              <div style={{textAlign: 'center'}}>
                <b style={{color: '#E63946', fontSize: '14px'}}>{loc.name}</b>
                <br/> 
                <span style={{fontSize: '12px'}}>{loc.address}</span>
                <br/>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${loc.pos[0]},${loc.pos[1]}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    display: 'inline-block', 
                    marginTop: '8px', 
                    color: 'white', 
                    background: '#E63946',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '12px'
                  }}
                >
                  📍 Маршрут
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GymMap;