# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Dict

app = FastAPI()

# --- CORS ---
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ПРОСТА БАЗА ДАНИХ ---
users_db: Dict[str, dict] = {}

# Функція створення нового юзера (автоматично)
def create_default_user(user_id: str):
    return {
        "id": user_id,
        "name": f"Клієнт {user_id[-4:]}" if len(user_id) > 4 else "Тестовий Клієнт",
        "avatar": "https://i.pravatar.cc/150?img=12",
        "subscription": {
            "active": False, # По замовчуванню немає абонемента
            "title": None,
            "days_left": 0,
            "sessions_left": 0
        }
    }

class BuyRequest(BaseModel):
    user_id: str
    title: str
    days: int
    sessions: int

# --- API ---

@app.get("/")
def read_root():
    return {"message": "Gym Server Running (Dev Mode)"}

@app.get("/api/profile/{user_id}")
def get_profile(user_id: str):
    # Якщо юзера немає - створюємо його автоматично
    if user_id not in users_db:
        users_db[user_id] = create_default_user(user_id)
    
    user = users_db[user_id]
    
    # Перевірка терміну дії (якщо є абонемент)
    if user["subscription"]["active"]:
        try:
            expiry = datetime.strptime(user["subscription"]["expiry_date"], "%d.%m.%Y")
            if datetime.now() > expiry:
                user["subscription"]["active"] = False
            else:
                delta = expiry - datetime.now()
                user["subscription"]["days_left"] = delta.days + 1
        except:
            pass # Ігноруємо помилки дат в режимі розробки
            
    return user

@app.post("/api/buy")
def buy_subscription(request: BuyRequest):
    user_id = request.user_id
    if user_id not in users_db:
        users_db[user_id] = create_default_user(user_id)
        
    today = datetime.now()
    expiry = today + timedelta(days=request.days)
    is_unlimited = request.sessions > 100

    users_db[user_id]["subscription"] = {
        "active": True,
        "title": request.title,
        "expiry_date": expiry.strftime("%d.%m.%Y"),
        "days_left": request.days,
        "days_total": request.days,
        "sessions_left": request.sessions,
        "sessions_total": request.sessions,
        "is_unlimited": is_unlimited
    }
    return {"message": "OK", "user": users_db[user_id]}

# --- ДАНІ ---
fake_gym_data = { 
    "polubotka": { 
        "id": "polubotka", "name": "KOLIZEY I", "address": "вул. П.Полуботка, 31", "phone": "0971310039", 
        "prices": [ 
            { "title": "Ранковий", "desc": "12 тренувань/міс", "local": 950, "network": 1300 }, 
            { "title": "Безлім", "desc": "Місячний абонемент", "local": 1300, "network": 1800 },
            { "title": "Разове", "desc": "Одне тренування", "local": 300, "network": None }
        ] 
    } 
} 
@app.get("/api/gyms")
def get_gyms(): return fake_gym_data
@app.get("/api/trainers")
def get_trainers(): return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)