from app import create_app
from extensions import db
from models.admin import Admin
from utils.password_hasher import hash_password  # ✅ use this one!

app = create_app()

with app.app_context():
    existing = Admin.query.filter_by(username="admin").first()
    if existing:
        print("⚠️ Admin already exists. Skipping...")
    else:
        hashed_pw = hash_password("admin12345")  # ✅ bcrypt password only
        admin = Admin(username="admin", password=hashed_pw)
        db.session.add(admin)
        db.session.commit()
        print("✅ Admin seeded with username: admin and password: admin12345")
