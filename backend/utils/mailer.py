from flask_mail import Message
from extensions import mail

def send_result_email(to_email, subject, html, attachments=None):
    msg = Message(subject, recipients=[to_email], html=html)

    if attachments:
        for file in attachments:
            msg.attach(
                file["filename"],
                "application/pdf",
                file["data"]
            )

    mail.send(msg)
