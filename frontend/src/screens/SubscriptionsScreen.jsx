// src/screens/SubscriptionsScreen.jsx
import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import WebApp from '@twa-dev/sdk'; 

const API_URL = "https://gym-telegram-app.onrender.com";

const SubscriptionsScreen = ({ userId }) => {
  const [selectedGymId, setSelectedGymId] = useState('polubotka');
  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleBuy = async (priceItem) => {
    WebApp.HapticFeedback.impactOccurred('light');

    // Пряма покупка без перевірок
    if (!confirm(`Купити "${priceItem.title}"?`)) return;

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

  if (loading) return <div style={{textAlign: 'center', marginTop: 50}}>Завантаження...</div>;
  if (!gymData) return <div style={{textAlign: 'center', marginTop: 50}}>Помилка даних :(</div>;

  const currentGym = gymData[selectedGymId];

  const PriceCard = ({ item }) => (
    <div className="price-card" onClick={() => handleBuy(item)} style={{cursor: 'pointer'}}>
       <div className="price-header">
          <h3 className="price-title">{item.title}</h3>
          <p className="price-desc">{item.desc}</p>
       </div>
       <div className="price-values">
         <span className="price-amount">{item.local} ₴</span>
       </div>
    </div>
  );

  return (
    <div className="subscriptions-screen">
      <h2 className="screen-title">Абонементи</h2>
      <div className="gym-selector">
        <button className={`gym-toggle-btn ${selectedGymId === 'polubotka' ? 'active' : ''}`} onClick={() => setSelectedGymId('polubotka')}>вул. П.Полуботка</button>
      </div>
      <div className="gym-info-card">
        <div className="gym-info-row"><FaMapMarkerAlt className="gym-icon" /><span>{currentGym.address}</span></div>
      </div>
      <div className="prices-list">
        {currentGym.prices.map((item, index) => <PriceCard key={index} item={item} />)}
      </div>
    </div>
  );
};

export default SubscriptionsScreen;