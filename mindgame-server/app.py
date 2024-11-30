from flask import Flask, request, jsonify
from database import connect_with_db
from flask_login import login_user, login_required, logout_user, current_user, LoginManager, UserMixin
import requests
import generate_random

app = Flask(__name__)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
app.secret_key = "secret"


class User(UserMixin):
    def __init__(self, id, username, email):
        self.id = id
        self.username = username
        self.email = email


@login_manager.user_loader
def load_user(user_id):
    connection = connect_with_db()
    cursor = connection.cursor()
    try:

        cursor.execute(
            "SELECT id, username, email FROM users WHERE id = %s", (user_id,))
        user_data = cursor.fetchone()
        if user_data:

            return User(user_data[0], user_data[1], user_data[2])
        return None
    finally:
        cursor.close()
        connection.close()


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
        # (user_email,) is a tuple
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
        curs.execute(
            "SELECT id, username, email FROM users WHERE email = %s AND password = %s",
            (user_email, user_password)
        )
        user_data = curs.fetchone()

        if user_data:
            user = User(user_data[0], user_data[1],
                        user_data[2])
            login_user(user)
            return jsonify({"username": user.username}), 200
        else:
            return jsonify({"message": "Invalid credentials. Please try again."}), 401
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"error": "Unable to login. Please try again later."}), 500
    finally:
        if connection:
            connection.close()


@app.route("/new_game", methods=["POST"])
@login_required
def start_game():
    data = request.json
    counts = data.get("difficulty")
    start_num = data.get("startNum")
    end_num = data.get("endNum")
    min_num = min([start_num, end_num])
    max_num = max([start_num, end_num])
    print(f"^^^^^{counts}, {min_num}, {max_num}")
    print(f"User ID: {current_user.id}")

    # 1. use data to send request to fetch(`https://www.random.org/integers/?num=${counts}&min=0&max=7&col=1&base=10&format=plain&rnd=new`)
    # 2. save data to game table, use current user info
    # 3. use new game id to return back to frontend to create new url
    # 4. send secret code to frontend

    url = f"https://www.random.org/integers/?num={counts}&min={
        min_num}&max={max_num}&col=1&base=10&format=plain&rnd=new"

    secret_code = ""
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("Request successful!")
            numbers = response.text.splitlines()
            secret_code = "".join(numbers)
            print(f"Generated Secret Code: {secret_code}")
        else:
            print("API failed, falling back to local random generator.")
            secret_code = generate_random(counts, min_num, max_num)

    except Exception as e:
        print("Error occurred while making the request. Falling back to local generator")
        print(e)
        secret_code = generate_random(counts, min_num, max_num)


if __name__ == '__main__':
    app.run(debug=True)
