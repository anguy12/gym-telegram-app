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
    WebApp.HapticFeedback.impactOccurred('medium');
    if (!confirm(`Придбати "${priceItem.title}"?`)) return;

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
        alert("Оплата пройшла успішно! Ласкаво просимо ✅");
        window.location.reload(); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/gyms`)
      .then(res => res.json())
      .then(data => { setGymData(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: 50, color: '#666'}}>Завантаження цін...</div>;
  if (!gymData) return <div style={{textAlign: 'center', marginTop: 50}}>Помилка даних :(</div>;

  const currentGym = gymData[selectedGymId];

  // Картка ціни (Преміум стиль)
  const PriceCard = ({ item }) => (
    <div onClick={() => handleBuy(item)} 
         style={{
           background: 'linear-gradient(145deg, #1e1e1e, #141414)', // Легкий градієнт
           marginBottom: 12, padding: '16px', borderRadius: 16,
           display: 'flex', justifyContent: 'space-between', alignItems: 'center',
           border: '1px solid #2a2a2a', cursor: 'pointer',
           boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
         }}>
       <div>
          <h3 style={{margin: '0 0 4px 0', fontSize: 16, color: '#fff', fontWeight: '600'}}>{item.title}</h3>
          <p style={{margin: 0, fontSize: 12, color: '#888'}}>{item.desc}</p>
       </div>
       <div style={{textAlign: 'right'}}>
         <div style={{
           background: 'rgba(255, 51, 51, 0.1)', color: '#ff3333', padding: '8px 14px', 
           borderRadius: 12, fontWeight: '700', fontSize: 15, border: '1px solid rgba(255, 51, 51, 0.2)'
         }}>
           {item.local} ₴
         </div>
       </div>
    </div>
  );

  return (
    <div className="subscriptions-screen">
      <h2 style={{fontSize: 26, marginBottom: 20, fontWeight: '700'}}>Оберіть план</h2>
      
      {/* СТИЛЬНИЙ ПЕРЕМИКАЧ (КАПСУЛА) */}
      <div style={{
        background: '#1a1a1a', padding: 5, borderRadius: 16, marginBottom: 25,
        display: 'flex', border: '1px solid #333'
      }}>
        <button 
          onClick={() => setSelectedGymId('polubotka')}
          style={{
            flex: 1, padding: '12px 0', border: 'none', borderRadius: 12,
            background: selectedGymId === 'polubotka' ? '#333' : 'transparent',
            color: selectedGymId === 'polubotka' ? '#fff' : '#666',
            fontWeight: '600', fontSize: 13, transition: 'all 0.2s',
            boxShadow: selectedGymId === 'polubotka' ? '0 4px 10px rgba(0,0,0,0.3)' : 'none'
          }}
        >
          Полуботка
        </button>
        <button 
          onClick={() => setSelectedGymId('myrnoho')}
          style={{
            flex: 1, padding: '12px 0', border: 'none', borderRadius: 12,
            background: selectedGymId === 'myrnoho' ? '#333' : 'transparent',
            color: selectedGymId === 'myrnoho' ? '#fff' : '#666',
            fontWeight: '600', fontSize: 13, transition: 'all 0.2s',
            boxShadow: selectedGymId === 'myrnoho' ? '0 4px 10px rgba(0,0,0,0.3)' : 'none'
          }}
        >
          П. Мирного
        </button>
      </div>

      <div style={{paddingBottom: 20}}>
        {currentGym.prices.map((item, index) => <PriceCard key={index} item={item} />)}
      </div>
    </div>
  );
};

export default SubscriptionsScreen;