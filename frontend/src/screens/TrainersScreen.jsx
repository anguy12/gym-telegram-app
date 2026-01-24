import React from 'react';
import { FaInstagram, FaTelegramPlane, FaCheckCircle } from 'react-icons/fa';
import WebApp from '@twa-dev/sdk';

const trainers = [
  {
    id: 1,
    name: "Олександр Бойко",
    specialty: "CrossFit / Пауерліфтинг",
    exp: "8 років досвіду",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop", // Реальне фото з Unsplash
    instagram: "alex_fit"
  },
  {
    id: 2,
    name: "Марія Коваль",
    specialty: "Йога / Розтяжка",
    exp: "5 років досвіду",
    img: "https://images.unsplash.com/photo-1609899537878-39d4a7988463?q=80&w=1374&auto=format&fit=crop",
    instagram: "maria_yoga"
  },
  {
    id: 3,
    name: "Дмитро Вовк",
    specialty: "Бокс / Кардіо",
    exp: "Майстер спорту",
    img: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1469&auto=format&fit=crop",
    instagram: "dmytro_box"
  }
];

const TrainersScreen = () => {

  const handleBooking = (name) => {
    WebApp.HapticFeedback.impactOccurred('medium');
    WebApp.showAlert(`Ви відправили запит на тренування до: ${name}. \nТренер зв'яжеться з вами!`);
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      <h2 style={{ fontSize: 24, marginBottom: 25, fontWeight: '800', color: '#fff' }}>
        Команда професіоналів
      </h2>

      {trainers.map((trainer) => (
        <div key={trainer.id} className="cyber-card" style={{ 
            padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' 
        }}>
          
          {/* Верхня частина з фото (ефект затемнення) */}
          <div style={{ position: 'relative', height: 180, width: '100%' }}>
            <img 
              src={trainer.img} 
              alt={trainer.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Градієнт поверх фото для читабельності тексту */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '80%',
              background: 'linear-gradient(to top, #111 0%, transparent 100%)'
            }}></div>
            
            {/* Бейдж досвіду */}
            <div style={{
              position: 'absolute', top: 10, right: 10, 
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
              padding: '4px 10px', borderRadius: 12, border: '1px solid #333',
              fontSize: 11, color: '#fff', display: 'flex', alignItems: 'center'
            }}>
              <FaCheckCircle color="var(--neon-red)" style={{marginRight: 5}} size={10}/>
              {trainer.exp}
            </div>
          </div>

          {/* Інформація */}
          <div style={{ padding: 20, paddingTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <h3 style={{ margin: 0, fontSize: 20, color: '#fff' }}>{trainer.name}</h3>
              {/* Кнопка Інстаграм */}
              <a href={`https://instagram.com/${trainer.instagram}`} target="_blank" rel="noreferrer" style={{color: '#aaa'}}>
                <FaInstagram size={22} />
              </a>
            </div>
            
            <p style={{ margin: '0 0 20px 0', fontSize: 13, color: 'var(--neon-red)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' }}>
              {trainer.specialty}
            </p>

            {/* Кнопка запису */}
            <button 
              onClick={() => handleBooking(trainer.name)}
              style={{
                background: 'transparent',
                border: '1px solid var(--neon-red)',
                color: '#fff',
                width: '100%',
                padding: '12px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: '600',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              // Ефект при наведенні (через style не зробиш повноцінно, але для мобілок ок)
              onTouchStart={(e) => {
                 e.currentTarget.style.background = 'var(--neon-red)';
                 e.currentTarget.style.color = 'black';
              }}
              onTouchEnd={(e) => {
                 e.currentTarget.style.background = 'transparent';
                 e.currentTarget.style.color = 'white';
              }}
            >
              <FaTelegramPlane /> Записатись на тренування
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainersScreen;с