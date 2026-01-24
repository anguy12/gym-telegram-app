import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaExternalLinkAlt } from 'react-icons/fa';

const MapScreen = () => {
  
  // Функція для відкриття мапи
  const openGoogleMaps = (address) => {
    // Формуємо посилання для пошуку в картах
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      <h2 style={{ fontSize: 24, marginBottom: 20, fontWeight: '800', color: '#fff' }}>
        Наші локації
      </h2>

      {/* --- ЛОКАЦІЯ 1: ПОЛУБОТКА --- */}
      <div className="cyber-card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
        
        {/* Клікабельна зона мапи */}
        <div 
          onClick={() => openGoogleMaps("вулиця Павла Полуботка, 31, Львів")}
          style={{ 
            height: 200, width: '100%', 
            filter: 'grayscale(100%) invert(90%)', // Темний стиль мапи
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          {/* Iframe (тільки для візуалу, кліки не приймає завдяки pointer-events: none) */}
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2572.686568776077!2d24.03157531571096!3d49.84833397939712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473add0e03748249%3A0x62955743a1376d54!2z0LLRg9C70LjRhtGPINCf0LDQstC70LAg0J_QvtC70YPQsdC-0YLQutCwLCAzMSwg0JvRjNCy0ZbQsiwg0JvRjNCy0ZbQstGB0YzQutCwINC-0LHQu9Cw0YHRgtGMLCA3OTAwMA!5e0!3m2!1suk!2sua!4v1648045611029!5m2!1suk!2sua"
            style={{ border: 0, pointerEvents: 'none' }} // Важливо: pointerEvents: none
          ></iframe>
          
          {/* Напис "Відкрити" поверх мапи */}
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(0,0,0,0.7)', padding: '5px 10px', borderRadius: 8,
            color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center',
            border: '1px solid #333'
          }}>
            <FaExternalLinkAlt style={{marginRight: 6}} size={10}/> Відкрити карту
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: 18 }}>KOLIZEY I</h3>
            <button 
               onClick={() => openGoogleMaps("вулиця Павла Полуботка, 31, Львів")}
               style={{
                 background: 'transparent', border: '1px solid var(--neon-red)', 
                 color: 'var(--neon-red)', borderRadius: 6, padding: '4px 8px', fontSize: 10, cursor: 'pointer'
               }}
            >
               МАРШРУТ ↗
            </button>
          </div>
          
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
      <div className="cyber-card" style={{ padding: 0, overflow: 'hidden', marginTop: 30, position: 'relative' }}>
        
         {/* Клікабельна зона мапи */}
        <div 
          onClick={() => openGoogleMaps("вулиця Панаса Мирного, 24, Львів")}
          style={{ 
            height: 200, width: '100%', 
            filter: 'grayscale(100%) invert(90%)',
            cursor: 'pointer', position: 'relative'
          }}
        >
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2574.053229643758!2d24.03746631571026!3d49.82252297939374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473add4415510657%3A0xc304245607310344!2z0LLRg9C70LjRhtGPINCf0LDQvdCw0YHQsCDQnNC40YDQvdC-0LPQviwgMjQsINCb0YzQstGW0LIsINCb0YzQstGW0LLRgdGM0LrQsCDQvtCx0LvQsNGB0YLRjCwgNzkwMDA!5e0!3m2!1suk!2sua!4v1648045785021!5m2!1suk!2sua"
            style={{ border: 0, pointerEvents: 'none' }}
          ></iframe>

          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(0,0,0,0.7)', padding: '5px 10px', borderRadius: 8,
            color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center',
            border: '1px solid #333'
          }}>
            <FaExternalLinkAlt style={{marginRight: 6}} size={10}/> Відкрити карту
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: 18 }}>KOLIZEY II</h3>
            <button 
               onClick={() => openGoogleMaps("вулиця Панаса Мирного, 24, Львів")}
               style={{
                 background: 'transparent', border: '1px solid var(--neon-red)', 
                 color: 'var(--neon-red)', borderRadius: 6, padding: '4px 8px', fontSize: 10, cursor: 'pointer'
               }}
            >
               МАРШРУТ ↗
            </button>
          </div>
          
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