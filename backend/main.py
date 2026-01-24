# backend/main.py
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
        "name": "Олександр", 
        "avatar": "https://i.pravatar.cc/150?img=68",
        "subscription": {
            "active": False,
            "title": None,
            "gym_name": None, # Додали поле для назви залу
            "days_left": 0,
            "sessions_left": 0
        }
    }

# Оновлена модель запиту
class BuyRequest(BaseModel):
    user_id: str
    title: str
    days: int
    sessions: int
    gym_id: str     # ID залу (polubotka/myrnoho)
    is_network: bool # Чи це мережевий?

@app.get("/")
def read_root(): return {"message": "Gym Server V2"}

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
    
    # Визначаємо красиву назву залу
    gym_label = ""
    if request.is_network:
        gym_label = "МЕРЕЖЕВИЙ (Всі зали)"
    elif request.gym_id == "polubotka":
        gym_label = "Зал: вул. П. Полуботка"
    elif request.gym_id == "myrnoho":
        gym_label = "Зал: вул. П. Мирного"
    else:
        gym_label = "Локальний абонемент"

    users_db[user_id]["subscription"] = {
        "active": True,
        "title": request.title,
        "gym_name": gym_label, # Зберігаємо назву
        "expiry_date": expiry.strftime("%d.%m.%Y"),
        "days_left": request.days,
        "days_total": request.days,
        "sessions_left": request.sessions,
        "sessions_total": request.sessions,
        # Якщо сесій менше 50, вважаємо, що це абонемент по заняттях (12, 8 тощо)
        "type": "sessions" if request.sessions < 50 else "days" 
    }
    return {"message": "OK", "user": users_db[user_id]}

# ДАНІ ПРО ЗАЛИ
fake_gym_data = {
    "polubotka": {
        "id": "polubotka",
        "name": "KOLIZEY I",
        "address": "вул. П.Полуботка, 31",
        "phone": "097 131 00 39",
        "prices": [
            { "title": "Ранковий", "desc": "12 тренувань (до 13:00)", "local": 950, "network": 1300 },
            { "title": "12 Тренувань", "desc": "Вільне відвідування", "local": 1150, "network": 1650 },
            { "title": "Безлім", "desc": "Місяць без обмежень", "local": 1300, "network": 1800 },
            { "title": "Студент", "desc": "За наявності студентського", "local": 1100, "network": None },
            { "title": "Річний", "desc": "365 днів спорту", "local": 9500, "network": 13400 },
        ]
    },
    "myrnoho": {
        "id": "myrnoho",
        "name": "KOLIZEY II",
        "address": "вул. П.Мирного, 24Г",
        "phone": "098 661 77 15",
        "prices": [
            { "title": "Ранковий", "desc": "12 тренувань (до 13:00)", "local": 1150, "network": 1300 },
            { "title": "12 Тренувань", "desc": "Вільне відвідування", "local": 1450, "network": 1650 },
            { "title": "Безлім", "desc": "Місяць без обмежень", "local": 1600, "network": 1800 },
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