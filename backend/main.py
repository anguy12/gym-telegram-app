# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Dict, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

users_db: Dict[str, dict] = {}

def create_default_user(user_id: str):
    return {
        "id": user_id,
        "name": "Клієнт", 
        "avatar": "https://i.pravatar.cc/150?img=68",
        "subscription": {
            "active": False,
            "title": None,
            "gym_name": None,
            "days_left": 0,
            "sessions_left": 0
        }
    }

class BuyRequest(BaseModel):
    user_id: str
    title: str
    days: int
    sessions: int
    gym_id: str
    is_network: bool

@app.get("/")
def read_root(): return {"message": "Gym Prices Updated"}

@app.get("/api/profile/{user_id}")
def get_profile(user_id: str):
    if user_id not in users_db:
        users_db[user_id] = create_default_user(user_id)
    return users_db[user_id]

@app.post("/api/buy")
def buy_subscription(request: BuyRequest):
    user_id = request.user_id
    if user_id not in users_db:
        users_db[user_id] = create_default_user(user_id)
    
    today = datetime.now()
    expiry = today + timedelta(days=request.days)
    
    gym_label = ""
    if request.is_network:
        gym_label = "МЕРЕЖА (Всі зали)"
    elif request.gym_id == "polubotka":
        gym_label = "KOLIZEY (Полуботка)"
    elif request.gym_id == "myrnoho":
        gym_label = "KOLIZEY (Мирного)"
    else:
        gym_label = "Локальний"

    # Якщо сесій < 50 (наприклад 12 або 1), то показуємо смужку по заняттях
    # Якщо це безліміт або довгостроковий абонемент - показуємо дні
    sub_type = "sessions" if request.sessions < 50 else "days"

    users_db[user_id]["subscription"] = {
        "active": True,
        "title": request.title,
        "gym_name": gym_label,
        "expiry_date": expiry.strftime("%d.%m.%Y"),
        "days_left": request.days,
        "days_total": request.days,
        "sessions_left": request.sessions,
        "sessions_total": request.sessions,
        "type": sub_type 
    }
    return {"message": "OK", "user": users_db[user_id]}

# 👇👇👇 ТОЧНІ ЦІНИ З ФОТОГРАФІЙ 👇👇👇
fake_gym_data = {
    "polubotka": {
        "id": "polubotka",
        "name": "KOLIZEY I",
        "address": "вул. П.Полуботка, 31",
        "phone": "097 131 00 39",
        "prices": [
            { "title": "Ранковий", "desc": "12 тренувань/міс (вхід до 13:00)", "local": 950, "network": 1300 },
            { "title": "12 Тренувань", "desc": "На місяць (без обмежень часу)", "local": 1150, "network": 1650 },
            { "title": "Безліміт", "desc": "На місяць (без обмежень)", "local": 1300, "network": 1800 },
            { "title": "Вихідний", "desc": "Тільки Сб та Нд", "local": 800, "network": 1150 },
            { "title": "3 Місяці", "desc": "Квартальний безліміт", "local": 3450, "network": 4850 },
            { "title": "Піврічний", "desc": "Безліміт на 6 місяців", "local": 6250, "network": 8550 },
            { "title": "Річний", "desc": "Безліміт на 12 місяців", "local": 9500, "network": 13400 },
            { "title": "Разове", "desc": "Одне тренування", "local": 300, "network": None },
            { "title": "Тренерський", "desc": "Для співпраці з тренерами", "local": 3500, "network": 9000 },
        ]
    },
    "myrnoho": {
        "id": "myrnoho",
        "name": "KOLIZEY II",
        "address": "вул. П.Мирного, 24Г",
        "phone": "098 661 77 15",
        "prices": [
            { "title": "Ранковий", "desc": "12 тренувань/міс (вхід до 13:00)", "local": 1150, "network": 1300 },
            { "title": "12 Тренувань", "desc": "На місяць (без обмежень часу)", "local": 1450, "network": 1650 },
            { "title": "Безліміт", "desc": "На місяць (без обмежень)", "local": 1600, "network": 1800 },
            { "title": "Вихідний", "desc": "Тільки Сб та Нд", "local": 1000, "network": 1150 },
            { "title": "3 Місяці", "desc": "Квартальний безліміт", "local": 4300, "network": 4850 },
            { "title": "Піврічний", "desc": "Безліміт на 6 місяців", "local": 7800, "network": 8550 },
            { "title": "Річний", "desc": "Безліміт на 12 місяців", "local": 11800, "network": 13400 },
            { "title": "Разове", "desc": "Одне тренування", "local": 300, "network": None },
            { "title": "Тренерський", "desc": "Для співпраці з тренерами", "local": 6000, "network": 9000 },
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