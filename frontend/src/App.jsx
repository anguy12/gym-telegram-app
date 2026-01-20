// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import WebApp from '@twa-dev/sdk'; 

// Екрани
import LoginModal from './screens/LoginModal'; 
import SubscriptionsScreen from './screens/SubscriptionsScreen';
import TrainersScreen from './screens/TrainersScreen';
import MapScreen from './screens/MapScreen';

// Іконки
import { FiUser, FiUsers, FiMap } from 'react-icons/fi';
import { TbTag } from 'react-icons/tb';
import { FaClock } from 'react-icons/fa';

// 👇 ТВОЄ ПОСИЛАННЯ НА СЕРВЕР RENDER
const API_URL = "https://gym-telegram-app.onrender.com";

// --- HEADER (Клікабельний) ---
const Header = ({ name, avatar, onAvatarClick }) => (
  <div className="header">
    <div className="avatar-container" onClick={onAvatarClick} style={{cursor: 'pointer', border: '2px solid var(--accent-red)'}}>
      <img src={avatar} alt="Profile" className="avatar-img" />
    </div>
    <div className="header-text">
      <span style={{fontSize: 12, color: '#888'}}>Вітаємо,</span>
      <h1 className="greeting" style={{margin:0}}>{name}</h1>
    </div>
  </div>
);

// --- PROFILE SCREEN ---
const ProfileScreen = ({ user }) => {
  const { subscription } = user;
  
  return (
    <section className="section-margin">
      {subscription.active ? (
        <div className="sub-card glow-effect">
            <div className="sub-card-content">
                <h2 className="sub-title">{subscription.title}</h2>
                <div className="progress-label-row">
                  <span style={{fontSize: '12px', color: '#aaa'}}><FaClock style={{marginRight:5}}/>Термін дії</span>
                  <span style={{fontSize: '12px', color: '#fff'}}>{subscription.days_left} днів</span>
                </div>
                {/* Смужка прогресу */}
                <div className="progress-container" style={{height: '8px', marginTop: 10}}>
                   <div className="progress-bar-fill" style={{ width: '80%', background: 'var(--accent-red)' }} />
                </div>
            </div>
        </div>
      ) : (
        <div className="sub-card" style={{border: '1px dashed #555', background: 'transparent', textAlign: 'center', padding: 20}}>
            <h3 style={{color:'#888', margin:0}}>Ви у режимі Гостя 👀</h3>
            <p style={{fontSize: 13, color: '#666'}}>Натисніть на іконку зверху, щоб увійти за номером картки.</p>
        </div>
      )}
    </section>
  );
};

// --- MAIN APP ---
const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false); 
  
  // Початковий стан - Гість
  const [user, setUser] = useState({
    id: "guest",
    name: "Гість",
    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    subscription: { active: false }
  });

  // Перевіряємо пам'ять телефону при запуску
  useEffect(() => {
    if (WebApp.initData) { WebApp.ready(); WebApp.expand(); }
    
    const savedUser = localStorage.getItem('gym_user_data');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Успішний вхід
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('gym_user_data', JSON.stringify(userData)); 
    setShowLoginModal(false); 
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0: return <ProfileScreen user={user} />;
      case 1: return <SubscriptionsScreen userId={user.id} />;
      case 2: return <TrainersScreen />;
      case 3: return <MapScreen />;
      default: return <ProfileScreen user={user} />;
    }
  };

  return (
    <div className="app-container dark-mode">
      
      {/* 1. Header (Клік відкриває вхід) */}
      <div style={{padding: '20px 20px 0 20px'}}>
        <Header 
          name={user.name} 
          avatar={user.avatar} 
          onAvatarClick={() => setShowLoginModal(true)} 
        />
      </div>

      <div className="content-scrollable" style={{paddingTop: 10}}>
        {renderContent()}
      </div>

      {/* 2. Модальне вікно (якщо активно) */}
      {showLoginModal && (
        <LoginModal 
          apiUrl={API_URL}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 3. Навігація */}
      <div className="bottom-nav glow-top">
        <div className={`nav-item ${activeTab===0?'active':''}`} onClick={()=>setActiveTab(0)}><FiUser size={24}/><span className="nav-label">Профіль</span></div>
        <div className={`nav-item ${activeTab===1?'active':''}`} onClick={()=>setActiveTab(1)}><TbTag size={24}/><span className="nav-label">Ціни</span></div>
        <div className={`nav-item ${activeTab===2?'active':''}`} onClick={()=>setActiveTab(2)}><FiUsers size={24}/><span className="nav-label">Тренери</span></div>
        <div className={`nav-item ${activeTab===3?'active':''}`} onClick={()=>setActiveTab(3)}><FiMap size={24}/><span className="nav-label">Мапа</span></div>
      </div>
    </div>
  );
};

export default App;