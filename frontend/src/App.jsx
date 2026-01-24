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
import { FaRunning, FaDumbbell, FaCrown } from 'react-icons/fa'; // Crown для преміуму
import { MdSelfImprovement } from 'react-icons/md';

const API_URL = "https://gym-telegram-app.onrender.com";

// --- HEADER ---
const Header = ({ name, avatar }) => (
  <div style={{display: 'flex', alignItems: 'center', marginBottom: 25, paddingTop: 10}}>
    <div style={{
      width: 54, height: 54, borderRadius: '50%', padding: 2,
      background: 'linear-gradient(45deg, #ff3333, #111)', // Градієнтна рамка
      marginRight: 15, boxShadow: '0 4px 15px rgba(255, 0, 0, 0.3)'
    }}>
      <img src={avatar || "https://i.pravatar.cc/150"} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #000'}} />
    </div>
    <div>
       <span style={{fontSize: 11, color: '#ff3333', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 'bold'}}>Member</span>
       <h1 style={{fontSize: 24, fontWeight: '700', margin: 0, color: '#fff', letterSpacing: 0.5}}>{name}</h1>
    </div>
  </div>
);

const ProfileScreen = ({ user, onBuyClick }) => {
  if (!user) return <div style={{textAlign:'center', marginTop:50, color: '#888'}}>Завантаження профілю...</div>;
  const { subscription } = user;
  
  const percent = subscription.days_total > 0 
    ? Math.min(100, Math.max(0, (subscription.days_left / subscription.days_total) * 100))
    : 0;

  return (
    <div style={{padding: '0 5px'}}>
      
      {/* 💎 КАРТКА АБОНЕМЕНТА */}
      {subscription && subscription.active ? (
        <div style={{
          background: 'linear-gradient(160deg, #1a1a1a 0%, #0d0d0d 100%)', 
          borderRadius: 24, 
          padding: 24, 
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', 
          marginBottom: 30,
          overflow: 'hidden'
        }}>
          {/* Фоновий блиск */}
          <div style={{position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'radial-gradient(circle, rgba(229,9,20,0.4) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)'}}></div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 20, position: 'relative'}}>
             <div>
                <h2 style={{margin: 0, fontSize: 26, fontWeight: '800', background: 'linear-gradient(to right, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                  {subscription.title}
                </h2>
                <div style={{display: 'flex', alignItems: 'center', marginTop: 5, gap: 8}}>
                   <span style={{background: 'rgba(255, 51, 51, 0.15)', color: '#ff3333', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 'bold'}}>ACTIVE</span>
                </div>
             </div>
             <FaCrown size={24} color="#ff3333" style={{opacity: 0.8}}/>
          </div>

          <div style={{marginBottom: 10, display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888'}}>
             <span>Термін дії</span>
             <span style={{color: '#fff'}}>до {subscription.expiry_date}</span>
          </div>

          {/* Смужка прогресу */}
          <div style={{position: 'relative', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 10, marginBottom: 15}}>
             <div style={{
                width: `${percent}%`, 
                background: 'linear-gradient(90deg, #ff3333 0%, #ff6b6b 100%)', 
                height: '100%', borderRadius: 10, position: 'relative',
                boxShadow: '0 0 15px rgba(255, 51, 51, 0.5)'
             }}>
                <div style={{
                   position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
                   background: '#fff', borderRadius: '50%', width: 20, height: 20,
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                }}>
                   <FaRunning size={10} color="#ff3333" />
                </div>
             </div>
          </div>
          <p style={{textAlign: 'right', fontSize: 13, color: '#aaa', margin: 0}}>Залишилось: <span style={{color: '#fff'}}>{subscription.days_left} днів</span></p>
        </div>
      ) : (
        // ❌ ЯКЩО НЕМАЄ АБОНЕМЕНТА (Виправлена кнопка!)
        <div style={{
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: 24, padding: '30px 20px', 
          textAlign: 'center', 
          border: '1px solid rgba(255,255,255,0.05)', 
          marginBottom: 30,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: 'rgba(30,30,30,0.5)', width: 70, height: 70, borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
             <TbTag size={32} color="#666"/>
          </div>
          <h3 style={{color:'#fff', margin:'0 0 8px 0', fontSize: 20}}>Немає абонемента</h3>
          <p style={{fontSize: 14, color: '#888', marginBottom: 25, lineHeight: 1.5}}>
            Ваш профіль готовий до тренувань. <br/>Оберіть план, щоб почати.
          </p>
          
          {/* 🔥 ПРЕМІУМ КНОПКА 🔥 */}
          <button onClick={onBuyClick} style={{
            width: '100%',
            padding: '16px',
            border: 'none',
            borderRadius: '16px',
            background: 'linear-gradient(90deg, #D41420 0%, #FF4B2B 100%)', // Соковитий градієнт
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(212, 20, 32, 0.4)', // Тінь з кольором
            transition: 'transform 0.2s',
            letterSpacing: 0.5
          }}>
             Обрати абонемент ✨
          </button>
        </div>
      )}

      {/* СЕКЦІЯ ЗАПИСІВ */}
      <h3 style={{fontSize: 18, marginBottom: 15, color: '#fff', fontWeight: '600'}}>Найближчі тренування</h3>
      
      <div style={{display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10}}>
          {/* Запис 1 */}
          <div style={{
             minWidth: '85%', background: '#1a1a1a', borderRadius: 20, padding: 15,
             border: '1px solid #333', display: 'flex', alignItems: 'center', gap: 15
          }}>
             <div style={{background: '#222', padding: 12, borderRadius: 12}}><FaDumbbell color="#fff" size={20}/></div>
             <div>
                <h4 style={{margin: '0 0 4px 0', fontSize: 15, color: '#fff'}}>CrossFit</h4>
                <p style={{margin: 0, fontSize: 12, color: '#666'}}>Сьогодні, 18:00</p>
             </div>
          </div>
           {/* Запис 2 */}
           <div style={{
             minWidth: '85%', background: '#1a1a1a', borderRadius: 20, padding: 15,
             border: '1px solid #333', display: 'flex', alignItems: 'center', gap: 15
          }}>
             <div style={{background: '#222', padding: 12, borderRadius: 12}}><MdSelfImprovement color="#fff" size={20}/></div>
             <div>
                <h4 style={{margin: '0 0 4px 0', fontSize: 15, color: '#fff'}}>Yoga Flow</h4>
                <p style={{margin: 0, fontSize: 12, color: '#666'}}>Завтра, 09:00</p>
             </div>
          </div>
      </div>

    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    if (WebApp.initData) { WebApp.ready(); WebApp.expand(); }
    const tgUser = WebApp.initDataUnsafe?.user;
    const currentId = tgUser ? tgUser.id.toString() : "test_user_final";
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
    <div className="app-container" style={{
        background: '#000', minHeight: '100vh', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {user && activeTab === 0 && (
        <div style={{padding: '20px 20px 0 20px'}}>
          <Header name={user.name} avatar={user.avatar} />
        </div>
      )}

      <div className="content-scrollable" style={{padding: '20px', paddingBottom: 100}}>
        {renderContent()}
      </div>

      {/* Навігація з Glassmorphism */}
      <div className="bottom-nav" style={{
         position: 'fixed', bottom: 20, left: 20, right: 20, 
         background: 'rgba(30, 30, 30, 0.85)', 
         backdropFilter: 'blur(20px)',
         borderRadius: 25,
         border: '1px solid rgba(255,255,255,0.1)',
         display: 'flex', justifyContent: 'space-around', padding: '15px 0',
         boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        {[
            {icon: FiUser, l: 'Профіль'}, {icon: TbTag, l: 'Ціни'}, 
            {icon: FiUsers, l: 'Тренери'}, {icon: FiMap, l: 'Інфо'}
        ].map((item, i) => (
            <div key={i} onClick={()=>setActiveTab(i)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                color: activeTab===i ? '#ff3333' : '#666', transition: 'color 0.3s'
            }}>
               <item.icon size={22} />
               <span style={{fontSize: 10, fontWeight: '500'}}>{item.l}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default App;