import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserEdit, FaSave, FaArrowLeft, FaBan, FaSync, FaTelegramPlane } from 'react-icons/fa';

const API_URL = "https://gym-telegram-app.onrender.com";

const AdminScreen = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  // 1. ЗАВАНТАЖЕННЯ СПИСКУ
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users`);
      if (!res.ok) throw new Error("Помилка");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setUsers([]);
    }
    setLoading(false);
  };

  // 2. ЗБЕРЕЖЕННЯ
  const handleSave = async () => {
    if (!editingUser) return;

    try {
        const payload = {
            user_id: editingUser.id,
            name: editingUser.name,
            sessions: parseInt(editingUser.subscription.sessions_left || 0),
            days: parseInt(editingUser.subscription.days_left || 0),
            is_active: editingUser.subscription.active,
            is_blocked: editingUser.is_blocked,
            gym_name: editingUser.subscription.gym_name || "",
            sub_title: editingUser.subscription.title || "",
            expiry_date: editingUser.subscription.expiry_date || ""
        };

        const res = await fetch(`${API_URL}/api/admin/edit_user`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("✅ Профіль оновлено!");
            setEditingUser(null);
            fetchUsers();
        } else {
            alert("❌ Помилка збереження");
        }
    } catch (e) { 
        alert("Помилка з'єднання"); 
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase())) || 
    (u.id && u.id.includes(search)) ||
    (u.username && u.username.toLowerCase().includes(search.toLowerCase()))
  );

  // --- РЕЖИМ РЕДАГУВАННЯ ---
  if (editingUser) {
      // Формуємо посилання на чат
      const tgLink = editingUser.username 
        ? `https://t.me/${editingUser.username}` 
        : `tg://user?id=${editingUser.id}`;

      return (
        <div style={{paddingBottom: 40}}>
           {/* Шапка */}
           <div style={{display:'flex', alignItems:'center', gap:15, marginBottom:20}}>
               <button onClick={() => setEditingUser(null)} style={{background:'none', border:'none', color:'#fff', cursor:'pointer'}}><FaArrowLeft size={24}/></button>
               <h2 style={{margin:0, fontSize:22}}>Редагування</h2>
           </div>

           <div style={{background: '#1a1a1a', padding: 20, borderRadius: 20, border: '1px solid #333'}}>
               
               {/* 🔥 КНОПКА "НАПИСАТИ В TELEGRAM" */}
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20}}>
                   <div>
                       <div style={{fontSize:12, color:'#666'}}>ID: {editingUser.id}</div>
                       {editingUser.username && <div style={{fontSize:12, color:'#0088cc'}}>@{editingUser.username}</div>}
                   </div>
                   
                   <a href={tgLink} target="_blank" rel="noreferrer" 
                      style={{
                          background: '#0088cc', color: '#fff', textDecoration: 'none', 
                          padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: 'bold',
                          display: 'flex', alignItems: 'center', gap: 6
                      }}>
                       <FaTelegramPlane size={16} /> Написати
                   </a>
               </div>
               
               {/* Поля редагування */}
               <div style={{marginBottom: 15}}>
                   <label style={labelStyle}>Ім'я клієнта</label>
                   <input style={inputStyle} value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
               </div>

               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15, marginBottom: 15}}>
                   <div>
                       <label style={labelStyle}>Занять (шт)</label>
                       <input type="number" style={inputStyle} value={editingUser.subscription.sessions_left} 
                              onChange={e => setEditingUser({...editingUser, subscription: {...editingUser.subscription, sessions_left: e.target.value}})} />
                   </div>
                   <div>
                       <label style={labelStyle}>Днів (шт)</label>
                       <input type="number" style={inputStyle} value={editingUser.subscription.days_left} 
                              onChange={e => setEditingUser({...editingUser, subscription: {...editingUser.subscription, days_left: e.target.value}})} />
                   </div>
               </div>

               <div style={{marginBottom: 15}}>
                   <label style={labelStyle}>Назва абонемента</label>
                   <input style={inputStyle} value={editingUser.subscription.title} 
                          onChange={e => setEditingUser({...editingUser, subscription: {...editingUser.subscription, title: e.target.value}})} />
               </div>

               <div style={{marginBottom: 15}}>
                   <label style={labelStyle}>Дата закінчення</label>
                   <input style={inputStyle} value={editingUser.subscription.expiry_date} 
                          onChange={e => setEditingUser({...editingUser, subscription: {...editingUser.subscription, expiry_date: e.target.value}})} />
               </div>

               {/* ТОГЛИ */}
               <div style={{background: '#000', padding: 15, borderRadius: 12, marginBottom: 10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                   <span style={{color: '#aaa'}}>Активний абонемент</span>
                   <button onClick={() => setEditingUser({...editingUser, subscription: {...editingUser.subscription, active: !editingUser.subscription.active}})} 
                           style={toggleStyle(editingUser.subscription.active, false)}>
                       {editingUser.subscription.active ? "ТАК" : "НІ"}
                   </button>
               </div>

               <div style={{background: '#200', padding: 15, borderRadius: 12, marginBottom: 20, display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #500'}}>
                   <span style={{color: '#ffaaaa', fontWeight:'bold'}}>ЗАБЛОКУВАТИ</span>
                   <button onClick={() => setEditingUser({...editingUser, is_blocked: !editingUser.is_blocked})} 
                           style={toggleStyle(editingUser.is_blocked, true)}>
                       {editingUser.is_blocked ? "БАН" : "ОК"}
                   </button>
               </div>

               <button onClick={handleSave} style={{width:'100%', padding:16, background:'#22c55e', border:'none', borderRadius:12, fontSize:16, fontWeight:'800', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center', gap:10}}>
                   <FaSave/> ЗБЕРЕГТИ
               </button>
           </div>
        </div>
      );
  }

  // --- СПИСОК ---
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
          <h2 style={{ fontSize: 24, margin: 0, fontWeight: '800', color: '#fff' }}>Керування</h2>
          <button onClick={fetchUsers} style={{background: 'transparent', border: 'none', color: '#666', cursor:'pointer'}}><FaSync size={18}/></button>
      </div>
      
      <div style={{background: '#222', padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', marginBottom: 20, border:'1px solid #333'}}>
        <FaSearch color="#666" style={{marginRight: 10}}/>
        <input 
          type="text" 
          placeholder="Пошук..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize:16}}
        />
      </div>

      {loading ? <p style={{textAlign:'center', color:'#666'}}>Завантаження...</p> : (
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
           {filteredUsers.length === 0 && <p style={{textAlign:'center', color:'#444'}}>Порожньо</p>}
           
           {filteredUsers.map(user => (
             <div key={user.id} onClick={() => setEditingUser(user)}
                  style={{
                      padding: 16, 
                      background: user.is_blocked ? 'rgba(255,0,0,0.1)' : '#18181b', 
                      borderRadius: 16, 
                      border: user.is_blocked ? '1px solid red' : (user.subscription?.active ? '1px solid #333' : '1px solid #222'),
                      cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                
                <div>
                     <div style={{fontWeight: 'bold', fontSize: 16, color: user.is_blocked ? '#ff4444' : '#fff', display:'flex', alignItems:'center', gap:8}}>
                         {user.name || "Гість"} 
                         {user.is_blocked && <FaBan size={14}/>}
                     </div>
                     <div style={{fontSize: 11, color: '#666', marginTop:2}}>
                        {user.username ? `@${user.username}` : `ID: ${user.id}`}
                     </div>
                </div>

                <div style={{background:'#333', width:35, height:35, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <FaUserEdit color="#fff" size={14}/>
                </div>

             </div>
           ))}
        </div>
      )}
    </div>
  );
};

const labelStyle = {display:'block', color:'#888', fontSize:12, marginBottom:5, paddingLeft:4};
const inputStyle = {width:'100%', background:'#000', border:'1px solid #333', padding:12, borderRadius:10, color:'#fff', fontSize:16, boxSizing:'border-box', outline:'none'};

const toggleStyle = (isActive, isDanger) => ({
    padding: '8px 16px',
    borderRadius: 20,
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    background: isActive ? (isDanger ? '#ef4444' : '#22c55e') : '#333',
    color: isActive ? '#000' : '#888',
    minWidth: 60
});

export default AdminScreen;