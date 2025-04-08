from flask import Blueprint, request, jsonify
from models.admin import Admin
from models.student import Student
from models.login_log import LoginLog
from utils.password_hasher import verify_password
from extensions import db
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

# 🔐 Login (Admin + Student)
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Admin Login
    admin = Admin.query.filter_by(username=username).first()
    if admin and verify_password(password, admin.password):
        token = create_access_token(identity={"id": admin.id, "role": "admin"})
        return jsonify(role="admin", token=token)

    # Student Login
    student = Student.query.filter_by(username=username).first()
    if student and student.check_password(password):
        log = LoginLog(student_id=student.id, ip=request.remote_addr, timestamp=datetime.utcnow())
        db.session.add(log)
        db.session.commit()

        token = create_access_token(identity={"id": student.id, "role": "student"})
        return jsonify(
            role="student",
            token=token,
            name=student.name,
            class_name=student.class_name,
            reg_no=student.reg_no
        )

    return jsonify({"error": "Invalid credentials"}), 401

# 🔐 Forgot Password
@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    username = data.get('username')
    dob = data.get('dob')
    new_password = data.get('new_password')

    student = Student.query.filter_by(username=username).first()

    if not student:
        return jsonify({"msg": "Student not found"}), 404

    if student.dob.strip() != dob.strip():
        return jsonify({"msg": "Incorrect date of birth"}), 403

    student.set_password(new_password)
    db.session.commit()

    return jsonify({"msg": "Password reset successful"})

# 🧠 Student Self-Registration (Only if Admin has registered you initially)
@auth_bp.route('/register', methods=['POST'])
def register_student():
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    reg_no = data.get('reg_no')
    dob = data.get('dob')
    class_name = data.get('class_name')
    gender = data.get('gender')
    password = data.get('password')

    if not all([name, username, reg_no, dob, class_name, gender, password]):
        return jsonify({"msg": "All fields are required"}), 400

    if gender not in ['Male', 'Female', 'Other']:
        return jsonify({"msg": "Invalid gender"}), 400

    if len(password) < 4:
        return jsonify({"msg": "Password too short"}), 400

    if len(dob) != 4 or not dob.isdigit():
        return jsonify({"msg": "DOB must be 4-digit (DDMM)"}), 400

    # 🧪 Check if record exists but not yet registered
    existing = Student.query.filter_by(username=username, reg_no=reg_no).first()
    if not existing:
        return jsonify({"msg": "Student not found in admin records"}), 404

    if existing.password:
        return jsonify({"msg": "Student already registered"}), 409

    existing.name = name
    existing.dob = dob
    existing.gender = gender
    existing.class_name = class_name
    existing.set_password(password)

    db.session.commit()
    return jsonify({"msg": "Student registered successfully"}), 201
