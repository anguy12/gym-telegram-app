// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import WebApp from '@twa-dev/sdk'; 
import SubscriptionsScreen from './screens/SubscriptionsScreen';
import TrainersScreen from './screens/TrainersScreen';
import MapScreen from './screens/MapScreen';
import { FiUser, FiUsers, FiMap } from 'react-icons/fi';
import { TbTag } from 'react-icons/tb';
import { FaRunning, FaClock, FaDumbbell } from 'react-icons/fa';
import { MdFitnessCenter, MdSelfImprovement } from 'react-icons/md';
import { upcomingWorkouts } from './data/gymData'; 

// 👇 ГОЛОВНЕ: Посилання на твій сервер
const API_URL = "https://gym-telegram-app.onrender.com";

const Header = ({ name, avatar }) => (
  <div className="header">
    <div className="avatar-container">
      <img src={avatar || "https://i.pravatar.cc/150"} alt="Avatar" className="avatar-img" />
    </div>
    <h1 className="greeting">Привіт, {name}!</h1>
  </div>
);

const ProfileScreen = ({ user, onBuyClick }) => {
  if (!user) return <div style={{textAlign:'center', marginTop: 50}}>Завантаження профілю...</div>;

  const { subscription } = user;
  const timePercent = subscription.days_total > 0 ? (subscription.days_left / subscription.days_total) * 100 : 0;
  const sessionsPercent = subscription.sessions_total > 0 ? (subscription.sessions_left / subscription.sessions_total) * 100 : 0;

  return (
    <>
      <Header name={user.name} avatar={user.avatar} />
      <section className="section-margin">
        {subscription.active ? (
          <div className="sub-card glow-effect">
              <div className="sub-card-content">
                  <h2 className="sub-title" style={{marginBottom: '15px'}}>{subscription.title}</h2>
                  <div className="progress-label-row">
                    <span style={{fontSize: '12px', color: '#aaa'}}><FaClock style={{marginRight:5}}/>Термін дії</span>
                    <span style={{fontSize: '12px', color: '#fff'}}>{subscription.days_left} днів (до {subscription.expiry_date})</span>
                  </div>
                  <div className="progress-container" style={{height: '8px', marginBottom: '15px'}}>
                    <div className="progress-bar-fill" style={{ width: `${timePercent}%`, background: 'var(--accent-red)' }} />
                  </div>
                  {!subscription.is_unlimited && (
                    <>
                      <div className="progress-label-row" style={{marginTop: '10px'}}>
                         <span style={{fontSize: '12px', color: '#aaa'}}><FaDumbbell style={{marginRight:5}}/>Залишок занять</span>
                         <span style={{fontSize: '12px', color: '#fff'}}>{subscription.sessions_left} з {subscription.sessions_total}</span>
                      </div>
                      <div className="progress-container" style={{height: '8px'}}>
                        <div className="progress-bar-fill" style={{ width: `${sessionsPercent}%`, background: '#4CC9F0' }} />
                      </div>
                    </>
                  )}
                  {subscription.is_unlimited && (
                     <p style={{marginTop: '10px', fontSize: '13px', color: '#4CC9F0', display: 'flex', alignItems: 'center'}}>
                       <FaDumbbell style={{marginRight: 8}}/> Безлімітне відвідування 🔥
                     </p>
                  )}
              </div>
          </div>
        ) : (
          <div className="sub-card" style={{border: '1px dashed #555', background: 'transparent'}}>
            <div className="sub-card-content" style={{textAlign: 'center', padding: '20px'}}>
              <h2 className="sub-title" style={{color: '#888'}}>Немає активного абонемента 😢</h2>
              <p style={{marginBottom: '15px', fontSize: '14px'}}>Придбайте абонемент, щоб почати тренування</p>
              <button onClick={onBuyClick} className="buy-btn-style">Обрати абонемент</button>
            </div>
          </div>
        )}
      </section>
      <section className="section-margin">
        <h2 className="section-title">Мої записи</h2>
        <div className="workouts-list">
          {upcomingWorkouts.map(workout => (
            <div key={workout.id} className="workout-card">
               <div className="workout-icon-container">
                 {workout.type === 'strength' ? <MdFitnessCenter size={24}/> : <MdSelfImprovement size={24}/>}
               </div>
               <div className="workout-info">
                 <h3 className="workout-title">{workout.title}</h3>
                 <p className="workout-details">{workout.time} • Тренер: {workout.trainer}</p>
               </div>
               <button className="cancel-btn">Скасувати</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

const BottomNavigation = ({ activeTab, onTabClick }) => {
  const navItems = [
    { icon: FiUser, label: 'Профіль' },
    { icon: TbTag, label: 'Абонементи' },
    { icon: FiUsers, label: 'Тренери' },
    { icon: FiMap, label: 'Мапа' },
  ];
  return (
    <div className="bottom-nav glow-top">
      {navItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div key={index} className={`nav-item ${index === activeTab ? 'active' : ''}`} onClick={() => onTabClick(index)}>
            <IconComponent size={24} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [userID, setUserID] = useState(null); 

  useEffect(() => {
    if (WebApp.initData) {
        WebApp.ready();
        WebApp.expand(); 
    }
    const tgUser = WebApp.initDataUnsafe?.user;
    if (tgUser) {
      setUserID(tgUser.id.toString()); 
    } else {
      setUserID("user_777_test"); 
    }
  }, []);

  useEffect(() => {
    if (userID) {
      fetch(`${API_URL}/api/profile/${userID}`)
        .then(response => response.json())
        .then(data => setUserProfile(data))
        .catch(error => console.error("Помилка:", error));
    }
  }, [userID]);

  const renderContent = () => {
    switch (activeTab) {
      case 0: return <ProfileScreen user={userProfile} onBuyClick={() => setActiveTab(1)} />;
      case 1: return <SubscriptionsScreen userId={userID} />;
      case 2: return <TrainersScreen />;
      case 3: return <MapScreen />;
      default: return <ProfileScreen user={userProfile} />;
    }
  };

  return (
    <div className="app-container dark-mode">
      <div className="content-scrollable">{renderContent()}</div>
      <BottomNavigation activeTab={activeTab} onTabClick={setActiveTab} />
    </div>
  );
};
export default App;