import React, { useState, useEffect } from 'react';
import { FaQrcode, FaBolt, FaHistory, FaUserCircle, FaMapMarkerAlt, FaDumbbell } from 'react-icons/fa';

const API_URL = "https://gym-telegram-app.onrender.com";

const HomeScreen = ({ onAdminClick }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // 1. Ініціалізація Телеграм
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#000000'); 
    
    // 2. ОТРИМУЄМО ДАНІ З ТЕЛЕГРАМУ (Аватар, Нік, Ім'я)
    const tgUser = tg.initDataUnsafe?.user;
    const userId = tgUser?.id || "7696439716"; 
    
    // Формуємо дані для синхронізації
    let fullName = tgUser ? `${tgUser.first_name} ${tgUser.last_name || ""}`.trim() : "";
    let username = tgUser?.username || "";
    let photoUrl = tgUser?.photo_url || ""; // <--- Оце посилання на реальну аватарку

    // 3. Відправляємо це на сервер
    const queryParams = new URLSearchParams({
        name: fullName,
        username: username,
        avatar: photoUrl 
    });

    fetch(`${API_URL}/api/profile/${userId}?${queryParams.toString()}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(console.error);
  }, []);

  if (!user) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#666', background:'#000'}}>Завантаження...</div>;

  const sub = user.subscription || {};
  const active = sub.active;

  // Логіка прогресу
  let progressPercent = 0;
  let progressText = "";
  
  if (active) {
      if (sub.type === 'sessions') {
          const total = sub.sessions_total || 12;
          const left = sub.sessions_left || 0;
          progressPercent = (left / total) * 100;
          progressText = `${left} із ${total} занять`;
      } else {
          const total = sub.days_total || 30;
          const left = sub.days_left || 0;
          progressPercent = (left / total) * 100;
          progressText = `${left} днів`;
      }
      progressPercent = Math.min(100, Math.max(0, progressPercent));
  }

  return (
    <div className="app-wrapper" style={{background: '#000', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'Inter, sans-serif'}}>
      
      {/* ХЕДЕР */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 24}}>
        <div style={{display:'flex', alignItems:'center', gap: 12}}>
           
           {/* АВАТАРКА: Показуємо реальну, якщо вона прийшла з сервера */}
           {user.avatar ? 
             <img src={user.avatar} style={{width:50, height:50, borderRadius:'50%', objectFit:'cover', border:'2px solid #333'}} alt="avatar"/> : 
             <FaUserCircle size={50} color="#333" />
           }
           
           <div>
               <div style={{fontSize: 20, fontWeight: 700, lineHeight: 1.2}}>
                   Привіт, {user.name.split(' ')[0]}!
               </div>
               
               {/* 🔥 ID (Зробив його стильним та помітним) */}
               <div style={{
                   fontSize: 12, 
                   color: '#bbb', 
                   marginTop: 5, 
                   fontFamily: 'monospace',
                   background: '#1a1a1a', // Темно-сіра плашка
                   padding: '3px 8px',
                   borderRadius: 6,
                   display: 'inline-block',
                   border: '1px solid #333'
               }}>
                  ID: {user.id}
               </div>
           </div>
        </div>
        
        {/* Кнопка Адмінки */}
        <div onClick={onAdminClick} style={{cursor:'pointer', padding: 10}}>
           <FaUserCircle size={24} color="#666" />
        </div>
      </div>

      {/* КАРТКА АБОНЕМЕНТА */}
      <div style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #000000 100%)',
          borderRadius: 24, padding: 24, position: 'relative',
          border: '1px solid #333', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', marginBottom: 30
      }}>
         <div style={{position:'absolute', top: 20, left: 0, width: 4, height: 40, background: '#ff0000', borderTopRightRadius: 4, borderBottomRightRadius: 4}}></div>
         <div style={{position:'absolute', bottom: 20, right: 0, width: 4, height: 40, background: '#ff0000', borderTopLeftRadius: 4, borderBottomLeftRadius: 4}}></div>

         <div style={{marginBottom: 25}}>
             <h2 style={{fontSize: 28, fontWeight: 800, margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: 1}}>
                 {active ? sub.title : "НЕМАЄ АБОНЕМЕНТА"}
             </h2>
             {active && (
                 <div style={{display:'flex', alignItems:'center', gap: 6, color: '#ff0000', fontSize: 13, fontWeight: 600}}>
                    <FaMapMarkerAlt /> {sub.gym_name || "МЕРЕЖА"}
                 </div>
             )}
         </div>

         {active && (
           <div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom: 8, fontSize: 13, fontWeight: 600}}>
                  <span style={{color: '#fff'}}>Залишок</span>
                  <span style={{color: '#ff0000'}}>{progressText}</span>
              </div>
              <div style={{height: 10, background: '#333', borderRadius: 6, overflow: 'hidden', position: 'relative'}}>
                  <div style={{width: `${progressPercent}%`, height: '100%', background: '#ff0000', borderRadius: 6, transition: 'width 1s ease'}}></div>
              </div>
              <div style={{textAlign: 'right', marginTop: 8, fontSize: 12, color: '#666'}}>
                  Діє до <span style={{color: '#fff'}}>{sub.expiry_date}</span>
              </div>
           </div>
         )}
      </div>

      {/* НИЖНЄ МЕНЮ */}
      <div style={{position: 'fixed', bottom: 20, left: 20, right: 20, background: '#111', border: '1px solid #333', borderRadius: 20, height: 60, display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
          <div style={{color: '#ff0000', display:'flex', flexDirection:'column', alignItems:'center', fontSize: 10, gap: 4}}><FaUserCircle size={20}/> <span>Профіль</span></div>
          <div style={{color: '#666', display:'flex', flexDirection:'column', alignItems:'center', fontSize: 10, gap: 4}}><FaQrcode size={20}/> <span>Абонементи</span></div>
          <div style={{color: '#666', display:'flex', flexDirection:'column', alignItems:'center', fontSize: 10, gap: 4}}><FaBolt size={20}/> <span>Тренери</span></div>
          <div style={{color: '#666', display:'flex', flexDirection:'column', alignItems:'center', fontSize: 10, gap: 4}}><FaHistory size={20}/> <span>Інфо</span></div>
      </div>
    </div>
  );
};

export default HomeScreen;