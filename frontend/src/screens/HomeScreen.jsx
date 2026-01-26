import React, { useState, useEffect } from 'react';
import { FaQrcode, FaBolt, FaHistory, FaUserCircle, FaMapMarkerAlt, FaDumbbell } from 'react-icons/fa';

const API_URL = "https://gym-telegram-app.onrender.com";

const HomeScreen = ({ onAdminClick }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#000000'); 
    
    const userId = tg.initDataUnsafe?.user?.id || "7696439716";
    fetch(`${API_URL}/api/profile/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(console.error);
  }, []);

  if (!user) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#666', background:'#000'}}>Завантаження...</div>;

  const sub = user.subscription || {};
  const active = sub.active;

  // 🔥 РОЗУМНА ЛОГІКА ПРОГРЕСУ
  let progressPercent = 0;
  let progressText = "";
  
  if (active) {
      if (sub.type === 'sessions') {
          // ЛОГІКА ДЛЯ ЗАНЯТЬ (Ігноруємо дні для смужки)
          const total = sub.sessions_total || 12; // Скільки було куплено
          const left = sub.sessions_left || 0;    // Скільки залишилось
          progressPercent = (left / total) * 100;
          progressText = `${left} із ${total} занять`;
      } else {
          // ЛОГІКА ДЛЯ БЕЗЛІМІТУ (Дні)
          const total = sub.days_total || 30;
          const left = sub.days_left || 0;
          progressPercent = (left / total) * 100;
          progressText = `${left} днів`;
      }
      
      // Обмеження 0-100%
      progressPercent = Math.min(100, Math.max(0, progressPercent));
  }

  return (
    <div className="app-wrapper" style={{background: '#000', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'Inter, sans-serif'}}>
      
      {/* ХЕДЕР */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 24}}>
        <div style={{display:'flex', alignItems:'center', gap: 12}}>
           {user.avatar ? 
             <img src={user.avatar} style={{width:45, height:45, borderRadius:'50%', border:'2px solid #333'}} alt="avatar"/> : 
             <FaUserCircle size={45} color="#333" />
           }
           <div>
               <div style={{fontSize: 20, fontWeight: 700}}>Привіт, {user.name}!</div>
           </div>
        </div>
        <div onClick={onAdminClick} style={{cursor:'pointer', padding: 10}}>
           <FaUserCircle size={24} color="#666" />
        </div>
      </div>

      {/* ЧЕРВОНА КАРТКА */}
      <div style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #000000 100%)',
          borderRadius: 24,
          padding: 24,
          position: 'relative',
          border: '1px solid #333',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          marginBottom: 30
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

         {/* 🔥 СМУЖКА + ЛІЧИЛЬНИКИ */}
         {active && (
           <div>
              {/* Верхній рядок: Цифри залишку */}
              <div style={{display:'flex', justifyContent:'space-between', marginBottom: 8, fontSize: 13, fontWeight: 600}}>
                  <span style={{color: '#fff'}}>Залишок</span>
                  <span style={{color: '#ff0000'}}>{progressText}</span>
              </div>

              {/* Сама смужка */}
              <div style={{height: 10, background: '#333', borderRadius: 6, overflow: 'hidden', position: 'relative'}}>
                  <div style={{
                      width: `${progressPercent}%`, 
                      height: '100%', 
                      background: '#ff0000',
                      boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
                      transition: 'width 1s ease-out',
                      borderRadius: 6
                  }}></div>
              </div>

              {/* Нижній рядок: Дата закінчення */}
              <div style={{textAlign: 'right', marginTop: 8, fontSize: 12, color: '#666'}}>
                  Діє до <span style={{color: '#fff'}}>{sub.expiry_date}</span>
              </div>
           </div>
         )}
      </div>

      {/* ЗАПИСИ */}
      <h3 style={{fontSize: 18, marginBottom: 15}}>Мої записи</h3>
      <div style={{background: '#111', borderRadius: 16, padding: 15, display:'flex', justifyContent:'space-between', alignItems:'center', border: '1px solid #222'}}>
          <div style={{display:'flex', alignItems:'center', gap: 15}}>
             <div style={{width: 40, height: 40, background: '#222', borderRadius: 10, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <FaDumbbell color="#666"/>
             </div>
             <div>
                 <div style={{fontWeight: 600}}>Функціонал</div>
                 <div style={{fontSize: 12, color: '#666'}}>Сьогодні, 18:00</div>
             </div>
          </div>
          <button style={{background: 'rgba(255, 0, 0, 0.1)', color: '#ff0000', border: 'none', padding: '8px 12px', borderRadius: 8, fontSize: 12, cursor:'pointer'}}>
             Скасувати
          </button>
      </div>

      {/* НИЖНЄ МЕНЮ */}
      <div style={{
          position: 'fixed', bottom: 20, left: 20, right: 20, 
          background: '#111', border: '1px solid #333', 
          borderRadius: 20, height: 60, 
          display: 'flex', justifyContent: 'space-around', alignItems: 'center'
      }}>
          <div style={{color: '#ff0000', display:'flex', flexDirection:'column', alignItems:'center', fontSize: 10, gap: 4}}>
             <FaUserCircle size={20}/> <span>Профіль</span>
          </div>
          <div style={{color: '#666', display:'flex', flexDirection:'column', alignItems:'center', fontSize: 10, gap: 4}}>
             <FaQrcode size={20}/> <span>Абонементи</span>
          </div>
          <div style={{color: '#666', display:'flex', flexDirection:'column', alignItems:'center', fontSize: 10, gap: 4}}>
             <FaBolt size={20}/> <span>Тренери</span>
          </div>
          <div style={{color: '#666', display:'flex', flexDirection:'column', alignItems:'center', fontSize: 10, gap: 4}}>
             <FaHistory size={20}/> <span>Інфо</span>
          </div>
      </div>

    </div>
  );
};

export default HomeScreen;