// src/screens/SubscriptionsScreen.jsx
import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import WebApp from '@twa-dev/sdk'; 

const API_URL = "https://gym-telegram-app.onrender.com";

const SubscriptionsScreen = ({ userId }) => {
  const [selectedGymId, setSelectedGymId] = useState('polubotka');
  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функція покупки
  const handleBuy = async (priceItem) => {
    WebApp.HapticFeedback.impactOccurred('light');
    if (!confirm(`Купити "${priceItem.title}"?`)) return;

    // Проста логіка днів/занять для тесту
    let sessionsCount = 30; 
    let daysCount = 30;
    if (priceItem.title.includes("Безлім") || priceItem.title.includes("Річний")) sessionsCount = 9999;
    if (priceItem.title.includes("Річний")) daysCount = 365;

    try {
      const response = await fetch(`${API_URL}/api/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          title: priceItem.title,
          days: daysCount,
          sessions: sessionsCount
        })
      });
      
      if (response.ok) {
        WebApp.HapticFeedback.notificationOccurred('success'); 
        alert("Успішно! ✅");
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Помилка:", error);
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/gyms`)
      .then(res => res.json())
      .then(data => { setGymData(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: 50}}>Завантаження цін...</div>;
  if (!gymData) return <div style={{textAlign: 'center', marginTop: 50}}>Помилка даних :(</div>;

  const currentGym = gymData[selectedGymId];

  // Компонент картки ціни
  const PriceCard = ({ item }) => (
    <div className="price-card" onClick={() => handleBuy(item)} 
         style={{
           background: '#1c1c1e', marginBottom: 10, padding: 15, borderRadius: 12,
           display: 'flex', justifyContent: 'space-between', alignItems: 'center',
           border: '1px solid #333'
         }}>
       <div>
          <h3 style={{margin: '0 0 5px 0', fontSize: 16, color: '#fff'}}>{item.title}</h3>
          <p style={{margin: 0, fontSize: 12, color: '#888'}}>{item.desc}</p>
       </div>
       <div style={{textAlign: 'right'}}>
         <div style={{
           background: '#E50914', color: 'white', padding: '6px 12px', 
           borderRadius: 8, fontWeight: 'bold', fontSize: 14
         }}>
           {item.local} ₴
         </div>
       </div>
    </div>
  );

  return (
    <div className="subscriptions-screen">
      <h2 style={{fontSize: 24, marginBottom: 20}}>Абонементи</h2>
      
      {/* ПЕРЕМИКАЧ ЗАЛІВ */}
      <div style={{
        display: 'flex', background: '#1c1c1e', padding: 4, borderRadius: 12, marginBottom: 20
      }}>
        <button 
          onClick={() => setSelectedGymId('polubotka')}
          style={{
            flex: 1, padding: '10px 0', border: 'none', borderRadius: 10,
            background: selectedGymId === 'polubotka' ? '#E50914' : 'transparent',
            color: selectedGymId === 'polubotka' ? '#fff' : '#666',
            fontWeight: 'bold', transition: 'all 0.3s'
          }}
        >
          вул. П. Полуботка
        </button>
        <button 
          onClick={() => setSelectedGymId('myrnoho')}
          style={{
            flex: 1, padding: '10px 0', border: 'none', borderRadius: 10,
            background: selectedGymId === 'myrnoho' ? '#E50914' : 'transparent',
            color: selectedGymId === 'myrnoho' ? '#fff' : '#666',
            fontWeight: 'bold', transition: 'all 0.3s'
          }}
        >
          вул. П. Мирного
        </button>
      </div>

      {/* ІНФО ПРО ЗАЛ */}
      <div style={{marginBottom: 20, padding: 15, background: '#111', borderRadius: 12, border: '1px dashed #333'}}>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: 8, color: '#aaa'}}>
          <FaMapMarkerAlt style={{marginRight: 10, color: '#E50914'}} />
          <span>{currentGym.address}</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', color: '#aaa'}}>
          <FaPhoneAlt style={{marginRight: 10, color: '#E50914'}} />
          <a href={`tel:${currentGym.phone}`} style={{color: '#aaa', textDecoration: 'none'}}>{currentGym.phone}</a>
        </div>
      </div>

      {/* СПИСОК ЦІН */}
      <div className="prices-list" style={{paddingBottom: 20}}>
        {currentGym.prices.map((item, index) => <PriceCard key={index} item={item} />)}
      </div>
    </div>
  );
};

export default SubscriptionsScreen;