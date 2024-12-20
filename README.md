# Mastermind Game 2.0

## Overview
MindGame 2.0 is a number guessing game where players must guess a sequence of random numbers within 10 attempts. The game generates a sequence of random numbers, which can repeat, and challenges the player to guess the correct numbers and their positions.

---
## Code Structure
I built this game as a Full-Stack Web Application utilizing the Model-View-Controller architecture.
The following sections describe the main directories and their responsibilities.

## mindgame-frontend

Contains files related to the frontend of the web application.

### **Views**
 Located in the `src` folder. These are bundled using Webpack and transpiled with Babel to ensure compatibility across various browsers before being served to the client.
- Main Features:
  - React-based components for dynamic rendering.
  - Communication with the backend via RESTful APIs.
  - State management to ensure responsiveness during gameplay.

## mindgame-server

Contains files related to the backend of the web application.

### **Controllers**
- `app.py`: The main Flask application that handles routing and processes requests.
  - Functions in this file call **models** to interact with the database and transform data before sending a response to the client.

### **Database**
- `database.py`: Handles the connection to the PostgreSQL database using `psycopg2`.

### **Models**
- `scripts/init_db.sql`SQL tables for the database

---
### **Prerequisites**
- Python >= 3.8
- Node.js >= 16.x 
- PostgreSQL >= 12.x

## How to Run Locally
The game is using React for Front End and Python for backend.
Clone the project

```bash
  git clone https://github.com/EmmaBin/mastermind_2.0.git
```

Go to the Backend Directory

```bash
  cd mindgame-server
```
To install virtualenv
```
  pip install virtualenv
```

Create and activate virtual environment (virtualenv Windows)

```bash
  python -m virtualenv venv
  venv/Scripts/activate
```
Create and activate virtual environment (virtualenv Linux)

```bash
  python3 -m virtualenv venv
  source venv/bin/activate
```
Install requirements
```bash
  pip install -r requirements.txt
```
Next create a .env file in the mindgame-server directory. It should contain the following information.
```bash
  DB_NAME="mindgame"
  DB_USER="yourname"
  DB_PASSWORD="yourpassword" 
  DB_HOST="localhost" 
  DB_PORT="5432"
```
Create database
```bash
  CREATE DATABASE mindgame;
```
Run the Initialization Script: Replace <DB_USER> with your PostgreSQL username.
```bash
  psql -U <DB_USER> -d mindgame -f scripts/init_db.sql

```

Start the backend server:
```bash
  python app.py
```

Go to the Frontend Directory. The app will be served on http://localhost:3000 (default port).
```bash
  cd mindgame-frontend
```

Install Node.js. Verify the installation, run:
```bash
node -v
npm -v
```

Install Dependencies

```bash
  npm install
```

Start the Development Server
```bash
  npm start
```



---
## Technologies Used
<ul>
<li>Python</li>
<li>JavaScript</li>
<li>React</li>
<li>Flask</li>
<li>Psycopg2</li>
<li>Flask-Login</li>
<li>RESTful Services</li>
<li>Unittest</li>
<li>JSON</li>
</ul>

## Endpoints:
<table>
<thead>
<tr>
<th align="center">HTTP Verb</th>
<th align="left">URI</th>
<th align="left">Functionality</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">POST</td>
<td align="left">/register</td>
<td align="left">Create a new user instance in the `users` table in the database.</td>
</tr>
<tr>
<td align="center">POST</td>
<td align="left">/login</td>
<td align="left">Validate the user's credentials and log them in if valid.</td>
</tr>
<tr>
<td align="center">POST</td>
<td align="left">/new_game</td>
<td align="left">Create a new game instance in the `Game` table and return a game ID and secret code.</td>
</tr>
<tr>
<td align="center">GET</td>
<td align="left">/halloffame</td>
<td align="left">Retrieve the top 3 users based on the user's selected criteria (e.g., wins, time, guesses).</td>
</tr>
<tr>
<td align="center">POST</td>
<td align="left">/game/&lt;int:game_id&gt;/guesses</td>
<td align="left">Record the user's guess and save it to the `GameGuesses` table.</td>
</tr>
<tr>
<td align="center">GET</td>
<td align="left">/game/&lt;int:game_id&gt;/guesses</td>
<td align="left">Retrieve all guesses for a specific game ID.</td>
</tr>
<tr>
<td align="center">POST</td>
<td align="left">/game/&lt;int:game_id&gt;/win</td>
<td align="left">Record the game as won for the current user.</td>
</tr>
<tr>
<td align="center">POST</td>
<td align="left">/game/&lt;int:game_id&gt;/lose</td>
<td align="left">Record the game as lost for the current user.</td>
</tr>
<tr>
<td align="center">POST</td>
<td align="left">/logout</td>
<td align="left">Log out the current user and clear the session.</td>
</tr>
</tbody>
</table>
---

### Extensions
- Users can customize the number of random numbers to guess: **4(easy), 5(medium), or 6(hard)**.
- Flexible range for generated random numbers: **from 0 to 9**.
<img src="images/different_setting.png"/>

- A timer is available for each game.
- Display remaining rounds.
<img src="images/timer_and_remaining.png"/>

- Hints can be displayed during gameplay.
<img src="images/game_play.png"/>

- Supports **multi-user functionality**, allowing users to:
  - Log in with individual accounts.
  - Play their own games.
  - Track progress and feedback.
<img src="images/register.png"/>


- User history tracking, including least time spent, most wins and least guesses.
- Unittest for certain route.

## Sample Play
Example:  
<img src="images/setting_with_criteria.png"/>
<img src="images/different_setting.png"/>
<img src="images/gameplay.png"/>


---

