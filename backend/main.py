# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

# Імпортуємо наші файли
from database import SessionLocal, engine
import models

# Створюємо таблиці в базі даних
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

# --- МОДЕЛІ ДАНИХ (Pydantic) ---

class BuyRequest(BaseModel):
    user_id: str
    title: str
    days: int
    sessions: int
    gym_id: str
    is_network: bool

# 🔥 НОВА МОДЕЛЬ: Для повного редагування адміном
class FullUpdateReq(BaseModel):
    user_id: str
    name: str
    sessions: int
    days: int
    is_active: bool
    is_blocked: bool
    gym_name: str
    sub_title: str
    expiry_date: str

# --- HELPER: Щоб не писати один і той самий JSON 10 разів ---
def user_to_json(user):
    return {
        "id": user.id,
        "name": user.name,
        "avatar": user.avatar,
        "is_blocked": user.is_blocked, # Додали статус блокування
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

# --- ЛОГІКА РОБОТИ З БАЗОЮ ---

@app.get("/")
def read_root():
    return {"message": "Gym Server with Admin Panel 🚀"}

# 1. ОТРИМАННЯ ПРОФІЛЮ (Оновлено)
@app.get("/api/profile/{user_id}")
def get_profile(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    # Реєстрація нового
    if not user:
        # Створюємо з коротким ім'ям, щоб адмін бачив ID
        user = models.User(id=user_id, name=f"Клієнт {user_id[-4:]}")
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user_to_json(user)

# 2. ПОКУПКА АБОНЕМЕНТА (Залишили як було)
@app.post("/api/buy")
def buy_subscription(request: BuyRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == request.user_id).first()
    if not user:
        user = models.User(id=request.user_id)
        db.add(user)
    
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

    sub_type = "sessions" if request.sessions < 50 else "days"

    user.sub_active = True
    user.sub_title = request.title
    user.sub_gym_name = gym_label
    user.sub_expiry_date = expiry.strftime("%d.%m.%Y")
    user.sub_days_left = request.days
    user.sub_days_total = request.days
    user.sub_sessions_left = request.sessions
    user.sub_sessions_total = request.sessions
    user.sub_type = sub_type
    # При покупці розблоковуємо, якщо був бан (опціонально)
    user.is_blocked = False 

    db.commit()
    db.refresh(user)

    return {"message": "OK", "user": user_to_json(user)}

# 🔥 3. АДМІН: ОТРИМАТИ ВСІХ ЛЮДЕЙ
@app.get("/api/users")
def get_all_users(db: Session = Depends(get_db)):
    # Повертаємо список всіх юзерів для пошуку
    users = db.query(models.User).all()
    # Перетворюємо кожного в JSON
    return [user_to_json(u) for u in users]

# 🔥 4. АДМІН: РЕДАГУВАННЯ / БАН
@app.post("/api/admin/edit_user")
def edit_user(req: FullUpdateReq, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Переписуємо всі поля (Сила Адміна)
    user.name = req.name
    user.sub_sessions_left = req.sessions
    user.sub_days_left = req.days
    user.sub_active = req.is_active
    user.is_blocked = req.is_blocked # <-- Головне поле бану
    user.sub_gym_name = req.gym_name
    user.sub_title = req.sub_title
    user.sub_expiry_date = req.expiry_date

    db.commit()
    db.refresh(user)
    return {"message": "Saved", "user": user_to_json(user)}

# --- ДАНІ ПРО ЗАЛИ ---
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