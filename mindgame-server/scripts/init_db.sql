CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE Game (
    id SERIAL PRIMARY KEY,
    secret_code VARCHAR(10) NOT NULL, 
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP DEFAULT NULL,
    win BOOLEAN DEFAULT FALSE NOT NULL,
    guesses INT DEFAULT 0,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE GameGuesses (
    id SERIAL PRIMARY KEY,
    game_id INT NOT NULL,
    guess VARCHAR(10) NOT NULL,
    correct_numbers INT NOT NULL,
    correct_locations INT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES Game(id) ON DELETE CASCADE
);

