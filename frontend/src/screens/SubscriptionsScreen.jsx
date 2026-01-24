// src/screens/SubscriptionsScreen.jsx
import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import WebApp from '@twa-dev/sdk'; 

const API_URL = "https://gym-telegram-app.onrender.com";

const SubscriptionsScreen = ({ userId }) => {
  const [selectedGymId, setSelectedGymId] = useState('polubotka');
  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);

  // type = 'local' або 'network'
  const handleBuy = async (priceItem, type) => {
    WebApp.HapticFeedback.impactOccurred('medium');
    
    const price = type === 'network' ? priceItem.network : priceItem.local;
    const title = type === 'network' ? `${priceItem.title} (Мережа)` : priceItem.title;

    if (!confirm(`Придбати "${title}" за ${price} грн?`)) return;

    // Логіка визначення типу абонемента
    let sessionsCount = 30; // Умовно для безліміту
    let daysCount = 30;
    
    // Якщо в назві є цифра 12 або 8, то це кількість занять
    if (priceItem.title.includes("12")) sessionsCount = 12;
    if (priceItem.title.includes("8")) sessionsCount = 8;
    
    // Якщо це безліміт - ставимо багато сесій
    if (priceItem.title.includes("Безлім") || priceItem.title.includes("Річний")) sessionsCount = 999;
    if (priceItem.title.includes("Річний")) daysCount = 365;

    try {
      const response = await fetch(`${API_URL}/api/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          title: title,
          days: daysCount,
          sessions: sessionsCount,
          gym_id: selectedGymId,
          is_network: type === 'network'
        })
      });
      
      if (response.ok) {
        WebApp.HapticFeedback.notificationOccurred('success'); 
        alert("Успішно! ✅");
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
      .catch(err => { setLoading(false); });
  }, []);

  if (loading) return <div style={{textAlign:'center', marginTop:50, color:'#666'}}>Завантаження...</div>;
  if (!gymData) return <div style={{textAlign:'center', marginTop:50}}>Помилка</div>;

  const currentGym = gymData[selectedGymId];

  // КАРТКА ЦІНИ З ДВОМА КНОПКАМИ (Локал / Мережа)
  const PriceCard = ({ item }) => (
    <div style={{
        background: '#1a1a1a', marginBottom: 15, padding: 15, borderRadius: 16,
        border: '1px solid #333', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
    }}>
       <div style={{marginBottom: 10}}>
          <h3 style={{margin: '0 0 5px 0', fontSize: 17, color: '#fff'}}>{item.title}</h3>
          <p style={{margin: 0, fontSize: 12, color: '#888'}}>{item.desc}</p>
       </div>

       <div style={{display: 'flex', gap: 10}}>
         {/* Локальна ціна */}
         <button onClick={() => handleBuy(item, 'local')} style={{
             flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #444',
             background: 'transparent', color: '#fff', cursor: 'pointer'
         }}>
            <div style={{fontSize: 10, color: '#888'}}>Цей зал</div>
            <div style={{fontWeight: 'bold', fontSize: 14}}>{item.local} ₴</div>
         </button>

         {/* Мережева ціна (якщо є) */}
         {item.network && (
             <button onClick={() => handleBuy(item, 'network')} style={{
                 flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                 background: 'var(--neon-red)', color: '#fff', cursor: 'pointer'
             }}>
                <div style={{fontSize: 10, color: 'rgba(255,255,255,0.8)'}}>Мережа</div>
                <div style={{fontWeight: 'bold', fontSize: 14}}>{item.network} ₴</div>
             </button>
         )}
       </div>
    </div>
  );

  return (
    <div className="subscriptions-screen">
      <h2 style={{fontSize: 24, marginBottom: 20, color:'#fff'}}>Ціни клубу</h2>
      
      {/* ПЕРЕМИКАЧ ЗАЛІВ */}
      <div style={{
        background: '#1a1a1a', padding: 4, borderRadius: 14, marginBottom: 20, display: 'flex'
      }}>
        {['polubotka', 'myrnoho'].map(gymId => (
             <button key={gymId}
                onClick={() => setSelectedGymId(gymId)}
                style={{
                    flex: 1, padding: '10px', border: 'none', borderRadius: 10,
                    background: selectedGymId === gymId ? '#333' : 'transparent',
                    color: selectedGymId === gymId ? '#fff' : '#666',
                    fontWeight: 'bold', transition: 'all 0.2s'
                }}
             >
                {gymId === 'polubotka' ? 'Полуботка' : 'Мирного'}
             </button>
        ))}
      </div>

      <div style={{paddingBottom: 20}}>
        {currentGym.prices.map((item, index) => <PriceCard key={index} item={item} />)}
      </div>
    </div>
  );
};

export default SubscriptionsScreen;