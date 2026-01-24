// src/screens/SubscriptionsScreen.jsx
import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
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

    if (!confirm(`Купити "${title}" за ${price} грн?`)) return;

    // --- ЛОГІКА ДНІВ ТА ЗАНЯТЬ (ВИПРАВЛЕНА) ---
    let sessionsCount = 999; // За замовчуванням безліміт занять
    let daysCount = 30;      // За замовчуванням 30 днів

    // Переводимо назву у верхній регістр для перевірки (щоб "РІЧНИЙ" і "Річний" працювали однаково)
    const upperTitle = priceItem.title.toUpperCase();

    // 1. Абонементи на кількість занять
    if (upperTitle.includes("12") || upperTitle.includes("РАНКОВИЙ")) {
        sessionsCount = 12;
    }
    if (upperTitle.includes("РАЗОВЕ")) { 
        sessionsCount = 1; 
        daysCount = 1; 
    }

    // 2. Довгострокові абонементи (Дні) - ТЕПЕР ПРАЦЮЄ КОРЕКТНО
    if (upperTitle.includes("3 МІСЯЦІ")) daysCount = 90;
    if (upperTitle.includes("ПІВРІЧНИЙ")) daysCount = 180;
    if (upperTitle.includes("РІЧНИЙ") || upperTitle.includes("РІК")) daysCount = 365;

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
        alert("Абонемент успішно активовано! 🚀");
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

  if (loading) return <div style={{textAlign:'center', marginTop:50, color:'#666'}}>Завантаження цін...</div>;
  if (!gymData) return <div style={{textAlign:'center', marginTop:50}}>Помилка</div>;

  const currentGym = gymData[selectedGymId];

  // КАРТКА ЦІНИ
  const PriceCard = ({ item }) => (
    <div style={{
        background: '#1a1a1a', marginBottom: 15, padding: 16, borderRadius: 16,
        border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: 12
    }}>
       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <h3 style={{margin: '0 0 5px 0', fontSize: 17, color: '#fff'}}>{item.title}</h3>
            <p style={{margin: 0, fontSize: 12, color: '#888'}}>{item.desc}</p>
          </div>
       </div>

       <div style={{display: 'flex', gap: 10, marginTop: 5}}>
         {/* ЛОКАЛЬНА ЦІНА */}
         <button onClick={() => handleBuy(item, 'local')} style={{
             flex: 1, padding: '12px', borderRadius: 12, 
             border: '1px solid #444', background: '#222', color: '#fff', cursor: 'pointer',
             display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
         }}>
            <span style={{fontSize: 10, color: '#aaa', marginBottom: 2}}>ТІЛЬКИ ЦЕЙ ЗАЛ</span>
            <span style={{fontWeight: 'bold', fontSize: 16}}>{item.local} ₴</span>
         </button>

         {/* МЕРЕЖЕВА ЦІНА (Якщо є) */}
         {item.network ? (
             <button onClick={() => handleBuy(item, 'network')} style={{
                 flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                 background: 'linear-gradient(45deg, #cc0000, #ff1f1f)', color: '#fff', cursor: 'pointer',
                 display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                 boxShadow: '0 4px 12px rgba(255, 31, 31, 0.3)'
             }}>
                <span style={{fontSize: 10, color: 'rgba(255,255,255,0.9)', marginBottom: 2}}>ВСЯ МЕРЕЖА</span>
                <span style={{fontWeight: 'bold', fontSize: 16}}>{item.network} ₴</span>
             </button>
         ) : (
             <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3}}>
                <span style={{fontSize: 10, color: '#666'}}>Тільки локально</span>
             </div>
         )}
       </div>
    </div>
  );

  return (
    <div className="subscriptions-screen">
      <h2 style={{fontSize: 24, marginBottom: 20, color:'#fff', fontWeight: '800'}}>Абонементи</h2>
      
      {/* ПЕРЕМИКАЧ ЗАЛІВ */}
      <div style={{
        background: '#111', padding: 5, borderRadius: 16, marginBottom: 25, display: 'flex', border: '1px solid #333'
      }}>
        {['polubotka', 'myrnoho'].map(gymId => (
             <button key={gymId}
                onClick={() => setSelectedGymId(gymId)}
                style={{
                    flex: 1, padding: '12px', border: 'none', borderRadius: 12,
                    background: selectedGymId === gymId ? '#2a2a2a' : 'transparent',
                    color: selectedGymId === gymId ? '#fff' : '#666',
                    fontWeight: 'bold', transition: 'all 0.2s', fontSize: 13
                }}
             >
                {gymId === 'polubotka' ? 'Полуботка' : 'П. Мирного'}
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