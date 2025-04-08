import csv
from app import create_app
from extensions import db
from models.student import Student
from models.result import Result
from models.subject import Subject
from models.admin import Admin

# Optional log table
try:
    from models.login_log import LoginLog
    has_log = True
except:
    has_log = False

app = create_app()

def export_table(query, filename, fieldnames):
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for record in query:
            writer.writerow({field: getattr(record, field, '') for field in fieldnames})

with app.app_context():
    export_table(Student.query.all(), 'students.csv', [
        'id', 'name', 'reg_no', 'username', 'class_name', 'dob', 'email', 'gender'
    ])
    
    export_table(Result.query.all(), 'results.csv', [
        'id', 'student_id', 'subject_id', 'score', 'term', 'session'
    ])

    export_table(Subject.query.all(), 'subjects.csv', ['id', 'name'])

    export_table(Admin.query.all(), 'admin.csv', ['id', 'username', 'password'])

    if has_log:
        export_table(LoginLog.query.all(), 'login_log.csv', ['id', 'student_id', 'timestamp', 'ip'])

    print("✅ Export complete. CSVs saved in backend root.")
