import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaMinus, FaBan, FaSync } from 'react-icons/fa';

const API_URL = "https://gym-telegram-app.onrender.com";

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Завантажуємо всіх юзерів при вході
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users`);
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (e) {
      alert("Помилка завантаження бази");
      setLoading(false);
    }
  };

  // Функція редагування (додати дні, списати заняття, видати абонемент)
  const handleUpdate = async (userId, action, amount = 0) => {
    // Для видалення питаємо підтвердження
    if (action === "deactivate" && !confirm("Анулювати абонемент?")) return;
    
    try {
      const res = await fetch(`${API_URL}/api/admin/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action, amount })
      });
      if(res.ok) {
        // Оновлюємо список після успішної дії
        fetchUsers(); 
      }
    } catch (e) {
      alert("Помилка з'єднання");
    }
  };

  // Фільтруємо список по пошуку
  const filteredUsers = users.filter(u => 
     u.name.toLowerCase().includes(search.toLowerCase()) || 
     u.id.includes(search)
  );

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
          <h2 style={{ fontSize: 24, margin: 0, fontWeight: '800', color: '#fff' }}>👮‍♂️ Адмін</h2>
          <button onClick={fetchUsers} style={{background: 'transparent', border: 'none', color: '#666'}}><FaSync/></button>
      </div>
      
      {/* Пошук */}
      <div style={{background: '#222', padding: 10, borderRadius: 12, display: 'flex', alignItems: 'center', marginBottom: 20}}>
        <FaSearch color="#666" style={{marginRight: 10}}/>
        <input 
          type="text" 
          placeholder="Пошук (Ім'я або ID)..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none'}}
        />
      </div>

      {loading ? <p style={{textAlign:'center', color:'#666'}}>Завантаження...</p> : (
        <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
           {filteredUsers.map(user => (
             <div key={user.id} className="cyber-card" style={{padding: 15, border: user.subscription.active ? '1px solid var(--neon-red)' : '1px solid #333'}}>
                
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}}>
                   <div>
                     <div style={{fontWeight: 'bold', fontSize: 16, color: '#fff'}}>{user.name}</div>
                     <div style={{fontSize: 10, color: '#666'}}>ID: {user.id}</div>
                   </div>
                   <div style={{textAlign: 'right'}}>
                      {user.subscription.active 
                        ? <span style={{color: 'var(--neon-red)', fontWeight: 'bold'}}>АКТИВНИЙ</span>
                        : <span style={{color: '#666'}}>Немає підписки</span>
                      }
                   </div>
                </div>

                {/* Інфо про підписку */}
                {user.subscription.active && (
                   <div style={{background: '#111', padding: 10, borderRadius: 8, fontSize: 12, color: '#aaa', marginBottom: 15}}>
                      <div style={{color: '#fff', fontWeight: 'bold'}}>{user.subscription.title}</div>
                      <div>Залишилось: <b style={{color: '#fff'}}>{user.subscription.type === 'sessions' ? user.subscription.sessions_left : user.subscription.days_left}</b> {user.subscription.type === 'sessions' ? 'занять' : 'днів'}</div>
                   </div>
                )}

                {/* КНОПКИ УПРАВЛІННЯ */}
                <div style={{display: 'flex', gap: 5, marginBottom: 10}}>
                   <button onClick={() => handleUpdate(user.id, "subtract_session")} style={{flex: 1, background: '#333', border: 'none', color: '#fff', padding: 10, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5}}>
                      <FaMinus/> Заняття
                   </button>
                   <button onClick={() => handleUpdate(user.id, "add_days", 30)} style={{flex: 1, background: '#333', border: 'none', color: '#fff', padding: 10, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5}}>
                      <FaPlus/> 30 дн.
                   </button>
                   <button onClick={() => handleUpdate(user.id, "deactivate")} style={{flex: 0.5, background: '#4a0000', border: 'none', color: '#ffaaaa', padding: 10, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <FaBan/>
                   </button>
                </div>

                {/* 👇 ШВИДКА ВИДАЧА (ТЕПЕР ВОНА ТУТ Є) */}
                <div style={{borderTop: '1px solid #333', paddingTop: 10}}>
                    <div style={{fontSize: 10, color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1}}>Швидка видача:</div>
                    <div style={{display: 'flex', gap: 8}}>
                        <button onClick={() => handleUpdate(user.id, "set_subscription", 1)} 
                            style={{flex: 1, background: 'var(--neon-red)', border: 'none', color: '#fff', padding: '8px', borderRadius: 6, fontSize: 11, fontWeight: 'bold', cursor: 'pointer'}}>
                            РАНКОВИЙ (12)
                        </button>
                        <button onClick={() => handleUpdate(user.id, "set_subscription", 2)} 
                            style={{flex: 1, background: '#fff', border: 'none', color: '#000', padding: '8px', borderRadius: 6, fontSize: 11, fontWeight: 'bold', cursor: 'pointer'}}>
                            БЕЗЛІМІТ
                        </button>
                    </div>
                </div>

             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default AdminScreen;