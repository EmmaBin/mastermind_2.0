# This file connects postgresql with flask

import psycopg2
from dotenv import load_dotenv
import os
load_dotenv()

def connect_with_db():
    try:
        connection = psycopg2.connect(
            database= os.getenv("DB_NAME"),
            user= os.getenv("DB_USER"),
            password= os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")

        )
        return connection
    except Exception:
        print(Exception)
        print("unable to connect with database")
        return None


