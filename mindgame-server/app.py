from flask import Flask, request, jsonify
from database import connect_with_db
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/register", methods=["POST"])
def register():
    # parse json data into python dictionary
    data = request.json
    user_name = data.get("userName")
    user_password = data.get("userPassword")
    user_email = data.get("userEmail")
    print(f"**********{user_email}")

    # case 1, inputs are invalid
    if len(user_name) > 50 or len(user_email) > 100 or len(user_password) > 25:
        return jsonify({"error": "Input exceeds maximum allowed length"}), 400

    if not user_name or not user_password or not user_email:
        return jsonify({"error": "Unable to register"}), 404
    try:
        connection = connect_with_db()
        curs = connection.cursor()
        # (user_emai,) is a tuple
        curs.execute("SELECT * FROM users WHERE email = %s", (user_email,))
        existing_user = curs.fetchone()

        # case 2, email already exist, prompt user to login
        if existing_user:
            return jsonify({"error": "Email already exists. Please log in. Or register using a different email"}), 409

        curs.execute("INSERT INTO users (username, password, email) VALUES (%s, %s, %s)",
                     (user_name, user_password, user_email))

        connection.commit()
        curs.close()
        connection.close()
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        print(f"Error during registration: {e}")
        return jsonify({"error": "Unable to register. Please try again later."}), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    user_email = data.get("userEmail")
    user_password = data.get("userPassword")
    # check if valid data
    if not data or not user_email or not user_password:
        return jsonify({"message": "Email and password are required."}), 400

    # check if email and password matches, if it is return user_name, if not prompt message

    try:
        connection = connect_with_db()
        curs = connection.cursor()
        curs.execute("SELECT username FROM users WHERE email = %s AND password = %s",
                     (user_email, user_password))
        user_data = curs.fetchone()

        if user_data:
            return jsonify({"username": user_data[0]}), 200
        else:
            return jsonify({"message": "Invalid credentials. Please try again."}), 401
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"error": "Unable to login. Please try again later."}), 500
    finally:
        if connection:
            connection.close()


if __name__ == '__main__':
    app.run(debug=True)
