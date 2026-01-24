from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Dict

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
def read_root(): return {"message": "Gym Server Fixed Prices"}

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

    # Логіка типу: якщо занять мало (<50), то це поштучні заняття. Інакше - дні.
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

# 👇 ТОЧНА КОПІЯ З ФОТОГРАФІЙ 👇
fake_gym_data = {
    "polubotka": {
        "id": "polubotka",
        "name": "KOLIZEY I",
        "address": "вул. П.Полуботка, 31",
        "phone": "097 131 00 39",
        "prices": [
            { "title": "РАНКОВИЙ", "desc": "12 тренувань на місяць, вхід до 13:00", "local": 950, "network": 1300 },
            { "title": "12 ТРЕНУВАНЬ", "desc": "На місяць, без обмежень в часі дня", "local": 1150, "network": 1650 },
            { "title": "БЕЗЛІМ", "desc": "Місячний абонемент", "local": 1300, "network": 1800 },
            { "title": "ВИХІДНИЙ", "desc": "Тільки Сб та Нд", "local": 800, "network": 1150 },
            { "title": "3 МІСЯЦІ", "desc": "Квартальний безліміт", "local": 3450, "network": 4850 },
            { "title": "ПІВРІЧНИЙ", "desc": "Безліміт на 6 місяців", "local": 6250, "network": 8550 },
            { "title": "РІЧНИЙ", "desc": "Безліміт на 12 місяців", "local": 9500, "network": 13400 },
            { "title": "РАЗОВЕ ТРЕНУВАННЯ", "desc": "Одне заняття", "local": 300, "network": None },
            { "title": "ТРЕНЕРСЬКИЙ", "desc": "Для співпраці з тренерами", "local": 3500, "network": 9000 },
        ]
    },
    "myrnoho": {
        "id": "myrnoho",
        "name": "KOLIZEY II",
        "address": "вул. П.Мирного, 24Г",
        "phone": "098 661 77 15",
        "prices": [
            { "title": "РАНКОВИЙ", "desc": "12 тренувань на місяць, вхід до 13:00", "local": 1150, "network": 1300 },
            { "title": "12 ТРЕНУВАНЬ", "desc": "На місяць, без обмежень в часі дня", "local": 1450, "network": 1650 },
            { "title": "БЕЗЛІМ", "desc": "Місячний абонемент", "local": 1600, "network": 1800 },
            { "title": "ВИХІДНИЙ", "desc": "Тільки Сб та Нд", "local": 1000, "network": 1150 },
            { "title": "3 МІСЯЦІ", "desc": "Квартальний безліміт", "local": 4300, "network": 4850 },
            { "title": "ПІВРІЧНИЙ", "desc": "Безліміт на 6 місяців", "local": 7800, "network": 8550 },
            { "title": "РІЧНИЙ", "desc": "Безліміт на 12 місяців", "local": 11800, "network": 13400 },
            { "title": "РАЗОВЕ ТРЕНУВАННЯ", "desc": "Одне заняття", "local": 300, "network": None },
            { "title": "ТРЕНЕРСЬКИЙ", "desc": "Для співпраці з тренерами", "local": 6000, "network": 9000 },
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