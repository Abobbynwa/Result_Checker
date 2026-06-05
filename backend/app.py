import os
from flask import Flask
from flask_cors import CORS
from extensions import db, jwt, mail
from config import Config

from routes.auth_routes import auth_bp
from routes.student_routes import student_bp
from routes.result_routes import result_bp
from routes.admin_routes import admin_bp


def create_app():
    Config.validate()

    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    CORS(
        app,
        resources={r"/api/*": {"origins": app.config.get("FRONTEND_URL", "http://localhost:5173")}},
        supports_credentials=True,
    )

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(student_bp, url_prefix="/api/student")
    app.register_blueprint(result_bp, url_prefix="/api/results")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    @app.get("/api/health")
    def health_check():
        return {"status": "ok"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=os.getenv("FLASK_DEBUG", "false").lower() == "true")
