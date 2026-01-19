# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Dict

app = FastAPI()

# --- 1. CORS (ДОЗВОЛЯЄМО ВСІМ) ---
# Це критично важливо для роботи з Vercel
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- БАЗА ДАНИХ ---
users_db: Dict[str, dict] = {}

def create_new_user(user_id: str):
    return {
        "id": user_id,
        "name": f"Користувач {user_id}", 
        "avatar": "https://i.pravatar.cc/150?img=68",
        "subscription": {
            "active": False,
            "title": None,
            "expiry_date": None,
            "days_left": 0,
            "days_total": 0,
            "sessions_left": 0,
            "sessions_total": 0,
            "is_unlimited": False
        }
    }

class BuyRequest(BaseModel):
    user_id: str
    title: str
    days: int
    sessions: int

# --- API ROUTES ---

@app.get("/")
def read_root():
    return {"message": "Вітаю! Сервер працює."}

@app.get("/api/profile/{user_id}")
def get_profile(user_id: str):
    if user_id not in users_db:
        users_db[user_id] = create_new_user(user_id)
    
    user = users_db[user_id]
    
    if user["subscription"]["active"]:
        expiry = datetime.strptime(user["subscription"]["expiry_date"], "%d.%m.%Y")
        today = datetime.now()
        
        if today > expiry:
            user["subscription"]["active"] = False
        else:
            delta = expiry - today
            user["subscription"]["days_left"] = delta.days + 1

    return user

@app.post("/api/buy")
def buy_subscription(request: BuyRequest):
    user_id = request.user_id
    if user_id not in users_db:
        users_db[user_id] = create_new_user(user_id)
        
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
    
    return {"message": "Успішно!", "profile": users_db[user_id]}

# --- ДАНІ ---
fake_gym_data = {
    "polubotka": { "id": "polubotka", "name": "KOLIZEY I", "address": "вул. П.Полуботка, 31", "phone": "097 131 00 39", "prices": [ { "title": "Ранковий", "desc": "12 тренувань/міс, вхід до 13:00", "local": 950, "network": 1300 }, { "title": "12 Тренувань", "desc": "Без обмежень в часі дня", "local": 1150, "network": 1650 }, { "title": "Безлім", "desc": "Місячний абонемент", "local": 1300, "network": 1800 }, { "title": "Вихідний", "desc": "Абонемент вихідного дня", "local": 800, "network": 1150 }, { "title": "3 Місяці", "desc": "Квартальний безліміт", "local": 3450, "network": 4850 }, { "title": "Піврічний", "desc": "Безліміт на 6 місяців", "local": 6250, "network": 8550 }, { "title": "Річний", "desc": "Безліміт на 12 місяців", "local": 9500, "network": 13400 }, { "title": "Разове", "desc": "Одне тренування", "local": 300, "network": None }, { "title": "Тренерський", "desc": "Для співпраці з тренерами", "local": 3500, "network": 9000 }, ] },
    "myrnoho": { "id": "myrnoho", "name": "KOLIZEY II", "address": "вул. П.Мирного, 24Г", "phone": "098 661 77 15", "prices": [ { "title": "Ранковий", "desc": "12 тренувань/міс, вхід до 13:00", "local": 1150, "network": 1300 }, { "title": "12 Тренувань", "desc": "Без обмежень в часі дня", "local": 1450, "network": 1650 }, { "title": "Безлім", "desc": "Місячний абонемент", "local": 1600, "network": 1800 }, { "title": "Вихідний", "desc": "Абонемент вихідного дня", "local": 1000, "network": 1150 }, { "title": "3 Місяці", "desc": "Квартальний безліміт", "local": 4300, "network": 4850 }, { "title": "Піврічний", "desc": "Безліміт на 6 місяців", "local": 7800, "network": 8550 }, { "title": "Річний", "desc": "Безліміт на 12 місяців", "local": 11800, "network": 13400 }, { "title": "Разове", "desc": "Одне тренування", "local": 300, "network": None }, { "title": "Тренерський", "desc": "Для співпраці з тренерами", "local": 6000, "network": 9000 }, ] }
}
fake_trainers = [{ "id": 1, "name": "Роман", "role": "Bodybuilding", "gym": "polubotka", "img": "/trainers/roman.jpg", "instagram": "roman_kishchukk", "phone": None }, { "id": 2, "name": "Даша", "role": "Fitness / Stretching", "gym": "polubotka", "img": "/trainers/dasha.jpg", "instagram": "shabanitsa.fit", "phone": None }, { "id": 3, "name": "Назар", "role": "Powerlifting", "gym": "polubotka", "img": "/trainers/nazar.jpg", "instagram": "nazarich.", "phone": None }, { "id": 4, "name": "Христина", "role": "Rehabilitation", "gym": "polubotka", "img": "/trainers/khrystyna.jpg", "instagram": "kristinkakachmar", "phone": None }, { "id": 5, "name": "Стас", "role": "Senior Coach", "gym": "polubotka", "img": "/trainers/stas.jpg", "instagram": "s.korchynskyi", "phone": None }, { "id": 101, "name": "Тренер Мирного 1", "role": "Gym Instructor", "gym": "myrnoho", "img": "https://i.pravatar.cc/300?img=12", "instagram": "kolizey.lviv", "phone": "0980000000" }, { "id": 102, "name": "Тренер Мирного 2", "role": "Crossfit", "gym": "myrnoho", "img": "https://i.pravatar.cc/300?img=33", "instagram": "kolizey.lviv", "phone": "0980000000" }]

@app.get("/api/trainers")
def get_trainers(): return fake_trainers
@app.get("/api/gyms")
def get_gym_data(): return fake_gym_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)