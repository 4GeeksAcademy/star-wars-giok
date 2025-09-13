"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, People, Planet, people_favorites, planet_favorites
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/register', methods=['POST'])
def create_users():
    data=request.json
    exist=db.session.execute(select(User).where(User.email == data["email"])).scalar_one_or_none()
    if exist:
        return jsonify({"msg":"user already exist"}), 400
    new_user=User(
        email=data["email"],
        password=data["password"],
        is_active=True
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 200


@api.route('/login', methods=['POST'])
def login():
    data=request.json
    exist=db.session.execute(select(User).where(User.email == data["email"])).scalar_one_or_none()
    if not exist:
        return jsonify({"msg":"user doesnt exist"}), 400
    user=db.session.execute(select(User).where(User.email == data["email"],User.password == data["password"])).scalar_one_or_none()
    if not user:
        return jsonify({"msg":"invalid email or password"}), 400
    token=create_access_token(identity=str(user.id))
    
    return jsonify({"msg": "logged", "token":token}), 200


@api.route('/users', methods=['GET'])
@jwt_required()
def get_user():
    user_id=get_jwt_identity()
    user=db.session.get(User,user_id)
    if not user:
        return jsonify({"msg":"user doesnt exist"}), 400
    
    return jsonify(user.serialize()), 200


@api.route('/people', methods=['GET'])
def get_people():
    people=db.session.execute(select(People)).scalars().all()
    
    return jsonify([p.serialize() for p in people]), 200


@api.route('/planet', methods=['GET'])
def get_planet():
    planet=db.session.execute(select(Planet)).scalars().all()
    
    return jsonify([p.serialize() for p in planet]), 200

@api.route('/planet/<int:planet_id>', methods=['GET'])
def get_planet_id(planet_id):
    planet=db.session.get(Planet,planet_id)
    if not planet: 
        return jsonify({"msg":"planeta no encontrado"}), 400
    print(planet)
    return jsonify(planet.serialize()), 200

@api.route('/people/<int:people_id>', methods=['GET'])
def get_people_id(people_id):
    people=db.session.get(People,people_id)
    if not people: 
        return jsonify({"msg":"people no encontrado"}), 400
    
    return jsonify(people.serialize()), 200


@api.route('/favorites/people/<int:people_id>', methods=['POST'])
@jwt_required()
def add_people_favorite(people_id):
    user_id=get_jwt_identity()
    user=User.query.get_or_404(user_id)
    people=People.query.get_or_404(people_id)
    if people in user.people_favorites:
        return jsonify({"msg":"people ya es favorito"}), 400
    user.people_favorites.append(people)
    db.session.commit()

    return jsonify(user.serialize()), 200


@api.route('/favorites/people/<int:people_id>', methods=['DELETE'])
@jwt_required()
def delete_people_favorite(people_id):
    user_id=get_jwt_identity()
    user=User.query.get_or_404(user_id)
    people=People.query.get_or_404(people_id)
    if people not in user.people_favorites:
        return jsonify({"msg":"people no encontrado"}), 400
    user.people_favorites.remove(people)
    db.session.commit()

    return jsonify(user.serialize()), 200




@api.route('/favorites/planet/<int:planet_id>', methods=['POST'])
@jwt_required()
def add_planet_favorite(planet_id):
    user_id=get_jwt_identity()
    user=User.query.get_or_404(user_id)
    planet=Planet.query.get_or_404(planet_id)
    if planet in user.planet_favorites:
        return jsonify({"msg":"planet ya es favorito"}), 400
    user.planet_favorites.append(planet)
    db.session.commit()

    return jsonify(user.serialize()), 200



@api.route('/favorites/planet/<int:planet_id>', methods=['DELETE'])
@jwt_required()
def delete_planet_favorite(planet_id):
    user_id=get_jwt_identity()
    user=User.query.get_or_404(user_id)
    planet=Planet.query.get_or_404(planet_id)
    if planet not in user.planet_favorites:
        return jsonify({"msg":"planet no encontrado"}), 400
    user.planet_favorites.remove(planet)
    db.session.commit()

    return jsonify(user.serialize()), 200