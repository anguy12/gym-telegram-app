// src/screens/LoginModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaIdCard } from 'react-icons/fa';

const LoginModal = ({ onClose, onLoginSuccess, apiUrl }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code })
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess(data.user); // Успіх!
      } else {
        setError('Код не знайдено 😔');
      }
    } catch (err) {
      setError('Помилка з\'єднання');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: '#1a1a1a', padding: '30px', borderRadius: '20px',
        width: '85%', maxWidth: '320px', position: 'relative',
        border: '1px solid #333', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        {/* Кнопка закриття */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', color: '#666', fontSize: 20
        }}>
          <FaTimes />
        </button>

        <div style={{textAlign: 'center', marginBottom: 20}}>
          <FaIdCard size={50} color="var(--accent-red)" style={{marginBottom: 15}}/>
          <h2 style={{margin: 0, fontSize: 22}}>Вхід у клуб</h2>
          <p style={{color: '#777', fontSize: 13, marginTop: 5}}>Введіть номер з вашої картки</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input 
            type="number" 
            placeholder="Код (напр. 1001)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
            style={{
              width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #333',
              background: '#222', color: 'white', fontSize: '18px', textAlign: 'center',
              marginBottom: '15px', outline: 'none'
            }}
          />
          
          {error && <div style={{color: '#ff4444', marginBottom: 15, textAlign:'center', fontSize: 14}}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading || !code}
            className="buy-btn-style"
            style={{width: '100%', height: 45, fontSize: 16}}
          >
            {loading ? "Перевірка..." : "Увійти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;