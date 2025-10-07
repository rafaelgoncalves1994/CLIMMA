from flask_sqlalchemy import SQLAlchemy
from flask import Flask

db = SQLAlchemy()

def init_db(app: Flask):
    # Substitua pela sua connection string do Supabase
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:[estacaounifoa]@db.kmpdlwctrovmwzdpmanr.supabase.co:5432/postgres"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    # Cria tabelas automaticamente caso não existam
    with app.app_context():
        db.create_all()
