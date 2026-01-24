// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import WebApp from '@twa-dev/sdk'; 

// Екрани
import SubscriptionsScreen from './screens/SubscriptionsScreen';
import TrainersScreen from './screens/TrainersScreen';
import MapScreen from './screens/MapScreen';

// Іконки (Додав FaRunning - бігучий чоловічок)
import { FiUser, FiUsers, FiMap } from 'react-icons/fi';
import { TbTag } from 'react-icons/tb';
import { FaClock, FaFire, FaRunning } from 'react-icons/fa'; 

const API_URL = "https://gym-telegram-app.onrender.com";

// --- HEADER З БІГУЧИМ ЧОЛОВІЧКОМ ---
const Header = ({ name, avatar }) => (
  <div className="header">
    <div className="avatar-container" style={{border: '2px solid var(--accent-red)', padding: 2, position: 'relative'}}>
      <img src={avatar || "https://i.pravatar.cc/150"} alt="Avatar" className="avatar-img" />
      {/* 👇 ОСЬ ВІН, БІГУЧИЙ ЧОЛОВІЧОК 👇 */}
      <div style={{
          position: 'absolute', bottom: -5, right: -5, 
          background: 'var(--accent-red)', borderRadius: '50%', 
          width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #000'
      }}>
          <FaRunning size={14} color="white" />
      </div>
    </div>
    <div className="header-text">
      <span style={{fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px'}}>Gym Member</span>
      <h1 className="greeting" style={{margin:0, fontSize: '24px'}}>{name}</h1>
    </div>
  </div>
);

const ProfileScreen = ({ user, onBuyClick }) => {
  if (!user) return <div style={{textAlign:'center', marginTop:50}}>Завантаження профілю...</div>;
  const { subscription } = user;
  
  const percent = subscription.days_total > 0 
    ? Math.min(100, Math.max(0, (subscription.days_left / subscription.days_total) * 100))
    : 0;

  return (
    <section className="section-margin">
      {subscription && subscription.active ? (
        <div className="sub-card glow-effect" style={{position: 'relative', overflow: 'hidden'}}>
            <div style={{position: 'absolute', top: -10, right: -10, opacity: 0.1}}>
               <FaFire size={120} color="white"/>
            </div>
            
            <div className="sub-card-content" style={{position: 'relative', zIndex: 2}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
                   <span style={{background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: 6, fontSize: 12, color: '#4CC9F0'}}>
                     АКТИВНИЙ
                   </span>
                   <span style={{fontSize: 12, color: '#ddd'}}>до {subscription.expiry_date}</span>
                </div>

                <h2 className="sub-title" style={{fontSize: '28px', marginBottom: 5}}>{subscription.title}</h2>
                <p style={{color: '#ccc', fontSize: 14, marginBottom: 20}}>
                   Залишилось: <strong style={{color: '#fff'}}>{subscription.days_left} днів</strong>
                </p>

                <div className="progress-container" style={{height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: 10}}>
                   <div className="progress-bar-fill" style={{ width: `${percent}%`, background: 'var(--accent-red)', height: '100%', borderRadius: 10, boxShadow: '0 0 10px var(--accent-red)' }} />
                </div>
            </div>
        </div>
      ) : (
        <div className="sub-card" style={{border: '1px dashed #444', background: 'linear-gradient(145deg, #1a1a1a, #222)', textAlign: 'center', padding: '30px 20px'}}>
            <div style={{background: '#333', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px'}}>
               <TbTag size={30} color="#666"/>
            </div>
            <h3 style={{color:'#fff', margin:'0 0 10px 0'}}>Абонемент відсутній</h3>
            <p style={{fontSize: 13, color: '#888', marginBottom: 20}}>У вас немає активних тренувань.</p>
            <button onClick={onBuyClick} className="buy-btn-style" style={{width: '100%'}}>
               Вибрати абонемент
            </button>
        </div>
      )}
    </section>
  );
};

// --- MAIN APP ---
const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    if (WebApp.initData) { WebApp.ready(); WebApp.expand(); }
    const tgUser = WebApp.initDataUnsafe?.user;
    const currentId = tgUser ? tgUser.id.toString() : "test_user_v3";
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