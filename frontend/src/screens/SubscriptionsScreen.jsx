// src/screens/SubscriptionsScreen.jsx
import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import WebApp from '@twa-dev/sdk'; // Для вібрації

const SubscriptionsScreen = ({ userId }) => {
  const [selectedGymId, setSelectedGymId] = useState('polubotka');
  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функція купівлі
  const handleBuy = async (priceItem) => {
    // Телеграмна вібрація при натисканні
    WebApp.HapticFeedback.impactOccurred('light');

    if (!confirm(`Купити "${priceItem.title}"?`)) return;

    // Логіка визначення типу абонемента
    let sessionsCount = 30; 
    if (priceItem.title.includes("12") || priceItem.title.includes("Ранковий")) {
      sessionsCount = 12;
    } else if (priceItem.title.includes("Безлім") || priceItem.title.includes("Річний") || priceItem.title.includes("Піврічний") || priceItem.title.includes("3 Місяці")) {
      sessionsCount = 9999; 
    } else if (priceItem.title.includes("Разове")) {
        sessionsCount = 1;
    }

    let daysCount = 30;
    if (priceItem.title.includes("3 Місяці")) daysCount = 90;
    if (priceItem.title.includes("Піврічний")) daysCount = 180;
    if (priceItem.title.includes("Річний")) daysCount = 365;
    if (priceItem.title.includes("Разове")) daysCount = 1;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId, // Використовуємо ID з Телеграму
          title: priceItem.title,
          days: daysCount,
          sessions: sessionsCount
        })
      });
      
      if (response.ok) {
        WebApp.HapticFeedback.notificationOccurred('success'); // Вібрація успіху
        alert("Успішно! ✅");
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Помилка купівлі:", error);
      WebApp.HapticFeedback.notificationOccurred('error');
    }
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/gyms')
      .then(res => res.json())
      .then(data => {
        setGymData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Помилка:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: 50}}>Завантаження цін...</div>;
  if (!gymData) return <div style={{textAlign: 'center', marginTop: 50}}>Помилка даних :(</div>;

  const currentGym = gymData[selectedGymId];

  const PriceCard = ({ item }) => (
    <div className="price-card" onClick={() => handleBuy(item)} style={{cursor: 'pointer'}}>
       <div className="price-header">
          <h3 className="price-title">{item.title}</h3>
          <p className="price-desc">{item.desc}</p>
       </div>
       <div className="price-values">
         <div className="price-option">
           <span className="price-label">Купити</span>
           <span className="price-amount">{item.local} ₴</span>
         </div>
         {item.network && (
            <>
              <div className="price-divider"></div>
              <div className="price-option highlight">
                <span className="price-label">Мережа</span>
                <span className="price-amount">{item.network} ₴</span>
              </div>
            </>
         )}
       </div>
    </div>
  );

  return (
    <div className="subscriptions-screen">
      <h2 className="screen-title">Абонементи</h2>
      
      <div className="gym-selector">
        <button 
          className={`gym-toggle-btn ${selectedGymId === 'polubotka' ? 'active' : ''}`}
          onClick={() => setSelectedGymId('polubotka')}
        >
          вул. П.Полуботка
        </button>
        <button 
          className={`gym-toggle-btn ${selectedGymId === 'myrnoho' ? 'active' : ''}`}
          onClick={() => setSelectedGymId('myrnoho')}
        >
          вул. П.Мирного
        </button>
      </div>

      <div className="gym-info-card">
        <div className="gym-info-row">
          <FaMapMarkerAlt className="gym-icon" />
          <span>{currentGym.address}</span>
        </div>
        <div className="gym-info-row">
          <FaPhoneAlt className="gym-icon" />
          <a href={`tel:${currentGym.phone.replace(/\s/g, '')}`} className="gym-link">{currentGym.phone}</a>
        </div>
      </div>

      <div className="prices-list">
        {currentGym.prices.map((item, index) => (
          <PriceCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsScreen;