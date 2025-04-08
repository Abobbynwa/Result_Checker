from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.result import Result
from models.subject import Subject
from models.student import Student
from extensions import db
from utils.pdf_generator import generate_result_pdf
from utils.mailer import send_result_email
import io

result_bp = Blueprint('result', __name__)

# 📌 Helper Functions
def calculate_grade(score):
    if score >= 70: return 'A'
    elif score >= 60: return 'B'
    elif score >= 50: return 'C'
    elif score >= 40: return 'D'
    else: return 'F'

def get_remark(grade):
    return {
        'A': 'Excellent',
        'B': 'Very Good',
        'C': 'Good',
        'D': 'Fair',
        'F': 'Needs Improvement'
    }.get(grade, '')

# ✅ View Student Result
@result_bp.route('/view/<path:reg_no>', methods=['GET'])
@jwt_required()
def view_result(reg_no):
    user = get_jwt_identity()
    if user['role'] != 'student':
        return jsonify({"msg": "Only students can view results"}), 403

    student = Student.query.filter_by(reg_no=reg_no).first()
    if not student:
        return jsonify({"msg": "Student not found"}), 404

    results = Result.query.filter_by(student_id=student.id).all()
    if not results:
        return jsonify({"msg": "No results found"}), 404

    payload = []
    result_data = []
    total = 0

    for res in results:
        subject = Subject.query.get(res.subject_id)
        if not subject:
            continue
        grade = calculate_grade(res.score)
        remark = get_remark(grade)
        total += res.score

        payload.append({
            "subject": subject.name,
            "score": res.score,
            "grade": grade,
            "remark": remark
        })

        result_data.append((subject.name, res.score, grade))

    average = round(total / len(results), 2)

    return jsonify({
        "student": student.name,
        "class": student.class_name,
        "reg_no": student.reg_no,
        "results": payload,
        "total": total,
        "average": average
    })

# ✅ Email PDF Result to Student's Email
@result_bp.route('/email/<path:reg_no>', methods=['POST'])
@jwt_required()
def email_result(reg_no):
    identity = get_jwt_identity()
    if identity['role'] != 'student':
        return jsonify({"msg": "Access Denied"}), 403

    student = Student.query.filter_by(reg_no=reg_no).first()
    if not student:
        return jsonify({"msg": "Student not found"}), 404

    results = Result.query.filter_by(student_id=student.id).all()
    if not results:
        return jsonify({"msg": "No results to email"}), 404

    result_data = []
    total = 0

    for r in results:
        subject = Subject.query.get(r.subject_id)
        if not subject:
            continue
        grade = calculate_grade(r.score)
        total += r.score
        result_data.append((subject.name, r.score, grade))

    average = round(total / len(results), 2)

    pdf_data = generate_result_pdf(
        student_name=student.name,
        class_name=student.class_name,
        reg_no=student.reg_no,
        term="2nd Term",
        session="2023/2024",
        results=result_data,
        total=total,
        average=average
    )

    html = f"""
    <h3>Result for {student.name}</h3>
    <p>Attached is the result sheet for {student.class_name}.</p>
    """

    send_result_email(
        to_email=student.email,
        subject=f"{student.name}'s Academic Result",
        html=html,
        attachments=[{
            "filename": f"{student.name}_result.pdf",
            "data": pdf_data
        }]
    )

    return jsonify({"msg": "Result emailed successfully"})

# ✅ Download PDF Result (Student)
@result_bp.route('/download/<path:reg_no>', methods=['GET'])
@jwt_required()
def download_result(reg_no):
    identity = get_jwt_identity()
    if identity['role'] != 'student':
        return jsonify({"msg": "Only students can download results"}), 403

    return generate_result_pdf_response(reg_no)

# ✅ Admin Download Any Result
@result_bp.route('/admin/download/<path:reg_no>', methods=['GET'])
@jwt_required()
def admin_download_result(reg_no):
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"msg": "Only admins can download student results"}), 403

    return generate_result_pdf_response(reg_no)

# 🔁 Shared logic between student/admin download
def generate_result_pdf_response(reg_no):
    student = Student.query.filter_by(reg_no=reg_no).first()
    if not student:
        return jsonify({"msg": "Student not found"}), 404

    results = Result.query.filter_by(student_id=student.id).all()
    if not results:
        return jsonify({"msg": "No results to download"}), 404

    result_data = []
    total = 0

    for r in results:
        subject = Subject.query.get(r.subject_id)
        if not subject:
            continue
        grade = calculate_grade(r.score)
        total += r.score
        result_data.append((subject.name, r.score, grade))

    average = round(total / len(results), 2)

    pdf_bytes = generate_result_pdf(
        student_name=student.name,
        class_name=student.class_name,
        reg_no=student.reg_no,
        term="2nd Term",
        session="2023/2024",
        results=result_data,
        total=total,
        average=average
    )

    return send_file(
        io.BytesIO(pdf_bytes),
        download_name=f"{student.name}_result.pdf",
        mimetype="application/pdf",
        as_attachment=True
    )

