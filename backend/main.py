# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Dict

app = FastAPI()

# --- CORS (ДОЗВОЛЯЄМО ВСІМ) ---
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 💾 ТВОЯ ВІРТУАЛЬНА БАЗА КЛІЄНТІВ ---
# ТЕСТОВІ КОДИ: 1001, 1002, 7777
VALID_CARDS = {
    "1001": { "name": "Олег (VIP)", "days": 365, "sessions": 9999, "role": "vip" },
    "1002": { "name": "Марія К.", "days": 30, "sessions": 12, "role": "standart" },
    "7777": { "name": "Адмін", "days": 9999, "sessions": 9999, "role": "admin" }
}

# Тимчасова пам'ять для активних сесій
users_sessions: Dict[str, dict] = {}

class LoginRequest(BaseModel):
    code: str

# --- ЛОГІКА ВХОДУ ---
@app.post("/api/login")
def login_user(req: LoginRequest):
    code = req.code.strip()
    
    if code in VALID_CARDS:
        card_data = VALID_CARDS[code]
        user_id = f"user_{code}" 
        
        # Розрахунок дати закінчення
        expiry = datetime.now() + timedelta(days=card_data["days"])
        
        # Створюємо профіль
        user_profile = {
            "id": user_id,
            "name": card_data["name"],
            "avatar": f"https://i.pravatar.cc/150?u={user_id}",
            "subscription": {
                "active": True,
                "title": f"Абонемент {code}",
                "expiry_date": expiry.strftime("%d.%m.%Y"),
                "days_left": card_data["days"],
                "days_total": card_data["days"],
                "sessions_left": card_data["sessions"],
                "sessions_total": card_data["sessions"],
                "is_unlimited": card_data["sessions"] > 100
            }
        }
        
        users_sessions[user_id] = user_profile
        return {"status": "success", "user": user_profile}
    
    else:
        raise HTTPException(status_code=404, detail="Невірний код картки")

# --- ОТРИМАННЯ ПРОФІЛЮ ---
@app.get("/api/profile/{user_id}")
def get_profile(user_id: str):
    if user_id in users_sessions:
        return users_sessions[user_id]
    
    # Якщо ID не знайдено або це гість
    return {
        "id": "guest",
        "name": "Гість",
        "avatar": "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        "subscription": {
            "active": False,
            "title": None,
            "days_left": 0,
            "sessions_left": 0
        }
    }

# --- ДОДАТКОВІ ДАНІ ---
fake_gym_data = { "polubotka": { "id": "polubotka", "name": "KOLIZEY", "address": "вул. П.Полуботка, 31", "phone": "0971310039", "prices": [{"title":"Разове","local":300,"network":None}] } } 
@app.get("/api/gyms")
def get_gyms(): return fake_gym_data
@app.get("/api/trainers")
def get_trainers(): return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)