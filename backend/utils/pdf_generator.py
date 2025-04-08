from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io

def generate_result_pdf(student_name, class_name, reg_no, term, session, results, total, average):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)

    # Header
    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, 770, "Abobby International College")

    p.setFont("Helvetica", 12)
    p.drawString(50, 750, f"Student: {student_name}")
    p.drawString(50, 735, f"Class: {class_name} | Reg No: {reg_no}")
    p.drawString(50, 720, f"Term: {term} | Session: {session}")
    p.drawString(50, 705, "-------------------------------------------")

    y = 680
    for entry in results:
        subject, score, grade = entry
        p.drawString(50, y, f"{str(subject)}: {str(score)} ({str(grade)})")
        y -= 20

    p.drawString(50, y-10, "-------------------------------------------")
    p.drawString(50, y-30, f"Total Score: {total}")
    p.drawString(50, y-50, f"Average Score: {average}%")

    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer.read()
