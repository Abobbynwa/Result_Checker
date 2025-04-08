from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.student import Student
from models.result import Result
from models.subject import Subject
from extensions import db
import pandas as pd

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/upload_csv', methods=['POST'])
@jwt_required()
def upload_csv():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"msg": "Unauthorized"}), 403

    if 'file' not in request.files:
        return jsonify({"msg": "CSV file required"}), 400

    file = request.files['file']
    
    try:
        df = pd.read_csv(file)
    except Exception as e:
        return jsonify({"msg": f"Failed to read CSV: {str(e)}"}), 400

    added = 0
    for _, row in df.iterrows():
        student = Student.query.filter_by(reg_no=row['reg_no']).first()
        subject = Subject.query.filter_by(name=row['subject']).first()

        if student and subject:
            result = Result(
                student_id=student.id,
                subject_id=subject.id,
                score=row['score'],
                term=row['term'],
                session=row['session']
            )
            db.session.add(result)
            added += 1

    db.session.commit()
    return jsonify({"msg": f"Upload complete. {added} results added."}), 200
