# Mastermind Game 2.0

## Overview
MindGame 2.0 is a number guessing game where players must guess a sequence of random numbers within 10 attempts. The game generates a sequence of random numbers, which can repeat, and challenges the player to guess the correct numbers and their positions.

- The game generates 4/5/6 random numbers between 0 and 9 based on user's selection.
- The user has 10 attempts to guess the sequence.
- The numbers may repeat in the sequence.
- Feedback is provided after each guess to indicate correctness.
- The game ends if the user guesses the sequence or exhausts all attempts.

---
## Sample Play
Example:  
<img src="images/home.png"/>
<img src="images/setting.png"/>
<img src="images/game_play.png"/>

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
<td align="left">'/register'</td>
<td align="left">Create a new user instance in the `users` table in the database.</td>
</tr>
<tr>
<td align="center">POST</td>
<td align="left">'/login'</td>
<td align="left">Validate the user's credentials and log them in if valid. </td>
</tr>
<tr>
<td align="center">POST</td>
<td align="left">'/new_game'</td>
<td align="left">Create a new game instance in the `Game` table and return a game ID and secret code.</td>
</tr>
<tr>
<td align="center">GET</td>
<td align="left">'/halloffame'</td>
<td align="left">Retrieve the top 3 users based on the user's selected criteria (e.g., wins, time, guesses).</td>
</tr>
<tr>
<td align="center">POST</td>
<td align="left">'/game/<int:game_id>/guesses'</td>
<td align="left">Record the user's guess and save it to the `GameGuesses` table.</td>
</tr>
<tr>
<td align="center">GET</td>
<td align="left">'/game/<int:game_id>/guesses'</td>
<td align="left">Retrieve all guesses for a specific game ID. </td>
</tr>
<tr>
<td align="center">POST</td>
<td align="left">'/game/<int:game_id>/win'</td>
<td align="left">Record the game as won for the current user.</td>
</tr>
<tr>
<td align="center">POST</td>
<td align="left">'/game/<int:game_id>/lose'</td>
<td align="left">Record the game as lost for the current user.  </td>
</tr>
<tr>
<td align="center">POST</td>
<td align="left">'/logout'</td>
<td align="left">Log out the current user and clear the session. </td>
</tr>
</tbody>
</table>