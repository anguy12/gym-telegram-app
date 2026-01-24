import React from 'react';
import { FaInstagram, FaTelegramPlane, FaCheck, FaDumbbell, FaRunning, FaFistRaised } from 'react-icons/fa';
import WebApp from '@twa-dev/sdk';

const trainers = [
  {
    id: 1,
    name: "Олександр Бойко",
    specialty: "CrossFit / Power",
    exp: "8 років",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80", 
    instagram: "alex_fit"
  },
  {
    id: 2,
    name: "Марія Коваль",
    specialty: "Йога / Stretching",
    exp: "5 років",
    img: "https://images.unsplash.com/photo-1609899537878-39d4a7988463?auto=format&fit=crop&w=600&q=80",
    instagram: "maria_yoga"
  },
  {
    id: 3,
    name: "Дмитро Вовк",
    specialty: "Бокс / Fight",
    exp: "PRO",
    img: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=600&q=80",
    instagram: "dmytro_box"
  }
];

const TrainersScreen = () => {
  const handleBooking = (name) => {
    // Безпечний виклик вібрації
    try {
        WebApp.HapticFeedback.impactOccurred('medium');
    } catch (e) {}
    WebApp.showAlert(`Запит відправлено до тренера: ${name}`);
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      <h2 style={{ fontSize: 24, marginBottom: 20, fontWeight: '800', color: '#fff' }}>
        Команда <span style={{color: 'var(--neon-red)'}}>PRO</span>
      </h2>

      {trainers.map((trainer) => (
        <div key={trainer.id} className="cyber-card" style={{ 
            padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column',
            marginBottom: 20, position: 'relative'
        }}>
          
          {/* Фото */}
          <div style={{ height: 200, width: '100%', position: 'relative' }}>
            <img 
              src={trainer.img} 
              alt={trainer.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, #111 5%, transparent 100%)'
            }}></div>

            {/* Бейдж досвіду */}
            <div style={{
              position: 'absolute', top: 10, right: 10, 
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
              padding: '4px 10px', borderRadius: 8, border: '1px solid #444',
              fontSize: 12, color: '#fff', display: 'flex', alignItems: 'center'
            }}>
              <FaCheck color="var(--neon-red)" style={{marginRight: 6}} size={10}/>
              {trainer.exp}
            </div>
          </div>

          {/* Інфо */}
          <div style={{ padding: 15, position: 'relative' }}>
             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#fff' }}>{trainer.name}</h3>
                  <p style={{ margin: '4px 0 15px 0', fontSize: 12, color: 'var(--neon-red)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' }}>
                    {trainer.specialty}
                  </p>
                </div>
                <div style={{color: '#888'}}>
                  <FaInstagram size={24}/>
                </div>
             </div>

            <button 
              onClick={() => handleBooking(trainer.name)}
              className="buy-btn-style"
              style={{
                background: 'transparent', border: '1px solid var(--neon-red)',
                fontSize: 14, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >
              <FaTelegramPlane /> Записатись
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainersScreen;