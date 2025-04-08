from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.student import Student
from models.result import Result
from models.subject import Subject
from extensions import db

student_bp = Blueprint('student', __name__)

@student_bp.route('/me', methods=['GET'])
@jwt_required()
def student_profile():
    user = get_jwt_identity()
    if user['role'] != 'student':
        return jsonify({"msg": "Access denied"}), 403

    student = Student.query.get(user['id'])

    return jsonify({
        "name": student.name,
        "class_name": student.class_name,
        "reg_no": student.reg_no
    })

