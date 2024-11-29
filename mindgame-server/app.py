from flask import Flask, request, jsonify
from database import connect_with_db
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

    
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


#case 1, email already exist, prompt user to login

@app.route("/register", methods=["POST"])
def register():
    #parse json data into python dictionary
    data = request.json
    user_name = data.get("userName")
    user_password = data.get("userPassword")
    user_email = data.get("userEmail")
    print(f"**********{user_email}")
    
    if len(user_name) > 50 or len(user_email) > 100 or len(user_password) > 25:
        return jsonify({"error": "Input exceeds maximum allowed length"}), 400

    if not user_name or not user_password or not user_email:
        return jsonify({"error": "Unable to register"}), 404
    try:
        connection = connect_with_db()
        curs= connection.cursor()
        #(user_emai,) is a tuple
        curs.execute("SELECT * FROM users WHERE email = %s", (user_email,))
        existing_user = curs.fetchone()

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






if __name__ == '__main__':  
   app.run(debug=True)