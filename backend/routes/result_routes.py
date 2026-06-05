from flask import Blueprint, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.result import Result
from models.subject import Subject
from models.student import Student
from utils.pdf_generator import generate_result_pdf
from utils.mailer import send_result_email
import io

result_bp = Blueprint("result", __name__)


def calculate_grade(score):
    score = int(score)
    if score >= 70:
        return "A"
    if score >= 60:
        return "B"
    if score >= 50:
        return "C"
    if score >= 40:
        return "D"
    return "F"


def get_remark(grade):
    return {
        "A": "Excellent",
        "B": "Very Good",
        "C": "Good",
        "D": "Fair",
        "F": "Needs Improvement",
    }.get(grade, "")


def get_student_or_404(reg_no):
    student = Student.query.filter_by(reg_no=reg_no).first()
    if not student:
        return None, (jsonify({"msg": "Student not found"}), 404)
    return student, None


def require_student_owner(identity, student):
    return identity.get("role") == "student" and int(identity.get("id")) == int(student.id)


def build_result_payload(student):
    results = Result.query.filter_by(student_id=student.id).all()
    if not results:
        return None, (jsonify({"msg": "No results found"}), 404)

    payload = []
    result_data = []
    total = 0

    for result in results:
        subject = Subject.query.get(result.subject_id)
        if not subject:
            continue

        grade = calculate_grade(result.score)
        remark = get_remark(grade)
        total += int(result.score)

        payload.append({
            "subject": subject.name,
            "score": result.score,
            "grade": grade,
            "remark": remark,
            "term": result.term,
            "session": result.session,
        })
        result_data.append((subject.name, result.score, grade))

    if not payload:
        return None, (jsonify({"msg": "No valid results found"}), 404)

    average = round(total / len(payload), 2)
    return {
        "student": student.name,
        "class": student.class_name,
        "reg_no": student.reg_no,
        "email": student.email,
        "results": payload,
        "result_data": result_data,
        "total": total,
        "average": average,
    }, None


@result_bp.route("/view/<path:reg_no>", methods=["GET"])
@jwt_required()
def view_result(reg_no):
    identity = get_jwt_identity()
    student, error = get_student_or_404(reg_no)
    if error:
        return error

    if identity.get("role") == "student" and not require_student_owner(identity, student):
        return jsonify({"msg": "Access denied"}), 403
    if identity.get("role") not in ["student", "admin"]:
        return jsonify({"msg": "Access denied"}), 403

    data, error = build_result_payload(student)
    if error:
        return error

    data.pop("result_data", None)
    return jsonify(data)


@result_bp.route("/email/<path:reg_no>", methods=["POST"])
@jwt_required()
def email_result(reg_no):
    identity = get_jwt_identity()
    student, error = get_student_or_404(reg_no)
    if error:
        return error

    if identity.get("role") == "student" and not require_student_owner(identity, student):
        return jsonify({"msg": "Access denied"}), 403
    if identity.get("role") not in ["student", "admin"]:
        return jsonify({"msg": "Access denied"}), 403
    if not student.email:
        return jsonify({"msg": "Student email is missing"}), 400

    data, error = build_result_payload(student)
    if error:
        return error

    pdf_data = generate_result_pdf(
        student_name=student.name,
        class_name=student.class_name,
        reg_no=student.reg_no,
        term=data["results"][0].get("term") or "Current Term",
        session=data["results"][0].get("session") or "Current Session",
        results=data["result_data"],
        total=data["total"],
        average=data["average"],
    )

    html = f"""
    <h3>Result for {student.name}</h3>
    <p>Attached is the result sheet for {student.class_name}.</p>
    """

    send_result_email(
        to_email=student.email,
        subject=f"{student.name}'s Academic Result",
        html=html,
        attachments=[{"filename": f"{student.name}_result.pdf", "data": pdf_data}],
    )

    return jsonify({"msg": "Result emailed successfully"})


@result_bp.route("/download/<path:reg_no>", methods=["GET"])
@jwt_required()
def download_result(reg_no):
    identity = get_jwt_identity()
    student, error = get_student_or_404(reg_no)
    if error:
        return error

    if identity.get("role") == "student" and not require_student_owner(identity, student):
        return jsonify({"msg": "Access denied"}), 403
    if identity.get("role") not in ["student", "admin"]:
        return jsonify({"msg": "Access denied"}), 403

    return generate_result_pdf_response(student)


@result_bp.route("/admin/download/<path:reg_no>", methods=["GET"])
@jwt_required()
def admin_download_result(reg_no):
    identity = get_jwt_identity()
    if identity.get("role") != "admin":
        return jsonify({"msg": "Only admins can download student results"}), 403

    student, error = get_student_or_404(reg_no)
    if error:
        return error

    return generate_result_pdf_response(student)


def generate_result_pdf_response(student):
    data, error = build_result_payload(student)
    if error:
        return error

    pdf_bytes = generate_result_pdf(
        student_name=student.name,
        class_name=student.class_name,
        reg_no=student.reg_no,
        term=data["results"][0].get("term") or "Current Term",
        session=data["results"][0].get("session") or "Current Session",
        results=data["result_data"],
        total=data["total"],
        average=data["average"],
    )

    return send_file(
        io.BytesIO(pdf_bytes),
        download_name=f"{student.name}_result.pdf",
        mimetype="application/pdf",
        as_attachment=True,
    )
