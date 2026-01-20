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
import { FaClock, FaDumbbell } from 'react-icons/fa';

// 👇 ТВОЯ АДРЕСА
const API_URL = "https://gym-telegram-app.onrender.com";

const Header = ({ name, avatar }) => (
  <div className="header">
    <div className="avatar-container">
      <img src={avatar || "https://i.pravatar.cc/150"} alt="Avatar" className="avatar-img" />
    </div>
    <div className="header-text">
      <h1 className="greeting" style={{margin:0}}>Привіт, {name}!</h1>
    </div>
  </div>
);

const ProfileScreen = ({ user }) => {
  if (!user) return <div style={{textAlign:'center', marginTop:50}}>Завантаження...</div>;
  const { subscription } = user;
  
  return (
    <section className="section-margin">
      {subscription && subscription.active ? (
        <div className="sub-card glow-effect">
            <div className="sub-card-content">
                <h2 className="sub-title">{subscription.title}</h2>
                <div className="progress-label-row">
                  <span style={{fontSize: '12px', color: '#aaa'}}><FaClock style={{marginRight:5}}/>Термін дії</span>
                  <span style={{fontSize: '12px', color: '#fff'}}>{subscription.days_left} днів</span>
                </div>
                <div className="progress-container" style={{height: '8px', marginTop: 10}}>
                   <div className="progress-bar-fill" style={{ width: '80%', background: 'var(--accent-red)' }} />
                </div>
            </div>
        </div>
      ) : (
        <div className="sub-card" style={{border: '1px dashed #555', background: 'transparent', textAlign: 'center', padding: 20}}>
            <h3 style={{color:'#888', margin:0}}>Немає абонемента 😢</h3>
            <p style={{fontSize: 13, color: '#666'}}>Перейдіть у вкладку "Ціни", щоб купити.</p>
        </div>
      )}
    </section>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);

  // 1. Автоматичний вхід (без паролів)
  useEffect(() => {
    if (WebApp.initData) { WebApp.ready(); WebApp.expand(); }
    
    // Беремо ID з телеграму АБО ставимо тестовий ID для браузера
    const tgUser = WebApp.initDataUnsafe?.user;
    const currentId = tgUser ? tgUser.id.toString() : "test_user_1";
    
    setUserID(currentId);
  }, []);

  // 2. Завантаження даних
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
      case 0: return <ProfileScreen user={user} />;
      case 1: return <SubscriptionsScreen userId={userID} />;
      case 2: return <TrainersScreen />;
      case 3: return <MapScreen />;
      default: return <ProfileScreen user={user} />;
    }
  };

  return (
    <div className="app-container dark-mode">
      {user && (
        <div style={{padding: '20px 20px 0 20px'}}>
          <Header name={user.name} avatar={user.avatar} />
        </div>
      )}

      <div className="content-scrollable" style={{paddingTop: 10}}>
        {renderContent()}
      </div>

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