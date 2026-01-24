// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css'; 
import WebApp from '@twa-dev/sdk'; 

// Екрани
import SubscriptionsScreen from './screens/SubscriptionsScreen';
import TrainersScreen from './screens/TrainersScreen';
import MapScreen from './screens/MapScreen';

// Іконки
import { FiUser, FiUsers, FiMap } from 'react-icons/fi';
import { TbTag } from 'react-icons/tb';
import { FaRunning, FaDumbbell } from 'react-icons/fa';
import { MdSelfImprovement } from 'react-icons/md';

const API_URL = "https://gym-telegram-app.onrender.com";

const Header = ({ name, avatar }) => (
  <div style={{display: 'flex', alignItems: 'center', marginBottom: 30, padding: '10px 5px'}}>
    <div style={{
      width: 50, height: 50, borderRadius: '50%', overflow: 'hidden', 
      border: '2px solid #333', marginRight: 15
    }}>
      <img src={avatar || "https://i.pravatar.cc/150"} alt="Avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
    <h1 style={{fontSize: 22, fontWeight: '700', margin: 0, color: '#fff'}}>Привіт, {name}!</h1>
  </div>
);

const ProfileScreen = ({ user, onBuyClick }) => {
  if (!user) return <div style={{textAlign:'center', marginTop:50, color:'#666'}}>Завантаження...</div>;
  const { subscription } = user;
  
  // Розрахунок смужки
  const percent = subscription.days_total > 0 
    ? Math.min(100, Math.max(0, (subscription.days_left / subscription.days_total) * 100))
    : 0;

  return (
    <div style={{padding: '0 5px'}}>
      
      {/* 🔴 КАРТКА АБОНЕМЕНТА */}
      {subscription && subscription.active ? (
        <div className="cyber-card">
          <h2 style={{margin: '0 0 5px 0', fontSize: 24, fontWeight: '800', letterSpacing: 0.5}}>
            {subscription.title || "GOLD Абонемент"}
          </h2>

          {/* Смужка прогресу */}
          <div className="progress-track">
             <div className="progress-fill" style={{ width: `${percent}%` }}>
                {/* Іконка бігуна всередині смужки */}
                <FaRunning color="white" size={18} style={{transform: 'scaleX(-1)'}} /> 
             </div>
          </div>

          <p style={{color: '#aaa', fontSize: 14, margin: 0}}>
             Залишилось: <span style={{color: '#fff', fontWeight: 'bold'}}>{subscription.days_left} занять (до {subscription.expiry_date})</span>
          </p>
          
          {/* Декор: крапки внизу картки як на фото */}
          <div style={{display:'flex', justifyContent:'center', gap:5, marginTop: 15}}>
             <div style={{width: 6, height: 6, borderRadius: '50%', background: '#ff1f1f'}}></div>
             <div style={{width: 6, height: 6, borderRadius: '50%', background: '#333'}}></div>
             <div style={{width: 6, height: 6, borderRadius: '50%', background: '#333'}}></div>
          </div>
        </div>
      ) : (
        <div className="cyber-card" style={{textAlign: 'center', padding: '40px 20px'}}>
           <h3 style={{margin: '0 0 15px 0'}}>Немає абонемента</h3>
           <button onClick={onBuyClick} className="buy-btn-style">Придбати</button>
        </div>
      )}

      {/* 🔴 СЕКЦІЯ "МОЇ ЗАПИСИ" */}
      <h3 style={{fontSize: 18, margin: '30px 0 15px 0', color: '#fff', fontWeight: '700'}}>Мої записи</h3>
      
      {/* Запис 1 */}
      <div className="booking-card">
         <div style={{
           width: 44, height: 44, background: '#222', borderRadius: '12px', 
           display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 15
         }}>
            <FaDumbbell color="#fff" size={20}/>
         </div>
         <div style={{flex: 1}}>
            <h4 style={{margin: '0 0 4px 0', fontSize: 15, color: '#fff', fontWeight: '600'}}>Функціональний тренінг</h4>
            <p style={{margin: 0, fontSize: 12, color: '#888'}}>Сьогодні, 18:00 • Тренер: Іван П.</p>
         </div>
         <button className="cancel-btn">Скасувати</button>
      </div>

      {/* Запис 2 */}
      <div className="booking-card">
         <div style={{
           width: 44, height: 44, background: '#222', borderRadius: '12px', 
           display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 15
         }}>
            <MdSelfImprovement color="#fff" size={22}/>
         </div>
         <div style={{flex: 1}}>
            <h4 style={{margin: '0 0 4px 0', fontSize: 15, color: '#fff', fontWeight: '600'}}>Йога (Розтяжка)</h4>
            <p style={{margin: 0, fontSize: 12, color: '#888'}}>Завтра, 09:30 • Тренер: Олена М.</p>
         </div>
         <button className="cancel-btn">Скасувати</button>
      </div>

    </div>
  );
};

// --- ГОЛОВНИЙ ДОДАТОК ---
const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    if (WebApp.initData) { WebApp.ready(); WebApp.expand(); }
    const tgUser = WebApp.initDataUnsafe?.user;
    const currentId = tgUser ? tgUser.id.toString() : "test_user_img_ref_v2";
    setUserID(currentId);
  }, []);

  useEffect(() => {
    if (userID) {
      fetch(`${API_URL}/api/profile/${userID}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error(err));
    }
  }, [userID]);

  const renderContent = () => {
    switch (activeTab) {
      case 0: return <ProfileScreen user={user} onBuyClick={() => setActiveTab(1)} />;
      case 1: return <SubscriptionsScreen userId={userID} />;
      case 2: return <TrainersScreen />;
      case 3: return <MapScreen />;
      default: return <ProfileScreen user={user} />;
    }
  };

  return (
    <div className="app-container">
      {user && activeTab === 0 && (
        <div style={{padding: '20px 20px 0 20px'}}>
          <Header name={user.name} avatar={user.avatar} />
        </div>
      )}

      <div className="content-scrollable" style={{padding: '0 20px'}}>
        {renderContent()}
      </div>

      <div className="bottom-nav">
        {[
            {icon: FiUser, l: 'Профіль'}, 
            {icon: TbTag, l: 'Абонементи'}, 
            {icon: FiUsers, l: 'Тренери'}, 
            {icon: FiMap, l: 'Завантаженість'}
        ].map((item, i) => (
            <div key={i} className={`nav-item ${activeTab===i?'active':''}`} onClick={()=>setActiveTab(i)}>
               <item.icon size={24} />
               <span className="nav-label">{item.l}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default App;