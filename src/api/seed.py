# src/api/seed.py
import click
from typing import Optional

from src.app import create_app                      # ✅ usa la misma app de tu backend
from src.api.models import db, People, Planet, Vehicle
from src.api.people_data import PEOPLE_DATA
from src.api.planet_data import PLANET_DATA
from src.api.vehicle_data import VEHICLE_DATA

app = create_app()                                  # ✅ misma configuración/DB que tu servidor

def _to_int(v: Optional[str]):
    try:
        return int(v) if v not in (None, "", "unknown", "n/a") else None
    except Exception:
        return None

def run_seed():
    print("🚀 Iniciando seed con la MISMA configuración de la app...")

    # --- Limpia SOLO catálogos (no usuarios ni favoritos) ---
    db.session.query(Vehicle).delete()
    db.session.query(Planet).delete()
    db.session.query(People).delete()
    db.session.commit()

    # --- People ---
    print("Seeding People...")
    people_objs = []
    for it in PEOPLE_DATA:
        people_objs.append(People(
            # Si tus datos traen id y quieres respetarlo, déjalo:
            id=it.get("id"),
            name=it["name"],
            hair_color=it.get("hair_color", "unknown"),
            gender=it.get("gender", "unknown"),
            eye_color=it.get("eye_color"),
            birth_year=it.get("birth_year"),
            height=_to_int(it.get("height")),
            mass=_to_int(it.get("mass")),
        ))
    db.session.bulk_save_objects(people_objs)

    # --- Planets ---
    print("Seeding Planets...")
    planet_objs = []
    for it in PLANET_DATA:
        planet_objs.append(Planet(
            id=it.get("id"),
            name=it["name"],
            diameter=_to_int(it.get("diameter")),
        ))
    db.session.bulk_save_objects(planet_objs)

    # --- Vehicles ---
    print("Seeding Vehicles...")
    vehicle_objs = []
    for it in VEHICLE_DATA:
        vehicle_objs.append(Vehicle(
            id=it.get("id"),
            name=it["name"],
            model=it.get("model"),
            manufacturer=it.get("manufacturer"),
            crew=_to_int(it.get("crew")),
        ))
    db.session.bulk_save_objects(vehicle_objs)

    db.session.commit()
    print("✅ Seed completado con éxito.")

if __name__ == "__main__":
    with app.app_context():                         # ✅ contexto de la MISMA app
        run_seed()
