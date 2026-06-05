from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.student import Student
from models.result import Result
from models.subject import Subject
from extensions import db
import pandas as pd

admin_bp = Blueprint("admin", __name__)


def require_admin():
    identity = get_jwt_identity()
    return identity and identity.get("role") == "admin"


@admin_bp.route("/register-student", methods=["POST"])
@jwt_required()
def register_student_by_admin():
    if not require_admin():
        return jsonify({"msg": "Unauthorized"}), 403

    data = request.get_json() or {}
    required = ["name", "username", "reg_no", "class_name", "gender", "dob", "password"]
    missing = [field for field in required if not data.get(field)]
    if missing:
        return jsonify({"msg": "Missing required fields", "missing": missing}), 400

    if data["gender"] not in ["Male", "Female", "Other"]:
        return jsonify({"msg": "Invalid gender"}), 400

    if len(str(data["password"])) < 6:
        return jsonify({"msg": "Password must be at least 6 characters"}), 400

    if Student.query.filter_by(username=data["username"]).first():
        return jsonify({"msg": "Username already exists"}), 409

    if Student.query.filter_by(reg_no=data["reg_no"]).first():
        return jsonify({"msg": "Registration number already exists"}), 409

    student = Student(
        name=data["name"].strip(),
        username=data["username"].strip(),
        reg_no=data["reg_no"].strip(),
        class_name=data["class_name"].strip(),
        gender=data["gender"],
        dob=str(data["dob"]).strip(),
        email=(data.get("email") or "").strip(),
    )
    student.set_password(data["password"])

    db.session.add(student)
    db.session.commit()

    return jsonify({"msg": "Student registered successfully", "student_id": student.id}), 201


@admin_bp.route("/students", methods=["GET"])
@jwt_required()
def list_students():
    if not require_admin():
        return jsonify({"msg": "Unauthorized"}), 403

    students = Student.query.order_by(Student.name.asc()).all()
    return jsonify({
        "students": [
            {
                "id": student.id,
                "name": student.name,
                "username": student.username,
                "reg_no": student.reg_no,
                "class_name": student.class_name,
                "gender": student.gender,
                "email": student.email,
            }
            for student in students
        ]
    })


@admin_bp.route("/upload_csv", methods=["POST"])
@jwt_required()
def upload_csv():
    if not require_admin():
        return jsonify({"msg": "Unauthorized"}), 403

    if "file" not in request.files:
        return jsonify({"msg": "CSV file required"}), 400

    file = request.files["file"]
    if not file.filename.lower().endswith(".csv"):
        return jsonify({"msg": "Only CSV files are allowed"}), 400

    try:
        df = pd.read_csv(file)
    except Exception:
        return jsonify({"msg": "Failed to read CSV file"}), 400

    required_columns = {"reg_no", "subject", "score", "term", "session"}
    missing_columns = required_columns - set(df.columns)
    if missing_columns:
        return jsonify({"msg": "Missing required CSV columns", "missing": sorted(missing_columns)}), 400

    added = 0
    skipped = 0
    log = []

    for index, row in df.iterrows():
        try:
            score = int(row["score"])
            if score < 0 or score > 100:
                raise ValueError
        except Exception:
            skipped += 1
            log.append(f"Row {index + 2}: invalid score")
            continue

        student = Student.query.filter_by(reg_no=str(row["reg_no"]).strip()).first()
        if not student:
            skipped += 1
            log.append(f"Row {index + 2}: student not found")
            continue

        subject_name = str(row["subject"]).strip()
        subject = Subject.query.filter_by(name=subject_name).first()
        if not subject:
            subject = Subject(name=subject_name)
            db.session.add(subject)
            db.session.flush()

        existing = Result.query.filter_by(
            student_id=student.id,
            subject_id=subject.id,
            term=str(row["term"]).strip(),
            session=str(row["session"]).strip(),
        ).first()

        if existing:
            existing.score = score
        else:
            db.session.add(Result(
                student_id=student.id,
                subject_id=subject.id,
                score=score,
                term=str(row["term"]).strip(),
                session=str(row["session"]).strip(),
            ))
        added += 1

    db.session.commit()
    return jsonify({"msg": "Upload complete", "added": added, "skipped": skipped, "log": log}), 200


@admin_bp.route("/class-analytics/<path:class_name>", methods=["GET"])
@jwt_required()
def class_analytics(class_name):
    if not require_admin():
        return jsonify({"msg": "Unauthorized"}), 403

    term = request.args.get("term")
    students = Student.query.filter_by(class_name=class_name).all()
    student_ids = [student.id for student in students]
    if not student_ids:
        return jsonify({"analytics": []})

    query = Result.query.filter(Result.student_id.in_(student_ids))
    if term:
        query = query.filter_by(term=term)

    rows = query.all()
    grouped = {}
    for row in rows:
        subject = Subject.query.get(row.subject_id)
        if not subject:
            continue
        grouped.setdefault(subject.name, []).append(int(row.score))

    analytics = [
        {
            "subject": subject,
            "average": round(sum(scores) / len(scores), 2),
            "highest": max(scores),
            "lowest": min(scores),
        }
        for subject, scores in grouped.items()
    ]

    return jsonify({"analytics": analytics})
