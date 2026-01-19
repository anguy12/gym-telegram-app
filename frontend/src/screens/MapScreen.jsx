// src/screens/MapScreen.jsx
import React from 'react';
import GymMap from '../components/GymMap';
import { FaMapMarkerAlt } from 'react-icons/fa';

const MapScreen = () => {
  return (
    <div className="map-screen">
      <h2 className="screen-title">Наші локації</h2>
      <p className="screen-subtitle">Знайди найближчий зал до тебе</p>
      
      {/* Список адрес текстом (для зручності) */}
      <div className="locations-list">
        <div className="location-item">
            <FaMapMarkerAlt className="loc-icon" />
            <div>
                <strong>KOLIZEY I</strong>
                <p>вул. П.Полуботка, 31</p>
            </div>
        </div>
        <div className="location-item">
            <FaMapMarkerAlt className="loc-icon" />
            <div>
                <strong>KOLIZEY II</strong>
                <p>вул. П.Мирного, 24Г</p>
            </div>
        </div>
      </div>

      {/* Сама мапа */}
      <GymMap />
    </div>
  );
};

export default MapScreen;