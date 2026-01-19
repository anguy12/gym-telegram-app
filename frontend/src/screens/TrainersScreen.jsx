// src/screens/TrainersScreen.jsx
import React, { useState, useEffect } from 'react';
import { FaInstagram, FaPhoneAlt } from 'react-icons/fa';

const TrainersScreen = () => {
  const [selectedGym, setSelectedGym] = useState('polubotka');
  
  // Стан для тренерів (поки вантажиться - пустий масив)
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ЗАВАНТАЖУЄМО ТРЕНЕРІВ З PYTHON
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/trainers')
      .then(res => res.json())
      .then(data => {
        setTrainers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Помилка завантаження тренерів:", err);
        setLoading(false);
      });
  }, []);

  // Фільтруємо вже завантажені дані
  const filteredTrainers = trainers.filter(trainer => trainer.gym === selectedGym);

  if (loading) return <div style={{textAlign: 'center', marginTop: 50}}>Завантаження тренерів...</div>;

  return (
    <div className="trainers-screen">
      <h2 className="screen-title">Команда Тренерів</h2>
      
      <div className="gym-selector">
        <button 
          className={`gym-toggle-btn ${selectedGym === 'polubotka' ? 'active' : ''}`}
          onClick={() => setSelectedGym('polubotka')}
        >
          вул. П.Полуботка
        </button>
        <button 
          className={`gym-toggle-btn ${selectedGym === 'myrnoho' ? 'active' : ''}`}
          onClick={() => setSelectedGym('myrnoho')}
        >
          вул. П.Мирного
        </button>
      </div>

      <p className="screen-subtitle" style={{textAlign: 'center', marginBottom: '20px'}}>
        {selectedGym === 'polubotka' ? 'Team Полуботка 💪' : 'Team Мирного 🔥'}
      </p>

      <div className="trainers-grid">
        {filteredTrainers.map((trainer) => (
          <div key={trainer.id} className="trainer-card">
            <div className="trainer-img-wrapper">
              {/* Бекенд повертає шлях типу "/trainers/roman.jpg", це працює */}
              <img src={trainer.img} alt={trainer.name} className="trainer-img" />
            </div>
            
            <h3 className="trainer-name">{trainer.name}</h3>
            <p className="trainer-role">{trainer.role}</p>
            
            <div className="trainer-socials">
              <a 
                href={`https://instagram.com/${trainer.instagram}`} 
                target="_blank" 
                rel="noreferrer"
                className="social-btn instagram"
              >
                <FaInstagram />
              </a>
              {trainer.phone && (
                <a href={`tel:${trainer.phone.replace(/\s/g, '')}`} className="social-btn phone">
                  <FaPhoneAlt />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainersScreen;