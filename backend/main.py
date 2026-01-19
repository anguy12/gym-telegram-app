# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

app = FastAPI()

# --- 1. CORS (Дозвіл для React) ---
# Це дозволяє твоєму фронтенду (порт 5173) брати дані з бекенду (порт 8000)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. ДАНІ (Імітація бази даних) ---

# Профіль користувача
fake_user_profile = {
    "name": "Олександр",
    "avatar": "https://i.pravatar.cc/150?img=12",
    "subscription": {
        "title": "GOLD Абонемент",
        "active": True,
        "totalSessions": 20,
        "leftSessions": 12,
        "expiryDate": "25.11"
    }
}

# Повний список абонементів та цін
fake_gym_data = {
  "polubotka": {
    "id": "polubotka",
    "name": "KOLIZEY I",
    "address": "вул. П.Полуботка, 31",
    "phone": "097 131 00 39",
    "prices": [
      { "title": "Ранковий", "desc": "12 тренувань/міс, вхід до 13:00", "local": 950, "network": 1300 },
      { "title": "12 Тренувань", "desc": "Без обмежень в часі дня", "local": 1150, "network": 1650 },
      { "title": "Безлім", "desc": "Місячний абонемент", "local": 1300, "network": 1800 },
      { "title": "Вихідний", "desc": "Абонемент вихідного дня", "local": 800, "network": 1150 },
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
      { "title": "Ранковий", "desc": "12 тренувань/міс, вхід до 13:00", "local": 1150, "network": 1300 },
      { "title": "12 Тренувань", "desc": "Без обмежень в часі дня", "local": 1450, "network": 1650 },
      { "title": "Безлім", "desc": "Місячний абонемент", "local": 1600, "network": 1800 },
      { "title": "Вихідний", "desc": "Абонемент вихідного дня", "local": 1000, "network": 1150 },
      { "title": "3 Місяці", "desc": "Квартальний безліміт", "local": 4300, "network": 4850 },
      { "title": "Піврічний", "desc": "Безліміт на 6 місяців", "local": 7800, "network": 8550 },
      { "title": "Річний", "desc": "Безліміт на 12 місяців", "local": 11800, "network": 13400 },
      { "title": "Разове", "desc": "Одне тренування", "local": 300, "network": None },
      { "title": "Тренерський", "desc": "Для співпраці з тренерами", "local": 6000, "network": 9000 },
    ]
  }
}

# Список тренерів
fake_trainers = [
    { "id": 1, "name": "Роман", "role": "Bodybuilding", "gym": "polubotka", "img": "/trainers/roman.jpg", "instagram": "roman_kishchukk", "phone": None },
    { "id": 2, "name": "Даша", "role": "Fitness / Stretching", "gym": "polubotka", "img": "/trainers/dasha.jpg", "instagram": "shabanitsa.fit", "phone": None },
    { "id": 3, "name": "Назар", "role": "Powerlifting", "gym": "polubotka", "img": "/trainers/nazar.jpg", "instagram": "nazarich.", "phone": None },
    { "id": 4, "name": "Христина", "role": "Rehabilitation", "gym": "polubotka", "img": "/trainers/khrystyna.jpg", "instagram": "kristinkakachmar", "phone": None },
    { "id": 5, "name": "Стас", "role": "Senior Coach", "gym": "polubotka", "img": "/trainers/stas.jpg", "instagram": "s.korchynskyi", "phone": None },
    
    # Заглушки для Мирного
    { "id": 101, "name": "Тренер Мирного 1", "role": "Gym Instructor", "gym": "myrnoho", "img": "https://i.pravatar.cc/300?img=12", "instagram": "kolizey.lviv", "phone": "0980000000" },
    { "id": 102, "name": "Тренер Мирного 2", "role": "Crossfit", "gym": "myrnoho", "img": "https://i.pravatar.cc/300?img=33", "instagram": "kolizey.lviv", "phone": "0980000000" },
]

# --- 3. ROUTES (Маршрути API) ---

@app.get("/")
def read_root():
    return {"message": "Вітаю! Сервер працює."}

@app.get("/api/profile")
def get_profile():
    return fake_user_profile

@app.get("/api/trainers")
def get_trainers():
    return fake_trainers

@app.get("/api/gyms")
def get_gym_data():
    return fake_gym_data

# Цей блок дозволяє запускати сервер командою: python main.py
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)