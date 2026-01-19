import requests
import json


BOT_TOKEN = "8286774536:AAFQV7Z__of6UdWVeNTYKuFDI9UrwMWTG-o"


CHAT_ID = "7696439716" 


WEB_APP_URL = "https://gym-telegram-app.vercel.app/"

def send_big_button():
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    
    payload = {
        "chat_id": CHAT_ID,
        "text": "Тисни на кнопку знизу, щоб відкрити зал! 👇💪",
        "reply_markup": {
            "keyboard": [
                [
                    {
                        "text": "МІЙ АБОНЕМЕНТ 🔥", # Текст на кнопці
                        "web_app": {
                            "url": WEB_APP_URL
                        }
                    }
                ]
            ],
            "resize_keyboard": True, # Робить кнопку гарною по висоті
            "is_persistent": True    # Кнопка не зникне
        }
    }
    
    headers = {"Content-Type": "application/json"}
    
    response = requests.post(url, json=payload, headers=headers)
    print(response.json())

if __name__ == "__main__":
    send_big_button()