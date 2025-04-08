from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    reg_no = db.Column(db.String(50), unique=True)
    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(255))
    dob = db.Column(db.String(5))         # Format: DDMM
    class_name = db.Column(db.String(20))
    gender = db.Column(db.String(10))     # 👈 NEW: Male / Female / Other
    email = db.Column(db.String(100))
    secret_q = db.Column(db.String(150))
    secret_ans = db.Column(db.String(150))

    results = db.relationship('Result', backref='student', lazy=True)
    logins = db.relationship('LoginLog', backref='student', lazy=True)

    def set_password(self, raw_password):
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password, raw_password)
