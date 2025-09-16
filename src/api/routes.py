"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required
)

from src.api.models import db, User, People, Planet, Vehicle
from src.api.utils import generate_sitemap, APIException

api = Blueprint("api", __name__)
CORS(api)


@api.route("/hello", methods=["GET"])
def handle_hello():
    return jsonify({
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }), 200


# ---------------------------
# Auth
# ---------------------------
@api.route("/register", methods=["POST"])
def create_users():
    data = request.get_json(force=True)

    exist = db.session.execute(
        select(User).where(User.email == data["email"])
    ).scalar_one_or_none()

    if exist:
        return jsonify({"msg": "user already exist"}), 400

    new_user = User(
        email=data["email"],
        password=data["password"],
        is_active=True
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 200


@api.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True)

    user = db.session.execute(
        select(User).where(User.email == data["email"])
    ).scalar_one_or_none()
    if not user:
        return jsonify({"msg": "user doesnt exist"}), 400

    user = db.session.execute(
        select(User).where(
            User.email == data["email"],
            User.password == data["password"]
        )
    ).scalar_one_or_none()

    if not user:
        return jsonify({"msg": "invalid email or password"}), 400

    # ✅ identity como int
    token = create_access_token(identity=int(user.id))
    return jsonify({"msg": "logged", "token": token}), 200


@api.route("/users", methods=["GET"])
@jwt_required()
def get_user():
    # ✅ garantizamos int por si el identity llegara como string
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"msg": "user doesnt exist"}), 400
    return jsonify(user.serialize()), 200


# ---------------------------
# Resources
# ---------------------------
@api.route("/people", methods=["GET"])
def get_people():
    people = db.session.execute(select(People)).scalars().all()
    return jsonify([p.serialize() for p in people]), 200


@api.route("/people/<int:people_id>", methods=["GET"])
def get_people_id(people_id):
    people = db.session.get(People, people_id)
    if not people:
        return jsonify({"msg": "people no encontrado"}), 400
    return jsonify(people.serialize()), 200


@api.route("/planet", methods=["GET"])
def get_planet():
    planets = db.session.execute(select(Planet)).scalars().all()
    return jsonify([p.serialize() for p in planets]), 200


@api.route("/planet/<int:planet_id>", methods=["GET"])
def get_planet_id(planet_id):
    planet = db.session.get(Planet, planet_id)
    if not planet:
        return jsonify({"msg": "planeta no encontrado"}), 400
    return jsonify(planet.serialize()), 200


@api.route("/vehicles", methods=["GET"])
def get_vehicles():
    vehicles = db.session.execute(select(Vehicle)).scalars().all()
    return jsonify([v.serialize() for v in vehicles]), 200


@api.route("/vehicles/<int:vehicle_id>", methods=["GET"])
def get_vehicle_id(vehicle_id):
    vehicle = db.session.get(Vehicle, vehicle_id)
    if not vehicle:
        return jsonify({"msg": "vehículo no encontrado"}), 400
    return jsonify(vehicle.serialize()), 200


# ---------------------------
# Favorites - People
# ---------------------------
@api.route("/favorites/people/<int:people_id>", methods=["POST"])
@jwt_required()
def add_people_favorite(people_id):
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    _ = People.query.get_or_404(people_id)

    # Idempotente: si ya está, OK 200
    if any(p.id == people_id for p in user.people_favorites):
        return jsonify({"msg": "people ya es favorito", "user": user.serialize()}), 200

    people = db.session.get(People, people_id)
    user.people_favorites.append(people)
    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route("/favorites/people/<int:people_id>", methods=["DELETE"])
@jwt_required()
def delete_people_favorite(people_id):
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)

    target = next((p for p in user.people_favorites if p.id == people_id), None)
    if not target:
        return jsonify({"msg": "people no encontrado en favoritos"}), 404

    user.people_favorites.remove(target)
    db.session.commit()
    return jsonify(user.serialize()), 200


# ---------------------------
# Favorites - Planet
# ---------------------------
@api.route("/favorites/planet/<int:planet_id>", methods=["POST"])
@jwt_required()
def add_planet_favorite(planet_id):
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    _ = Planet.query.get_or_404(planet_id)

    if any(p.id == planet_id for p in user.planet_favorites):
        return jsonify({"msg": "planet ya es favorito", "user": user.serialize()}), 200

    planet = db.session.get(Planet, planet_id)
    user.planet_favorites.append(planet)
    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route("/favorites/planet/<int:planet_id>", methods=["DELETE"])
@jwt_required()
def delete_planet_favorite(planet_id):
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)

    target = next((p for p in user.planet_favorites if p.id == planet_id), None)
    if not target:
        return jsonify({"msg": "planet no encontrado en favoritos"}), 404

    user.planet_favorites.remove(target)
    db.session.commit()
    return jsonify(user.serialize()), 200


# ---------------------------
# Favorites - Vehicle
# ---------------------------
@api.route("/favorites/vehicle/<int:vehicle_id>", methods=["POST"])
@jwt_required()
def add_vehicle_favorite(vehicle_id):
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    _ = Vehicle.query.get_or_404(vehicle_id)

    if any(v.id == vehicle_id for v in user.vehicle_favorites):
        return jsonify({"msg": "vehicle ya es favorito", "user": user.serialize()}), 200

    vehicle = db.session.get(Vehicle, vehicle_id)
    user.vehicle_favorites.append(vehicle)
    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route("/favorites/vehicle/<int:vehicle_id>", methods=["DELETE"])
@jwt_required()
def delete_vehicle_favorite(vehicle_id):
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)

    target = next((v for v in user.vehicle_favorites if v.id == vehicle_id), None)
    if not target:
        return jsonify({"msg": "vehicle no encontrado en favoritos"}), 404

    user.vehicle_favorites.remove(target)
    db.session.commit()
    return jsonify(user.serialize()), 200


# ---------------------------
# (Opcional) Todos mis favoritos juntos
# ---------------------------
@api.route("/me/favorites", methods=["GET"])
@jwt_required()
def list_my_favorites():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return jsonify({
        "people": [p.serialize() for p in user.people_favorites],
        "planets": [p.serialize() for p in user.planet_favorites],
        "vehicles": [v.serialize() for v in user.vehicle_favorites],
    }), 200
