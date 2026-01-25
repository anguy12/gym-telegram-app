# backend/models.py
from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True) # Telegram ID
    name = Column(String, default="Клієнт")
    avatar = Column(String, default="https://i.pravatar.cc/150?img=68")
    
    # Дані абонемента (зберігаємо все в одній таблиці для простоти)
    sub_active = Column(Boolean, default=False)
    sub_title = Column(String, nullable=True)
    sub_gym_name = Column(String, nullable=True)
    sub_expiry_date = Column(String, nullable=True)
    
    sub_days_left = Column(Integer, default=0)
    sub_days_total = Column(Integer, default=0)
    
    sub_sessions_left = Column(Integer, default=0)
    sub_sessions_total = Column(Integer, default=0)
    
    sub_type = Column(String, default="days") # 'days' або 'sessions'