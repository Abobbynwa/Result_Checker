from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.admin import Admin
from models.student import Student
from models.login_log import LoginLog
from utils.password_hasher import verify_password
from extensions import db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    admin = Admin.query.filter_by(username=username).first()
    if admin and verify_password(password, admin.password):
        token = create_access_token(identity={"id": admin.id, "role": "admin"})
        return jsonify(role="admin", token=token, username=admin.username)

    student = Student.query.filter_by(username=username).first()
    if student and student.password and student.check_password(password):
        log = LoginLog(student_id=student.id, ip=request.remote_addr, timestamp=datetime.utcnow())
        db.session.add(log)
        db.session.commit()

        token = create_access_token(identity={"id": student.id, "role": "student"})
        return jsonify(
            role="student",
            token=token,
            id=student.id,
            name=student.name,
            class_name=student.class_name,
            reg_no=student.reg_no,
        )

    return jsonify({"error": "Invalid credentials"}), 401


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    dob = (data.get("dob") or "").strip()
    new_password = data.get("new_password") or ""

    if not username or not dob or not new_password:
        return jsonify({"msg": "Username, date of birth/reset code, and new password are required"}), 400

    if len(new_password) < 6:
        return jsonify({"msg": "Password must be at least 6 characters"}), 400

    student = Student.query.filter_by(username=username).first()
    if not student:
        return jsonify({"msg": "Student not found"}), 404

    if not student.dob or student.dob.strip() != dob:
        return jsonify({"msg": "Incorrect date of birth/reset code"}), 403

    student.set_password(new_password)
    db.session.commit()

    return jsonify({"msg": "Password reset successful"})


@auth_bp.route("/register", methods=["POST"])
def register_student():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    reg_no = (data.get("reg_no") or "").strip()
    password = data.get("password") or ""

    if not username or not reg_no or not password:
        return jsonify({"msg": "Username, registration number, and password are required"}), 400

    if len(password) < 6:
        return jsonify({"msg": "Password must be at least 6 characters"}), 400

    existing = Student.query.filter_by(username=username, reg_no=reg_no).first()
    if not existing:
        return jsonify({"msg": "Student not found in admin records"}), 404

    if existing.password:
        return jsonify({"msg": "Student already registered"}), 409

    existing.set_password(password)
    db.session.commit()

    return jsonify({"msg": "Student registered successfully"}), 201
