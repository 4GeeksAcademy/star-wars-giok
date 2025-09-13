from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Column, Table, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship 

db = SQLAlchemy()


people_favorites = Table(
    "people_favorites",
    db.metadata,
    Column("user_id", ForeignKey("user.id")),
    Column("people", ForeignKey("people.id"))
)


planet_favorites =Table(
    "planet_favorites",
    db.metadata,
    Column("user_id", ForeignKey("user.id")),
    Column("planet", ForeignKey("planet.id"))
)

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    people_favorites: Mapped[list["People"]] = relationship(secondary="people_favorites", back_populates=("users"))
    planet_favorites: Mapped[list["Planet"]] = relationship(secondary="planet_favorites", back_populates=("users"))


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "people_favorites": [p.serialize() for p in self.people_favorites],
            "planet_favorites": [p.serialize() for p in self.planet_favorites]
            # do not serialize the password, its a security breach
        }
    
class People(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    hair_color: Mapped[str] = mapped_column(nullable=False)
    gender: Mapped[str] = mapped_column(String(60), nullable=False)
    users: Mapped[list["User"]] = relationship(secondary="people_favorites", back_populates=("people_favorites"))


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "hair_color": self.hair_color,
            "gender": self.gender,
        }
    

class Planet(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(120), unique=True, nullable=False)
    diameter:Mapped[int] = mapped_column(db.Integer, nullable=True)
    users: Mapped[list["User"]] = relationship(secondary="planet_favorites", back_populates=("planet_favorites"))


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "diameter": self.diameter,
        }
