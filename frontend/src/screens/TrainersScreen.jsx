import React, { useState } from 'react';
import { FaInstagram, FaTelegramPlane, FaCheck, FaMapMarkerAlt } from 'react-icons/fa';
import WebApp from '@twa-dev/sdk';

// БАЗА ТРЕНЕРІВ (Розділена на зали)
const trainersData = {
  polubotka: [
    {
      id: 1,
      name: "Олександр Бойко",
      specialty: "CrossFit / Power",
      exp: "8 років",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=300&q=80", 
      instagram: "alex_fit"
    },
    {
      id: 2,
      name: "Ірина Савченко",
      specialty: "TRX / Схуднення",
      exp: "4 роки",
      img: "https://images.unsplash.com/photo-1609899537878-39d4a7988463?auto=format&fit=crop&w=300&q=80",
      instagram: "ira_trx"
    },
    {
      id: 3,
      name: "Максим Дрозд",
      specialty: "Бодібілдінг",
      exp: "10 років",
      img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=300&q=80",
      instagram: "max_body"
    }
  ],
  myrnoho: [
    {
      id: 4,
      name: "Дмитро Вовк",
      specialty: "Бокс / Fight",
      exp: "PRO",
      img: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=300&q=80",
      instagram: "dmytro_box"
    },
    {
      id: 5,
      name: "Олена Коваль",
      specialty: "Йога / Stretching",
      exp: "5 років",
      img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=300&q=80",
      instagram: "elena_yoga"
    },
     {
      id: 6,
      name: "Андрій Ткач",
      specialty: "Функціонал",
      exp: "6 років",
      img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=300&q=80",
      instagram: "andrew_gym"
    }
  ]
};

const TrainersScreen = () => {
  const [selectedGym, setSelectedGym] = useState('polubotka'); // Стан для перемикання

  const handleBooking = (name) => {
    try { WebApp.HapticFeedback.impactOccurred('light'); } catch (e) {}
    WebApp.showAlert(`Запит на тренування з ${name} відправлено!`);
  };

  const currentTrainers = trainersData[selectedGym];

  return (
    <div style={{ paddingBottom: 20 }}>
      <h2 style={{ fontSize: 24, marginBottom: 20, fontWeight: '800', color: '#fff' }}>
        Наші Тренери
      </h2>

      {/* ПЕРЕМИКАЧ ЗАЛІВ (Компактний) */}
      <div style={{
        background: '#111', padding: 4, borderRadius: 12, marginBottom: 20, display: 'flex', border: '1px solid #333'
      }}>
        <button 
          onClick={() => setSelectedGym('polubotka')}
          style={{
            flex: 1, padding: '8px', border: 'none', borderRadius: 10,
            background: selectedGym === 'polubotka' ? '#2a2a2a' : 'transparent',
            color: selectedGym === 'polubotka' ? '#fff' : '#666',
            fontWeight: 'bold', fontSize: 13, transition: 'all 0.2s'
          }}
        >
          Полуботка
        </button>
        <button 
          onClick={() => setSelectedGym('myrnoho')}
          style={{
            flex: 1, padding: '8px', border: 'none', borderRadius: 10,
            background: selectedGym === 'myrnoho' ? '#2a2a2a' : 'transparent',
            color: selectedGym === 'myrnoho' ? '#fff' : '#666',
            fontWeight: 'bold', fontSize: 13, transition: 'all 0.2s'
          }}
        >
          П. Мирного
        </button>
      </div>

      {/* СПИСОК ТРЕНЕРІВ (Компактні картки) */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        {currentTrainers.map((trainer) => (
          <div key={trainer.id} style={{
             background: '#1a1a1a', 
             borderRadius: 16, 
             padding: 10,
             display: 'flex', 
             alignItems: 'center',
             border: '1px solid #333',
             boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            
            {/* 1. Фото (Квадратне, зліва) */}
            <div style={{
               width: 65, height: 65, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
               border: '1px solid #444', marginRight: 15
            }}>
               <img src={trainer.img} alt={trainer.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>

            {/* 2. Інформація (Посередині) */}
            <div style={{flex: 1}}>
               <h3 style={{margin: '0 0 4px 0', fontSize: 16, color: '#fff'}}>{trainer.name}</h3>
               
               <div style={{fontSize: 12, color: 'var(--neon-red)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4}}>
                 {trainer.specialty}
               </div>
               
               <div style={{fontSize: 11, color: '#888', display: 'flex', alignItems: 'center'}}>
                 <FaCheck size={10} style={{marginRight: 4}}/> {trainer.exp} досвіду
               </div>
            </div>

            {/* 3. Кнопки (Справа, вертикально) */}
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center'}}>
               {/* Instagram */}
               <a href={`https://instagram.com/${trainer.instagram}`} style={{color: '#666'}}>
                  <FaInstagram size={20}/>
               </a>

               {/* Кнопка запису */}
               <button 
                 onClick={() => handleBooking(trainer.name)}
                 style={{
                    background: 'var(--neon-red)', border: 'none', color: 'white',
                    width: 32, height: 32, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 0 10px rgba(255, 31, 31, 0.4)'
                 }}
               >
                 <FaTelegramPlane size={14} style={{marginLeft: -2}} />
               </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainersScreen;