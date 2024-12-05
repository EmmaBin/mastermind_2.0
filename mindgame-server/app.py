from flask import Flask, request, jsonify
from database import connect_with_db
from flask_login import login_user, login_required, logout_user, current_user, LoginManager, UserMixin
import requests
from generate_random import generate_random
from datetime import datetime

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


@app.route("/register", methods=["POST"])
def register():
    # parse json data into python dictionary
    data = request.json
    user_name = data.get("userName")
    user_password = data.get("userPassword")
    user_email = data.get("userEmail")
    print(f"**********{user_email}")

    if not user_name or not user_password or not user_email:
        return jsonify({"error": "Missing required fields"}), 400

    # inputs are invalid
    if len(user_name) > 50 or len(user_email) > 100 or len(user_password) > 25:
        return jsonify({"error": "Input exceeds maximum allowed length"}), 400

    try:
        connection = connect_with_db()
        curs = connection.cursor()

        # check if the email already exists
        curs.execute("SELECT * FROM users WHERE email = %s", (user_email,))
        existing_email = curs.fetchone()
        if existing_email:
            return jsonify({"error": "Email already exists. Please log in or use a different email."}), 409

        # check if the username already exists
        curs.execute("SELECT * FROM users WHERE username = %s", (user_name,))
        existing_username = curs.fetchone()
        if existing_username:
            return jsonify({"error": "Username already exists. Please choose a different username."}), 409

        # insert new user
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

    try:
        connection = connect_with_db()
        curs = connection.cursor()
        curs.execute("INSERT INTO Game (secret_code, start_time, user_id) VALUES(%s, NOW(), %s) RETURNING id",
                     (secret_code, current_user.id))
        game_id = curs.fetchone()[0]
        connection.commit()
        print(f"$$$$$$$${game_id}")
        return jsonify({"message": "New game created!", "gameId": game_id, "secretCode": secret_code}), 201
    except Exception as e:
        print(f"Error saving game to database: {e}")
        return jsonify({"error": "Unable to create a new game. Please try again later."}), 500
    finally:
        if connection:
            curs.close()
            connection.close()


@app.route("/game/<int:game_id>/win", methods=["POST"])
@login_required
def record_game_win(game_id):
    return record_game_result(game_id, True)


@app.route("/game/<int:game_id>/lose", methods=["POST"])
@login_required
def record_game_lose(game_id):
    return record_game_result(game_id, False)


def record_game_result(game_id, win_status):
    data = request.json
    if not data or "guess" not in data:
        return jsonify({"error": "Invalid input data"}), 400

    guess = data["guess"]

    try:
        with connect_with_db() as connection:
            with connection.cursor() as curs:
                curs.execute(
                    "UPDATE Game SET end_time=NOW(), win=%s, guesses=%s WHERE id=%s",
                    (win_status, guess, game_id)
                )
                connection.commit()
                message = "Winning game data saved!" if win_status else "Lost game data saved!"
                return jsonify({"message": message}), 201
    except Exception as e:
        print(f"Error saving game data to database: {e}")
        return jsonify({"error": "Unable to save to game database. Please try again later."}), 500


@app.route('/halloffame', methods=["GET"])
def get_names_based_on_criteria():
    selection = request.args.get("criteria", "mostWins")

    try:
        connection = connect_with_db()
        curs = connection.cursor()

        if selection == "mostWins":
            query = """
                SELECT username, COUNT(*) AS wins, TO_CHAR(MIN(end_time - start_time), 'HH24:MI:SS') AS time_spent, MIN(guesses) AS guesses
                FROM users
                JOIN Game ON users.id = Game.user_id
                WHERE Game.win = True
                GROUP BY username
                ORDER BY wins DESC
                LIMIT 3;
            """
        elif selection == "leastTime":
            query = """
                SELECT username, COUNT(*) AS wins, TO_CHAR(MIN(end_time - start_time), 'HH24:MI:SS') AS time_spent, MIN(guesses) AS guesses
                FROM users
                JOIN Game ON users.id = Game.user_id
                WHERE Game.win = True AND end_time IS NOT NULL
                GROUP BY username
                ORDER BY MIN(EXTRACT(EPOCH FROM end_time - start_time)) ASC
                LIMIT 3;
            """

        elif selection == "leastGuess":
            query = """
                SELECT username, COUNT(*) AS wins, TO_CHAR(MIN(end_time - start_time), 'HH24:MI:SS') AS time_spent, MIN(guesses) AS guesses
                FROM users
                JOIN Game ON users.id = Game.user_id
                WHERE Game.win = True AND end_time IS NOT NULL
                GROUP BY username
                ORDER BY MIN(guesses) ASC
                LIMIT 3;
            """

        curs.execute(query)
        results = curs.fetchall()

        if not results:
            return jsonify({"message": "No data available for the selected criteria."}), 200

            # Convert results to a list of dictionaries
        result_list = []
        for row in results:
            result_list.append(
                {"username": row[0], "wins": row[1], "time_spent": row[2], "guesses": row[3]})

        return jsonify(result_list), 200

    except Exception as e:
        print(f"Error fetching Hall of Fame: {e}")
        return jsonify({"error": "Unable to fetch Hall of Fame"}), 500
    finally:
        if connection:
            curs.close()
            connection.close()


@app.route('/game/<int:game_id>/guesses', methods=["POST"])
@login_required
def save_guess(game_id):
    data = request.json

    guess = data.get("guess")
    correct_numbers = data.get("correctNumbers")
    correct_locations = data.get("correctLocations")

    if not guess or correct_numbers is None or correct_locations is None:
        return jsonify({"error": "Invalid input data"}), 400

    try:
        connection = connect_with_db()
        curs = connection.cursor()

        query = """
            INSERT INTO GameGuesses (game_id, guess, correct_numbers, correct_locations)
            VALUES (%s, %s, %s, %s)
        """
        curs.execute(
            query, (game_id, guess, correct_numbers, correct_locations))
        connection.commit()

        return jsonify({"message": "Guess saved successfully!"}), 201
    except Exception as e:
        print(f"Error saving guess: {e}")
        return jsonify({"error": "Failed to save guess"}), 500
    finally:
        if connection:
            curs.close()
            connection.close()


@app.route('/game/<int:game_id>/guesses', methods=["GET"])
@login_required
def get_guesses(game_id):
    try:
        connection = connect_with_db()
        curs = connection.cursor()

        query = """
            SELECT guess, correct_numbers, correct_locations
            FROM GameGuesses
            WHERE game_id = %s
            ORDER BY id ASC
        """
        curs.execute(query, (game_id,))
        results = curs.fetchall()

        guesses = []

        for row in results:
            guesses.append(
                {
                    "guess": row[0],
                    "correct_numbers": row[1],
                    "correct_locations": row[2],
                }
            )

        return jsonify(guesses), 200
    except Exception as e:
        print(f"Error fetching guesses: {e}")
        return jsonify({"error": "Failed to fetch guesses"}), 500
    finally:
        if connection:
            curs.close()
            connection.close()


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    try:
        logout_user()
        return jsonify({"message": "The User logged out successfully"}), 200
    except Exception as e:
        print(f"Error during logout: {e}")
        return jsonify({"error": "Logout failed. Please try again later."}), 500


if __name__ == '__main__':
    app.run(debug=True)
