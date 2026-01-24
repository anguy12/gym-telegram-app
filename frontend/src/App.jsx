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
import { MdSelfImprovement } from 'react-icons/md'; // Для іконки йоги

const API_URL = "https://gym-telegram-app.onrender.com";

// --- КОМПОНЕНТИ ---

const Header = ({ name, avatar }) => (
  <div style={{display: 'flex', alignItems: 'center', marginBottom: 20}}>
    <div style={{
      width: 50, height: 50, borderRadius: '50%', overflow: 'hidden', 
      border: '2px solid #333', marginRight: 15
    }}>
      <img src={avatar || "https://i.pravatar.cc/150"} alt="Avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
    <h1 style={{fontSize: 22, fontWeight: 'bold', margin: 0, color: '#fff'}}>Привіт, {name}!</h1>
  </div>
);

const ProfileScreen = ({ user, onBuyClick }) => {
  if (!user) return <div style={{textAlign:'center', marginTop:50}}>Завантаження...</div>;
  const { subscription } = user;
  
  // Розрахунок відсотка для смужки
  const percent = subscription.days_total > 0 
    ? Math.min(100, Math.max(0, (subscription.days_left / subscription.days_total) * 100))
    : 0;

  return (
    <div style={{padding: '0 5px'}}>
      {/* 🔴 КАРТКА АБОНЕМЕНТА (ЯК НА ФОТО) */}
      {subscription && subscription.active ? (
        <div style={{
          background: '#1c1c1e', 
          borderRadius: 20, 
          padding: 20, 
          position: 'relative',
          border: '1px solid #333',
          boxShadow: '0 0 20px rgba(229, 9, 20, 0.2)', // Червоне світіння
          marginBottom: 30
        }}>
          {/* Червоні кутики (декор) */}
          <div style={{position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderTop: '2px solid #E50914', borderRight: '2px solid #E50914', borderRadius: '0 10px 0 0', opacity: 0.8}}/>
          <div style={{position: 'absolute', bottom: 10, left: 10, width: 30, height: 30, borderBottom: '2px solid #E50914', borderLeft: '2px solid #E50914', borderRadius: '0 0 0 10px', opacity: 0.8}}/>

          <h2 style={{margin: '0 0 20px 0', fontSize: 24, fontWeight: '800', letterSpacing: 1}}>
            {subscription.title || "GOLD Абонемент"}
          </h2>

          {/* Смужка прогресу з бігуном */}
          <div style={{position: 'relative', height: 24, background: '#333', borderRadius: 12, marginBottom: 15}}>
             <div style={{
                width: `${percent}%`, 
                background: 'linear-gradient(90deg, #990000 0%, #E50914 100%)', 
                height: '100%', 
                borderRadius: 12,
                position: 'relative',
                transition: 'width 0.5s ease'
             }}>
                {/* Бігуча людина в кінці смужки */}
                <div style={{
                   position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)',
                   color: 'white', fontSize: 14
                }}>
                   <FaRunning />
                </div>
             </div>
          </div>

          <p style={{color: '#aaa', fontSize: 14, margin: 0}}>
             Залишилось: <span style={{color: '#fff', fontWeight: 'bold'}}>{subscription.days_left} днів</span> (до {subscription.expiry_date})
          </p>
        </div>
      ) : (
        // Якщо немає абонемента
        <div style={{
          background: '#1c1c1e', borderRadius: 20, padding: 30, textAlign: 'center', border: '1px dashed #444', marginBottom: 30
        }}>
          <h3 style={{color:'#888', margin:0}}>Абонемент відсутній</h3>
          <button onClick={onBuyClick} className="buy-btn-style" style={{marginTop: 15, background: '#E50914'}}>Придбати</button>
        </div>
      )}

      {/* 🔴 СЕКЦІЯ "МОЇ ЗАПИСИ" (Як на фото) */}
      <h3 style={{fontSize: 18, marginBottom: 15, color: '#fff'}}>Мої записи</h3>
      
      {/* Запис 1 */}
      <div style={{
         background: '#1c1c1e', borderRadius: 16, padding: 15, marginBottom: 10,
         display: 'flex', alignItems: 'center', borderLeft: '4px solid #E50914'
      }}>
         <div style={{marginRight: 15, color: '#888'}}><FaDumbbell size={24}/></div>
         <div style={{flex: 1}}>
            <h4 style={{margin: '0 0 5px 0', fontSize: 16}}>Функціональний тренінг</h4>
            <p style={{margin: 0, fontSize: 12, color: '#666'}}>Сьогодні, 18:00 • Тренер: Іван П.</p>
         </div>
         <button style={{background: 'rgba(229, 9, 20, 0.1)', color: '#E50914', border: 'none', padding: '5px 10px', borderRadius: 8, fontSize: 12}}>Скасувати</button>
      </div>

      {/* Запис 2 */}
      <div style={{
         background: '#1c1c1e', borderRadius: 16, padding: 15, marginBottom: 10,
         display: 'flex', alignItems: 'center', borderLeft: '4px solid #E50914'
      }}>
         <div style={{marginRight: 15, color: '#888'}}><MdSelfImprovement size={24}/></div>
         <div style={{flex: 1}}>
            <h4 style={{margin: '0 0 5px 0', fontSize: 16}}>Йога (Розтяжка)</h4>
            <p style={{margin: 0, fontSize: 12, color: '#666'}}>Завтра, 09:30 • Тренер: Олена М.</p>
         </div>
         <button style={{background: 'rgba(229, 9, 20, 0.1)', color: '#E50914', border: 'none', padding: '5px 10px', borderRadius: 8, fontSize: 12}}>Скасувати</button>
      </div>

    </div>
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
    const currentId = tgUser ? tgUser.id.toString() : "test_user_v4";
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
    <div className="app-container dark-mode" style={{background: '#000', minHeight: '100vh', color: '#fff'}}>
      {user && activeTab === 0 && (
        <div style={{padding: '20px 20px 0 20px'}}>
          <Header name={user.name} avatar={user.avatar} />
        </div>
      )}

      <div className="content-scrollable" style={{padding: '20px', paddingBottom: 80}}>
        {renderContent()}
      </div>

      <div className="bottom-nav" style={{
         position: 'fixed', bottom: 0, left: 0, right: 0, 
         background: '#111', borderTop: '1px solid #222', 
         display: 'flex', justifyContent: 'space-around', padding: '10px 0',
         paddingBottom: 25 // Для iPhone
      }}>
        <div className={`nav-item ${activeTab===0?'active':''}`} onClick={()=>setActiveTab(0)} style={{color: activeTab===0 ? '#E50914' : '#666'}}>
           <FiUser size={24}/><span className="nav-label">Профіль</span>
        </div>
        <div className={`nav-item ${activeTab===1?'active':''}`} onClick={()=>setActiveTab(1)} style={{color: activeTab===1 ? '#E50914' : '#666'}}>
           <TbTag size={24}/><span className="nav-label">Абонементи</span>
        </div>
        <div className={`nav-item ${activeTab===2?'active':''}`} onClick={()=>setActiveTab(2)} style={{color: activeTab===2 ? '#E50914' : '#666'}}>
           <FiUsers size={24}/><span className="nav-label">Тренери</span>
        </div>
        <div className={`nav-item ${activeTab===3?'active':''}`} onClick={()=>setActiveTab(3)} style={{color: activeTab===3 ? '#E50914' : '#666'}}>
           <FiMap size={24}/><span className="nav-label">Мапа</span>
        </div>
      </div>
    </div>
  );
};

export default App;