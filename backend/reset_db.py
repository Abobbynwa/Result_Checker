from app import create_app
from extensions import db
from models.student import Student
from models.result import Result
from models.subject import Subject
from models.admin import Admin

# Optional if login log model exists
try:
    from models.login_log import LoginLog
except ImportError:
    LoginLog = None

app = create_app()

with app.app_context():
    print("⚠️ Dropping all tables...")
    db.drop_all()
    print("✅ Tables dropped.")

    print("🛠️ Recreating tables...")
    db.create_all()
    print("✅ Tables recreated successfully.")

    if LoginLog:
        print("📜 Including login logs table.")
