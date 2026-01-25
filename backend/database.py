# backend/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Створюємо файл бази даних gym.db прямо в папці проекту
SQLALCHEMY_DATABASE_URL = "sqlite:///./gym.db"

# Налаштування двигуна бази даних
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()