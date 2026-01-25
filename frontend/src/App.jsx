// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css'; 
import WebApp from '@twa-dev/sdk'; 

import SubscriptionsScreen from './screens/SubscriptionsScreen';
import TrainersScreen from './screens/TrainersScreen';
import MapScreen from './screens/MapScreen';
import AdminScreen from './screens/AdminScreen'; // Екран адміна

import { FiUser, FiUsers, FiMap, FiSettings } from 'react-icons/fi';
import { TbTag } from 'react-icons/tb';
import { FaRunning, FaDumbbell, FaLeaf, FaMapMarkerAlt } from 'react-icons/fa';

const API_URL = "https://gym-telegram-app.onrender.com";

// 👇 ТУТ Я ВСТАВИВ ТВІЙ ID
const ADMIN_IDS = ["7696439716", "test_user_v6_date"]; 

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
  if (!user || !user.subscription) return <div style={{textAlign:'center', marginTop:50, color:'#666'}}>Завантаження...</div>;
  const { subscription } = user;
  
  const isSessionBased = subscription.type === "sessions";
  const total = isSessionBased ? subscription.sessions_total : subscription.days_total;
  const current = isSessionBased ? subscription.sessions_left : subscription.days_left;
  const label = isSessionBased ? "занять" : "днів";
  const percent = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;

  return (
    <div style={{padding: '0 5px'}}>
      {subscription.active ? (
        <div className="cyber-card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
             <div>
                <h2 style={{margin: '0 0 5px 0', fontSize: 24, fontWeight: '800', letterSpacing: 0.5}}>{subscription.title}</h2>
                <div style={{fontSize: 12, color: 'var(--neon-red)', display:'flex', alignItems:'center', marginBottom: 15}}>
                    <FaMapMarkerAlt size={10} style={{marginRight:5}}/>{subscription.gym_name || "Мережевий"}
                </div>
             </div>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }}><FaRunning color="white" size={18} style={{transform: 'scaleX(-1)'}} /></div></div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#aaa'}}><span>Залишилось:</span><span style={{color: '#fff', fontWeight: 'bold'}}>{current} з {total} {label}</span></div>
          <div style={{textAlign: 'right', fontSize: 11, color: '#666', marginTop: 6, borderTop: '1px solid #222', paddingTop: 6}}>Діє до <span style={{color: '#888'}}>{subscription.expiry_date}</span></div>
        </div>
      ) : (
        <div className="cyber-card" style={{textAlign: 'center', padding: '40px 20px'}}>
           <h3 style={{margin: '0 0 15px 0'}}>Немає абонемента</h3>
           <button onClick={onBuyClick} className="buy-btn-style">Придбати</button>
        </div>
      )}
      <h3 style={{fontSize: 18, margin: '30px 0 15px 0', color: '#fff', fontWeight: '700'}}>Мої записи</h3>
      <div className="booking-card">
         <div style={{width: 44, height: 44, background: '#222', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 15}}><FaDumbbell color="#fff" size={20}/></div>
         <div style={{flex: 1}}><h4 style={{margin: '0 0 4px 0', fontSize: 15, color: '#fff', fontWeight: '600'}}>Функціонал</h4><p style={{margin: 0, fontSize: 12, color: '#888'}}>Сьогодні, 18:00</p></div><button className="cancel-btn">Скасувати</button>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    try {
        if (WebApp.initData) { WebApp.ready(); WebApp.expand(); }
        const tgUser = WebApp.initDataUnsafe?.user;
        // Беремо реальний ID або тестовий, якщо ми в браузері
        const currentId = tgUser ? tgUser.id.toString() : "test_user_v6_date";
        setUserID(currentId);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (userID) {
      fetch(`${API_URL}/api/profile/${userID}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => {
            console.error(err);
            setUser({ name: "Гість", avatar: "", subscription: { active: false } });
        });
    }
  }, [userID]);

  // ПЕРЕВІРКА АДМІНА: Порівнюємо ID користувача з твоїм ID
  const isAdmin = userID && ADMIN_IDS.includes(userID.toString());

  const renderContent = () => {
    switch (activeTab) {
      case 0: return <ProfileScreen user={user} onBuyClick={() => setActiveTab(1)} />;
      case 1: return <SubscriptionsScreen userId={userID} />;
      case 2: return <TrainersScreen />;
      case 3: return <MapScreen />;
      case 4: return isAdmin ? <AdminScreen /> : <ProfileScreen user={user} />;
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
      <div className="content-scrollable" style={{padding: '0 20px'}}>{renderContent()}</div>
      
      <div className="bottom-nav">
        <div className={`nav-item ${activeTab===0?'active':''}`} onClick={()=>setActiveTab(0)}>
            <FiUser size={24} /> <span className="nav-label">Профіль</span>
        </div>
        <div className={`nav-item ${activeTab===1?'active':''}`} onClick={()=>setActiveTab(1)}>
            <TbTag size={24} /> <span className="nav-label">Абонементи</span>
        </div>
        <div className={`nav-item ${activeTab===2?'active':''}`} onClick={()=>setActiveTab(2)}>
            <FiUsers size={24} /> <span className="nav-label">Тренери</span>
        </div>
        <div className={`nav-item ${activeTab===3?'active':''}`} onClick={()=>setActiveTab(3)}>
            <FiMap size={24} /> <span className="nav-label">Інфо</span>
        </div>
        
        {/* Кнопка "Адмін" з'явиться тільки у тебе */}
        {isAdmin && (
            <div className={`nav-item ${activeTab===4?'active':''}`} onClick={()=>setActiveTab(4)} style={{color: 'var(--neon-red)'}}>
                <FiSettings size={24} /> <span className="nav-label">Адмін</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;