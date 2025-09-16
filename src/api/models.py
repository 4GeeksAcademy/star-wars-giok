from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Column, Table, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship 

db = SQLAlchemy()

# === Association Tables con PK compuesto y nombres *_id ===
people_favorites = Table(
    "people_favorites",
    db.metadata,
    Column("user_id", ForeignKey("user.id", ondelete="CASCADE"), primary_key=True, index=True),
    Column("people_id", ForeignKey("people.id", ondelete="CASCADE"), primary_key=True, index=True),
    UniqueConstraint("user_id", "people_id", name="uq_user_people")
)

planet_favorites = Table(
    "planet_favorites",
    db.metadata,
    Column("user_id", ForeignKey("user.id", ondelete="CASCADE"), primary_key=True, index=True),
    Column("planet_id", ForeignKey("planet.id", ondelete="CASCADE"), primary_key=True, index=True),
    UniqueConstraint("user_id", "planet_id", name="uq_user_planet")
)

vehicle_favorites = Table(
    "vehicle_favorites",
    db.metadata,
    Column("user_id", ForeignKey("user.id", ondelete="CASCADE"), primary_key=True, index=True),
    Column("vehicle_id", ForeignKey("vehicle.id", ondelete="CASCADE"), primary_key=True, index=True),
    UniqueConstraint("user_id", "vehicle_id", name="uq_user_vehicle")
)

class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    people_favorites: Mapped[list["People"]] = relationship(
        secondary=people_favorites,
        back_populates="users",
        lazy="selectin"
    )
    planet_favorites: Mapped[list["Planet"]] = relationship(
        secondary=planet_favorites,
        back_populates="users",
        lazy="selectin"
    )
    vehicle_favorites: Mapped[list["Vehicle"]] = relationship(
        secondary=vehicle_favorites,
        back_populates="users",
        lazy="selectin"
    )

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "people_favorites": [p.serialize() for p in self.people_favorites],
            "planet_favorites": [p.serialize() for p in self.planet_favorites],
            "vehicle_favorites": [v.serialize() for v in self.vehicle_favorites],
        }

class People(db.Model):
    __tablename__ = "people"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    hair_color: Mapped[str] = mapped_column(nullable=False)
    gender: Mapped[str] = mapped_column(String(60), nullable=False)

    eye_color: Mapped[str] = mapped_column(String(60), nullable=True)
    birth_year: Mapped[str] = mapped_column(String(20), nullable=True)
    height: Mapped[int] = mapped_column(nullable=True)
    mass: Mapped[int] = mapped_column(nullable=True)

    users: Mapped[list["User"]] = relationship(
        secondary=people_favorites,
        back_populates="people_favorites",
        lazy="selectin"
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "hair_color": self.hair_color,
            "gender": self.gender,
            "eye_color": self.eye_color,
            "birth_year": self.birth_year,
            "height": self.height,
            "mass": self.mass,
        }

class Planet(db.Model):
    __tablename__ = "planet"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(120), unique=True, nullable=False)
    diameter: Mapped[int] = mapped_column(db.Integer, nullable=True)

    users: Mapped[list["User"]] = relationship(
        secondary=planet_favorites,
        back_populates="planet_favorites",
        lazy="selectin"
    )

    def serialize(self):
        return {"id": self.id, "name": self.name, "diameter": self.diameter}

class Vehicle(db.Model):
    __tablename__ = "vehicle"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(120), unique=True, nullable=False)
    model: Mapped[str] = mapped_column(db.String(120), nullable=True)
    manufacturer: Mapped[str] = mapped_column(db.String(120), nullable=True)
    crew: Mapped[int] = mapped_column(db.Integer, nullable=True)

    users: Mapped[list["User"]] = relationship(
        secondary=vehicle_favorites,
        back_populates="vehicle_favorites",
        lazy="selectin"
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "model": self.model,
            "manufacturer": self.manufacturer,
            "crew": self.crew,
        }
