# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

# Імпортуємо наші нові файли
from database import SessionLocal, engine
import models

# Створюємо таблиці в базі даних (якщо їх немає)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Функція для отримання сесії бази даних
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class BuyRequest(BaseModel):
    user_id: str
    title: str
    days: int
    sessions: int
    gym_id: str
    is_network: bool

# --- ЛОГІКА РОБОТИ З БАЗОЮ ---

@app.get("/")
def read_root():
    return {"message": "Gym Server with SQLite DB 🚀"}

@app.get("/api/profile/{user_id}")
def get_profile(user_id: str, db: Session = Depends(get_db)):
    # Шукаємо юзера в базі
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    # Якщо немає - створюємо нового
    if not user:
        user = models.User(id=user_id)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Формуємо красивий JSON для фронтенду
    return {
        "id": user.id,
        "name": user.name,
        "avatar": user.avatar,
        "subscription": {
            "active": user.sub_active,
            "title": user.sub_title,
            "gym_name": user.sub_gym_name,
            "expiry_date": user.sub_expiry_date,
            "days_left": user.sub_days_left,
            "days_total": user.sub_days_total,
            "sessions_left": user.sub_sessions_left,
            "sessions_total": user.sub_sessions_total,
            "type": user.sub_type
        }
    }

@app.post("/api/buy")
def buy_subscription(request: BuyRequest, db: Session = Depends(get_db)):
    # Знаходимо юзера
    user = db.query(models.User).filter(models.User.id == request.user_id).first()
    if not user:
        user = models.User(id=request.user_id)
        db.add(user)
    
    # Розрахунок дати
    today = datetime.now()
    expiry = today + timedelta(days=request.days)
    
    # Назва залу
    gym_label = ""
    if request.is_network:
        gym_label = "МЕРЕЖА (Всі зали)"
    elif request.gym_id == "polubotka":
        gym_label = "KOLIZEY (Полуботка)"
    elif request.gym_id == "myrnoho":
        gym_label = "KOLIZEY (Мирного)"
    else:
        gym_label = "Локальний"

    sub_type = "sessions" if request.sessions < 50 else "days"

    # Оновлюємо поля в Базі Даних
    user.sub_active = True
    user.sub_title = request.title
    user.sub_gym_name = gym_label
    user.sub_expiry_date = expiry.strftime("%d.%m.%Y")
    user.sub_days_left = request.days
    user.sub_days_total = request.days
    user.sub_sessions_left = request.sessions
    user.sub_sessions_total = request.sessions
    user.sub_type = sub_type

    # Зберігаємо зміни
    db.commit()
    db.refresh(user)

    # Повертаємо оновлений профіль
    return {
        "message": "OK", 
        "user": {
            "id": user.id,
            "name": user.name,
            "avatar": user.avatar,
            "subscription": {
                "active": user.sub_active,
                "title": user.sub_title,
                "gym_name": user.sub_gym_name,
                "expiry_date": user.sub_expiry_date,
                "days_left": user.sub_days_left,
                "days_total": user.sub_days_total,
                "sessions_left": user.sub_sessions_left,
                "sessions_total": user.sub_sessions_total,
                "type": user.sub_type
            }
        }
    }

# --- ДАНІ ПРО ЗАЛИ (Ціни залишаємо як є) ---
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