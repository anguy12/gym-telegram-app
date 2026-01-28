from sqlalchemy import Column, String, Integer, Boolean
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True) # Це і є Telegram ID
    name = Column(String)
    username = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    
    # Абонемент
    sub_active = Column(Boolean, default=False)
    sub_title = Column(String, default="")
    sub_gym_name = Column(String, default="")
    sub_expiry_date = Column(String, default="")
    
    # Лічильники
    sub_days_left = Column(Integer, default=0)
    sub_days_total = Column(Integer, default=0)
    sub_sessions_left = Column(Integer, default=0)
    sub_sessions_total = Column(Integer, default=0)
    sub_type = Column(String, default="days") # 'days' або 'sessions'

    #  НОВЕ ПОЛЕ: БЛОКУВАННЯ
    is_blocked = Column(Boolean, default=False)