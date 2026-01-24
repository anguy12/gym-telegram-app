import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock } from 'react-icons/fa';

const MapScreen = () => {
  return (
    <div style={{ paddingBottom: 20 }}>
      <h2 style={{ fontSize: 24, marginBottom: 20, fontWeight: '800', color: '#fff' }}>
        Наші локації
      </h2>

      {/* --- ЛОКАЦІЯ 1: ПОЛУБОТКА --- */}
      <div className="cyber-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Мапа (Iframe) */}
        <div style={{ height: 200, width: '100%', filter: 'grayscale(100%) invert(90%)' }}>
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0" 
            src="https://maps.google.com/maps?q=Lviv,Polubotka,31&t=&z=15&ie=UTF8&iwloc=&output=embed"
            style={{ border: 0 }}
          ></iframe>
        </div>

        <div style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: 18 }}>KOLIZEY I</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, color: '#aaa', fontSize: 14 }}>
            <FaMapMarkerAlt style={{ color: 'var(--neon-red)', marginRight: 10 }} />
            вул. П. Полуботка, 31
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, color: '#aaa', fontSize: 14 }}>
            <FaPhoneAlt style={{ color: 'var(--neon-red)', marginRight: 10 }} />
            <a href="tel:0971310039" style={{ color: '#aaa', textDecoration: 'none' }}>097 131 00 39</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', color: '#aaa', fontSize: 14 }}>
            <FaClock style={{ color: 'var(--neon-red)', marginRight: 10 }} />
            08:00 - 22:00 (Пн-Сб)
          </div>
        </div>
      </div>

      {/* --- ЛОКАЦІЯ 2: МИРНОГО --- */}
      <div className="cyber-card" style={{ padding: 0, overflow: 'hidden', marginTop: 30 }}>
        {/* Мапа (Iframe) */}
        <div style={{ height: 200, width: '100%', filter: 'grayscale(100%) invert(90%)' }}>
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0" 
            src="https://maps.google.com/maps?q=Lviv,Panasa+Myrnogo,24&t=&z=15&ie=UTF8&iwloc=&output=embed"
            style={{ border: 0 }}
          ></iframe>
        </div>

        <div style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: 18 }}>KOLIZEY II</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, color: '#aaa', fontSize: 14 }}>
            <FaMapMarkerAlt style={{ color: 'var(--neon-red)', marginRight: 10 }} />
            вул. П. Мирного, 24Г
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, color: '#aaa', fontSize: 14 }}>
            <FaPhoneAlt style={{ color: 'var(--neon-red)', marginRight: 10 }} />
            <a href="tel:0986617715" style={{ color: '#aaa', textDecoration: 'none' }}>098 661 77 15</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', color: '#aaa', fontSize: 14 }}>
            <FaClock style={{ color: 'var(--neon-red)', marginRight: 10 }} />
            08:00 - 22:00 (Пн-Сб)
          </div>
        </div>
      </div>

    </div>
  );
};

export default MapScreen;